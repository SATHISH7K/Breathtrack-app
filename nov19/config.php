<?php
class Database {
    // --- Update these values as per your setup ---
    private $host = "127.0.0.1:3307";        // e.g. 127.0.0.1 or your DB host
    private $db_name = "breathtrack"; // your MySQL database name
    private $username = "root";         // your MySQL username
    private $password = "";             // your MySQL password (if any)
    public $conn;

    // --- Connect to database using PDO ---
    public function connect() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo json_encode([
                "status" => "error",
                "message" => "Database connection failed: " . $e->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}
?>