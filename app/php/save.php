<?php
require 'database.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$json = file_get_contents("php://input");
$json = json_decode($json);
$array =  (array)$json->json;

if (isset($array)) {
    foreach ($array as $key => $value) {
        $conn->query("REPLACE INTO `cells` (`name`, `value`) VALUES ('{$key}', '{$value}')");
    }
}