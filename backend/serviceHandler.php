<?php
include("logic/mainLogic.php");

$method = "";

isset($_POST["method"]) ? $method = $_POST["method"] : false;

$logic = new MainLogic();
$result = $logic->handleRequest($method);
if ($result == null) {
    response(400, null);
} else {
    response(200, $result);
}

function response($httpStatus, $data)
{
    header('Content-Type: application/json');
    http_response_code($httpStatus);
    echo (json_encode($data));
}

