<?php
ini_set('display_errors', 'on');
include_once "Fonctions.php";

$objet=$_POST["objet"];
$tabval=$_POST["tabValeur"];
echo $tabval;
add($objet, json_decode($tabval));
?>