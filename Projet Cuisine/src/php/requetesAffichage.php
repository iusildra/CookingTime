<?php
ini_set('display_errors', 'on');
include_once "Fonctions.php";

$objet=$_POST['objet'];
echo json_encode(getObjets($objet));

?>

