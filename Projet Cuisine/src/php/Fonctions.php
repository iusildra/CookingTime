<?php
require "Model.php";

function getFiches(){
    $sql = 'SELECT F.idFiche, F.nom, F.auteur,F.responsable,F.nbCouvert,F.typeFiche
            FROM fiche F
            ORDER BY nom';
    $req = Model::$pdo->query($sql);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function getSousRecettes(){
    $sql = 'SELECT F1.idFiche, F2.nom "Sous recette", F1.nom Recette
            FROM Fiche F1
            INNER JOIN PeutContenir ON F1.idFiche = idFicheRecette 
            LEFT OUTER JOIN Fiche F2 ON idFicheSousRecette = F2.idFiche
            ORDER BY "Sous recette", Recette';
    $req = Model::$pdo->query($sql);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function getIngredients(){
    $sql = "SELECT * from ingredient I ORDER BY nom";
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
    $sql = "SELECT * FROM typefiche ORDER BY typeFiche";
    $req = Model::$pdo->query($sql);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function getTypeIngredient(){
    $sql = "SELECT * FROM typeingredient ORDER BY typeIngredient";
    $req = Model::$pdo->query($sql);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function getTva(){
    $sql = "SELECT typeTva FROM tva ORDER BY typeTVA";
    $req = Model::$pdo->query($sql);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function getUnite(){
    $sql = "SELECT unite FROM unite ORDER BY unite";
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
        case "PeutContenir":
            return getSousRecettes();
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
    $sql= "SELECT I.idIngredient,I.nom,C.quantiteIngredient,I.unite,I.prixU,T.valeur
            FROM contenir C 
            join ingredient I on C.idIngredient=I.idIngredient
            join tva T on T.typeTva=I.tva
            where C.idFiche=:val";
    $req = Model::$pdo->prepare($sql);
    $val = array("val"=>$valeur);
    $req->execute($val);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function selectionPeutContenir($valeur){
    $sql= "SELECT F.idFiche,F.nom
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
    $sql= " SELECT idFiche, nom, auteur, nbCouvert, typeFiche
            FROM fiche 
            WHERE nom LIKE :chaine or auteur LIKE :chaine or responsable LIKE :chaine or typeFiche LIKE :chaine
            ORDER BY nom";
    $req = Model::$pdo->prepare($sql);
    $val = array("chaine"=>"%" . $valeur . "%");
    $req->execute($val);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function selectionMultipleIngredient($valeur){
    $sql= "SELECT * 
           FROM ingredient
           WHERE nom like :chaine or typeIngredient LIKE :chaine
           ORDER BY nom" ;
    $req = Model::$pdo->prepare($sql);
    $val = array("chaine"=>"%" . $valeur . "%");
    $req->execute($val);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $tab = $req->fetchAll();
    return $tab;
}

function selectionMultipleSuivi($valeur){
    $sql= "SELECT * 
           FROM suivi
           WHERE anneeSuivi LIKE :chaine or moisSuivi LIKE :chaine
           ORDER BY anneSuivi desc, moisSuivi desc";
    $req = Model::$pdo->prepare($sql);
    $val = array("chaine"=>"%" . $valeur . "%");
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
    $sql = 'INSERT INTO fiche (nom,responsable,auteur,nbCouvert,typeFiche,Etapes) VALUES (?,?,?,?,?,?);';
    $req=Model::$pdo->prepare($sql);
    $tab= array($tabValeur[0],$tabValeur[1],$tabValeur[2],$tabValeur[3],$tabValeur[4],$tabValeur[5]);
    $req->execute($tab);
}

function addIngredient($tabValeur){
    $sql = 'INSERT INTO ingredient (nom,prixU,unite,typeIngredient,quantite,tva,allergene) VALUES (?,?,?,?,?,?,?);';
    $req=Model::$pdo->prepare($sql);
    $tab = array($tabValeur[0],doubleval($tabValeur[1]), $tabValeur[2], $tabValeur[3], intval($tabValeur[4]), $tabValeur[5],intval($tabValeur[6]));
    $req->execute($tab);
}

function addContenir($tabValeur){
    $sql= 'INSERT INTO contenir (idFiche,idIngredient,quantiteIngredient) VALUES (?,?,?);';
    $req=Model::$pdo->prepare($sql);
    $tab= array($tabValeur[0], $tabValeur[1],$tabValeur[2]);
    $req->execute($tab);
}

function addPeutContenir($tabValeur){
    $sql= 'INSERT INTO peutcontenir (idFicheRecette,idFicheSousRecette) VALUES (?,?);';
    $req=Model::$pdo->prepare($sql);
    $tab = array($tabValeur[0], $tabValeur[1]);
    $req->execute($tab);
}

function addtypeFiche($valeur){
    $sql = 'INSERT INTO typefiche (typeFiche) VALUES (?);';
    Model::$pdo->prepare($sql)->execute([$valeur]);
}

function addTypeIngredient($valeur){
    $sql = 'INSERT INTO typeingredient (typeIngredient) VALUES (?);';
    Model::$pdo->prepare($sql)->execute([$valeur]);
}

function updateFiche($tabValeur){
    $sql = 'UPDATE Fiche
            SET nom=?, responsable=?, 
                auteur=?, nbCouvert=?,
                typeFiche=?, etapes=?
            WHERE idFiche=?';
    $req = Model::$pdo->prepare($sql);
    $tab= array($tabValeur[0],$tabValeur[1], $tabValeur[2], intval($tabValeur[3]), $tabValeur[4], $tabValeur[5], intval($tabValeur[6]));
    $req->execute($tab);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $obj = $req->fetchAll();
    return $obj;

}

function updateIngredient($tabValeur){
    $sql = 'UPDATE Ingredient
            SET nom=?, prixU=?, 
                unite=?, typeIngredient=?,
                quantite=?, tva=?,
                allergene=?
            WHERE idIngredient=?';
    $req = Model::$pdo->prepare($sql);
    $tab= array($tabValeur[0],$tabValeur[1], $tabValeur[2], $tabValeur[3], intval($tabValeur[4]), $tabValeur[5],$tabValeur[6], $tabValeur[7]);
    $req->execute($tab);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $obj = $req->fetchAll();
    return $obj;

}

function update($objet, $tabValeur) {
    switch ($objet) {
        case "Fiche":
            updateFiche($tabValeur);
            break;
        case "Ingredient":
            updateIngredient($tabValeur);
            break;
    }
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

function supprimerContenir($valeur){
    $sql = 'DELETE FROM contenir WHERE idFiche=:val';
    $req = Model::$pdo->prepare($sql);
    $val= array("val" => $valeur);
    $req->execute($val);
}

function supprimerPeutContenir($valeur){
    $sql = 'DELETE FROM peutcontenir WHERE idFicheRecette=:val';
    $req = Model::$pdo->prepare($sql);
    $val= array("val" => $valeur);
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

function getID($val){
    $sql = 'SELECT F.idFiche
            FROM fiche F
            WHERE nom=:val';
    $req = Model::$pdo->prepare($sql);
    $tab= array("val" => $val);
    $req->execute($tab);
    $req->setFetchMode(PDO::FETCH_OBJ);
    $id = $req->fetchAll();
    return $id;

}
?>


