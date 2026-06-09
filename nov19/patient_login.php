<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "config.php";

$database = new Database();
$db = $database->connect();

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['patient_id']) || empty($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Patient ID or Password missing"]);
    exit;
}

$patient_id = trim($data['patient_id']);
$password = trim($data['password']);

try {
    $stmt = $db->prepare("SELECT * FROM patients WHERE patient_id = :patient_id LIMIT 1");
    $stmt->bindParam(":patient_id", $patient_id);
    $stmt->execute();

    if ($stmt->rowCount() === 1) {
        $patient = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($password === $patient['password']) {
            echo json_encode([
                "status" => "success",
                "message" => "Login successful",
                "patient_id" => $patient['patient_id'],
                "name" => $patient['name'],
                "age" => $patient['age'],
                "gender" => $patient['gender'],
                "occupation" => $patient['occupation']
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid password"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Patient not found"]);
    }

} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
