<?php

include "dbaccess.php";

class DataHandler
{

    private $connection;

    public function __construct() {
        $this->connection = new mysqli(DB_SERVERNAME, DB_USERNAME, DB_PASSWORD, DB_NAME);
        if (isset($this->connection->connect_error)) {
            die("Database connection failed: " . $this->connection->connect_error);
        }
    }

    public function dataSelect($SQLquery, $parameters, $types){
        $stmt = $this->connection->prepare($SQLquery);
        $stmt->bind_param($types, ...$parameters);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        return $result->fetch_all(MYSQLI_ASSOC);

    }
}
