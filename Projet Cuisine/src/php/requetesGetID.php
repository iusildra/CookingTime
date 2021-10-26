<?php
ini_set('display_errors', 'on');
include_once "Fonctions.php";

$nom=$_POST["val"];
echo json_encode(getID($nom));
?>