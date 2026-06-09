<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "config.php";

$database = new Database();
$db = $database->connect();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['userid']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Missing userid or password"]);
    exit;
}

$userid = trim($data['userid']);
$password = trim($data['password']); // Plain text

try {
    $stmt = $db->prepare("SELECT * FROM users WHERE userid = :userid LIMIT 1");
    $stmt->bindParam(":userid", $userid);
    $stmt->execute();

    if ($stmt->rowCount() === 1) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($password === $user['password']) { // Direct string match
            unset($user['password']);
            echo json_encode(["status" => "success", "message" => "Login successful", "data" => $user]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid password"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>