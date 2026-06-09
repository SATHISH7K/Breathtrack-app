<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Include the database config file
require_once 'config.php'; // rename your file if needed (e.g., Database.php)

// Initialize DB connection
$db = new Database();
$conn = $db->connect();

// Detect request method
$method = $_SERVER['REQUEST_METHOD'];

// ========== POST: Add YouTube Video ==========
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['title']) || !isset($data['youtube_url'])) {
        echo json_encode(["status" => "error", "message" => "Missing required fields."]);
        exit;
    }

    $title = trim($data['title']);
    $youtube_url = trim($data['youtube_url']);

    // Validate YouTube link
    if (!preg_match("/(youtube\.com|youtu\.be)/", $youtube_url)) {
        echo json_encode(["status" => "error", "message" => "Invalid YouTube URL."]);
        exit;
    }

    try {
        $stmt = $conn->prepare("INSERT INTO youtube_videos (title, youtube_url) VALUES (:title, :youtube_url)");
        $stmt->bindParam(':title', $title);
        $stmt->bindParam(':youtube_url', $youtube_url);
        $stmt->execute();

        echo json_encode([
            "status" => "success",
            "message" => "YouTube video added successfully.",
            "video_id" => $conn->lastInsertId()
        ]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Database insert failed: " . $e->getMessage()]);
    }
}

// ========== GET: Fetch All YouTube Videos ==========
else if ($method === 'GET') {
    try {
        $query = "SELECT * FROM youtube_videos ORDER BY uploaded_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $videos = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Extract YouTube video ID from the URL
            $youtube_id = null;
            $url = $row['youtube_url'];
            parse_str(parse_url($url, PHP_URL_QUERY), $queryParams);
            if (isset($queryParams['v'])) {
                $youtube_id = $queryParams['v'];
            } else {
                // For shortened links like youtu.be/abcd1234
                $youtube_id = basename(parse_url($url, PHP_URL_PATH));
            }

            $videos[] = [
                "id" => $row['id'],
                "title" => $row['title'],
                "youtube_url" => $row['youtube_url'],
                "embed_url" => "https://www.youtube.com/embed/" . $youtube_id,
                "uploaded_at" => $row['uploaded_at']
            ];
        }

        echo json_encode(["status" => "success", "videos" => $videos]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error fetching videos: " . $e->getMessage()]);
    }
}

// ========== INVALID METHOD ==========
else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
