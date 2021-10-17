<?php
ini_set('display_errors', 'on');
include_once "Fonctions.php";

$objet=$_POST["objet"];
$val=$_POST["id"];
echo json_encode(selectionObjet($objet,$val));

?>
