<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "config.php";

$database = new Database();
$db = $database->connect();

$data = json_decode(file_get_contents("php://input"), true);

// Validation
if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Username and password required"]);
    exit;
}

$username = trim($data['username']);
$password = trim($data['password']); // 🔹 No encryption
$email = isset($data['email']) ? trim($data['email']) : null;
$phone = isset($data['phone']) ? trim($data['phone']) : null;
$role = isset($data['role']) && $data['role'] === 'doctor' ? 'doctor' : 'patient';

try {
    if ($role === 'patient') {
        // Generate next patient ID (pat_001, pat_002, etc.)
        $stmt = $db->query("SELECT userid FROM users WHERE role='patient' ORDER BY id DESC LIMIT 1");
        $last = $stmt->fetch(PDO::FETCH_ASSOC);
        $nextNumber = 1;

        if ($last) {
            $num = intval(substr($last['userid'], 4));
            $nextNumber = $num + 1;
        }

        $userid = "pat_" . str_pad($nextNumber, 3, "0", STR_PAD_LEFT);
    } else {
        // Generate next doctor ID (doc_001, doc_002, etc.)
        $stmt = $db->query("SELECT userid FROM users WHERE role='doctor' ORDER BY id DESC LIMIT 1");
        $last = $stmt->fetch(PDO::FETCH_ASSOC);
        $nextNumber = 1;

        if ($last) {
            $num = intval(substr($last['userid'], 4));
            $nextNumber = $num + 1;
        }

        $userid = "doc_" . str_pad($nextNumber, 3, "0", STR_PAD_LEFT);
    }

    // Insert into database
    $insert = $db->prepare("INSERT INTO users (userid, username, password, email, phone, role)
                            VALUES (:userid, :username, :password, :email, :phone, :role)");
    $insert->execute([
        ':userid' => $userid,
        ':username' => $username,
        ':password' => $password,
        ':email' => $email,
        ':phone' => $phone,
        ':role' => $role
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "User registered successfully",
        "userid" => $userid,
        "role" => $role
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>