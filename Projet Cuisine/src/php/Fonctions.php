<?php
require "Model.php";

function getFiches(){
    $sql = 'SELECT F.idFiche, F.nom, F.auteur,F.nbCouvert,F.typeFiche
                FROM fiche F';
    $req = Model::$pdo->query($sql);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function getIngredients(){
    $sql = "SELECT * from ingredient I";
    $req = Model::$pdo->query($sql);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function getSuivis(){
    $sql = "SELECT * FROM suivi S ";
    $req = Model::$pdo->query($sql);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function getTypeFiche(){
    $sql = "SELECT * FROM typefiche ";
    $req = Model::$pdo->query($sql);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function getTypeIngredient(){
    $sql = "SELECT * FROM typeingredient";
    $req = Model::$pdo->query($sql);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function getTva(){
    $sql = "SELECT typeTva FROM tva";
    $req = Model::$pdo->query($sql);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function getUnite(){
    $sql = "SELECT unite FROM unite";
    $req = Model::$pdo->query($sql);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function getObjets($objet) {
    switch ($objet) {
        case "Fiche" :
            return getFiches();
        case "Ingredient" :
            return getIngredients();
        case "Suivi" :
            return getSuivis();
        case "typeFiche" :
            return getTypeFiche();
        case "typeIngredient" :
            return getTypeIngredient();
        case "tva" :
            return getTva();
        case "unite" :
            return getUnite();
    }
}

function selectionFiche($valeur){
    $sql = 'SELECT *   
            FROM fiche F
            WHERE F.idFiche=:val';
    $req = Model::$pdo->prepare($sql);
    $val = array("val"=>$valeur);
    $req->execute($val);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function selectionIngredient($valeur){
    $valint= intval($valeur);
    $sql = "SELECT * 
            FROM ingredient  
            WHERE idIngredient=:val";
    $req = Model::$pdo->prepare($sql);
    $val = array("val" => $valint);
    $req->execute($val);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function selectionSuivi($valeur){
    $sql= "SELECT *
            FROM suivi S 
            where S.idSuivi=:val";
    $req = Model::$pdo->prepare($sql);
    $val = array("val"=>$valeur);
    $req->execute($val);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function selectionContenir($valeur){
    $sql= "SELECT I.idIngredient,I.nom,C.quantiteIngredient,I.unite
            FROM contenir C 
            join ingredient I on C.idIngredient=I.idIngredient
            where C.idFiche=:val";
    $req = Model::$pdo->prepare($sql);
    $val = array("val"=>$valeur);
    $req->execute($val);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function selectionPeutContenir($valeur){
    $sql= "SELECT F.idFiche,F.nom,P.quantiteSousRecette
            FROM peutcontenir P 
            join Fiche F on P.idFicheSousRecette=F.idFiche
            where P.idFicheRecette=:val";
    $req = Model::$pdo->prepare($sql);
    $val = array("val"=>$valeur);
    $req->execute($val);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}


function selectionObjet($objet, $valeur){
    switch ($objet){
        case "Fiche" :
            return selectionFiche($valeur);
        case "Ingredient" :
            return selectionIngredient($valeur);
        case "Suivi" :
            return selectionSuivi($valeur);
        case "Contenir" :
            return selectionContenir($valeur);
        case "PeutContenir" :
            return selectionPeutContenir($valeur);
    }
}

function selectionMultipleFiche($valeur){
    $sql= "SELECT * 
           FROM fiche 
           WHERE idFiche like :chaine or nom like :chaine or auteur LIKE :chaine or responsable LIKE :chaine or typeFiche LIKE :chaine ";
    $req = Model::$pdo->prepare($sql);
    $val = array("chaine"=>$valeur + "%");
    $req->execute($val);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function selectionMultiple($objet,$valeur){
    switch ($objet){
        case "Fiche" :
            return selectionMultipleFiche($valeur);
        case "Ingredient" :
            return selectionMultipleIngredient($valeur);
        case "Suivi" :
            return selectionMultipleSuivi($valeur);
    }
}

function addFiche($tabValeur){
    $sql = 'INSERT INTO fiche (nom,auteur,nbCouvert,Etapes,typeFiche) VALUES (?,?,?,?,?);';
    $req=Model::$pdo->prepare($sql);
    $req->execute([$tabValeur['nom'],$tabValeur['auteur'],$tabValeur['nbCouvert'],$tabValeur['etapes'],$tabValeur['typeFiche']]);
}

function addIngredient($tabValeur){
    $sql = 'INSERT INTO ingredient (nom,prixU,allergene,idTva,typeIngredient,unite) VALUES (?,?,?,?,?,?);';
    $req=Model::$pdo->prepare($sql);
    $req->execute([$tabValeur['nom'],$tabValeur['prixU'],$tabValeur['allergene'],$tabValeur['idTva'],$tabValeur['typeIngredient'],$tabValeur['unite']]);
}

function addContenir($tabValeur){
    $sql= 'INSERT INTO contenir (idFiche,idIngredient,quantite) VALUES (?,?,?);';
    $req=Model::$pdo->prepare($sql);
    $req->execute([$tabValeur["idFiche"], $tabValeur["idIngredient"],$tabValeur["quantite"]]);
}

function addPeutContenir($tabValeur){
    $sql= 'INSERT INTO peutcontenir (idFicheRecette,idFicheSousRecette,quantite) VALUES (?,?,?);';
    $req=Model::$pdo->prepare($sql);
    $req->execute([$tabValeur["idFicheRecette"], $tabValeur["idFicheSousRecette"],$tabValeur["quantite"]]);
}

function addtypeFiche($valeur){
    $sql = 'INSERT INTO typefiche (typeFiche) VALUES (?);';
    Model::$pdo->prepare($sql)->execute([$valeur]);
}

function addTypeIngredient($valeur){
    $sql = 'INSERT INTO typeingredient (typeIngredient) VALUES (?);';
    Model::$pdo->prepare($sql)->execute([$valeur]);
}

function add ($objet, $tabValeur) {
    switch ($objet) {
        case "Fiche" :
            addFiche($tabValeur);
            break;
        case "Ingredient" :
            addIngredient($tabValeur);
            break;
        case "Suivi" :
            addSuivi($tabValeur);
            break;
        case "Contenir" :
            addContenir($tabValeur);
            break;
        case "PeutContenir" :
            addPeutContenir($tabValeur);
            break;
        case "TypeFiche" :
            addTypeFiche($tabValeur);
            break;
        case "TypeIngredient" :
            addTypeIngredient($tabValeur);
            break;
    }
}

function supprimerFiche($valeur){
    $sql = 'DELETE FROM fiche WHERE idFiche=:val';
    $req = Model::$pdo->prepare($sql);
    $val= array("val" => $valeur);
    $req->execute($val);
}

function supprimerIngredient($valeur){
    $sql = 'DELETE FROM ingredient WHERE idIngredient=:val';
    $req = Model::$pdo->prepare($sql);
    $val= array("val" => $valeur);
    $req->execute($val);
}

function supprimerSuivi($valeur){
    $sql = 'DELETE FROM suivi WHERE idSuivi=:val';
    $req = Model::$pdo->prepare($sql);
    $val= array("val" => $valeur);
    $req->execute($val);
}

function supprimerContenir($tabValeur){
    $sql = 'DELETE FROM contenir WHERE idFiche=:val AND idIngredient=:val1';
    $req = Model::$pdo->prepare($sql);
    $val= array("val" => $tabValeur["idFiche"] , "val1" => $tabValeur["idIngredient"]);
    $req->execute($val);
}

function supprimerPeutContenir($tabValeur){
    $sql = 'DELETE FROM peutcontenir WHERE idFicheRecette=:val AND idFicheSousRecette=:val1';
    $req = Model::$pdo->prepare($sql);
    $val= array("val" => $tabValeur["idFicheRecette"] , "val1" => $tabValeur["idFicheSousRecette"]);
    $req->execute($val);
}

function supprimerTypeIngredient($valeur){
    $sql = 'DELETE FROM typeingredient WHERE typeIngredient=:val';
    $req = Model::$pdo->prepare($sql);
    $val= array("val" => $valeur);
    $req->execute($val);
}

function supprimerTypeFiche($valeur){
    $sql = 'DELETE FROM typefiche WHERE typeFiche=:val';
    $req = Model::$pdo->prepare($sql);
    $val= array("val" => $valeur);
    $req->execute($val);
}

function supprimer($objet, $tabValeur){
    switch ($objet) {
        case "Fiche" :
            supprimerFiche($tabValeur);
            break;
        case "Ingredient" :
            supprimerIngredient($tabValeur);
            break;
        case "Suivi" :
            supprimerSuivi($tabValeur);
            break;
        case "Contenir" :
            supprimerContenir($tabValeur);
            break;
        case "PeutContenir" :
            supprimerPeutContenir($tabValeur);
            break;
        case "TypeFiche" :
            supprimerTypeFiche($tabValeur);
            break;
        case "TypeIngredient" :
            supprimerTypeIngredient($tabValeur);
            break;
    }
}
?>


