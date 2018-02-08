<?php
require 'database.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$result = $conn->query("SELECT name, value FROM cells");

$outp = array();
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
   $outp[$rs['name']] = $rs['value'];
}
$conn->close();

echo(json_encode($outp));
