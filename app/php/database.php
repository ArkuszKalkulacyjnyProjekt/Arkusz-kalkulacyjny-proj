<?php
/**
 * Created by PhpStorm.
 * User: Piotrek
 * Date: 2018-02-08
 * Time: 22:43
 */

$host = "localhost";
$username = "root";
$password = "";
$db_name = "spreadsheet_base";

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}