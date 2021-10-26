<?php
ini_set('display_errors', 'on');
include_once "Fonctions.php";

$objet=$_POST["objet"];
$val=$_POST["valeur"];
echo json_encode(selectionMultiple($objet,$val));

?>