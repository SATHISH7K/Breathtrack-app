<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->connect();

    if ($db) {
        echo json_encode([
            "status" => "success",
            "message" => "Database connected successfully!",
            "details" => [
                "host" => "127.0.0.1:3307",
                "database" => "breathtrack"
            ]
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Connection returned null"
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "An unexpected error occurred: " . $e->getMessage()
    ]);
}
?>