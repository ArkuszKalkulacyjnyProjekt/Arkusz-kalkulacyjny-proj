<?php
/**
 * Created by PhpStorm.
 * User: Piotrek
 * Date: 2018-02-08
 * Time: 22:43
 */


$conn = new mysqli("localhost", "root", "", "spreadsheet_base");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}