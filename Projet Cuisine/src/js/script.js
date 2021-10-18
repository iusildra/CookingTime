const html= document.getElementsByTagName("html");
const type= html.item(0).id;
const boutonListe= document.getElementById("boutonListe");
const boutonAjouterElement= document.getElementById("boutonAjouterElement");
//document.body.onload= requeteAJAXaffichage(type);


boutonListe.addEventListener("click", function (){
    requeteAJAXaffichage(type);
});

boutonAjouterElement.addEventListener("click",function () {
    viderAffichage();
});




// Requete d'affichage, elle permet de récupérer les données d'affochage dans la BD et de lancer la callback afficherObjets ( décrite plus bas)
function requeteAJAXaffichage(nom) {
    let url = "php/requetesAffichage.php";
    let requete = new XMLHttpRequest();
    requete.open("POST", url, true);
    requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requete.addEventListener("load", function () {
        afficherListe(requete);
    });
    requete.send("objet=" + nom);
}

function viderListe(){
    let liste = document.getElementById("listeElement");
    liste.innerHTML = "";
}

function viderAffichage(){
    let formulaire = document.getElementById("formulaire");
}

/*function afficherListe(req){
    viderListe();
    tab=JSON.parse(req.responseText);
    let liste = document.getElementById("listeElement");
    let table = document.createElement("table");
    let trHead = document.createElement("tr");
    liste.appendChild(table);
    table.append(trHead);
    switch (nom){
        case "Fiche" :
            afficherListeFiche(tab,table,trHead);
            break;
        case "Ingredient" :
            afficherListeIngredient(tab);
            break;
        case "Suivi" :
            afficherListeSuivi(tab);
            break;
    }
}*/
function actualiserListe(){
    let lignesTableau= document.querySelectorAll("#listeElement tr:not(:first-child)");
    console.log(lignesTableau)
    for (ligne of lignesTableau)
        ligne.addEventListener("click", function () {
            console.log(event.target);
            requeteAJAXSelection(type,event.target.parentNode.id);
        });
}

function afficherListe(req) {
    viderListe();
    console.log(req);
    tab=JSON.parse(req.responseText);
    console.log(tab);
    let liste = document.getElementById("listeElement");
    let table = document.createElement("table");
    let trHead = document.createElement("tr");
    liste.appendChild(table);
    table.append(trHead);
    tabAttributs=Object.keys(tab[0]);
    for (let val of tabAttributs) {
        let th= document.createElement("th");
        th.innerHTML=val;
        trHead.append(th);
    }
    for(let elt of tab) {
        let tr=document.createElement("tr");
        tabValeurs=Object.values(elt);
        console.log(tabValeurs);
        tr.id=tabValeurs[0];
        table.append(tr);
        for (let val of tabValeurs) {
            let th = document.createElement("th");
            th.innerHTML= val;
            tr.append(th);
        }
    }
    actualiserListe();
}

// Requete d'ajout, elle permet d'ajouter un objet dans la BD ( et dans l'affichage ), elle prend un objet et un tableau de valeur
function requeteAJAXAdd (objet, tabValeur) {
    if (tabValeur[0] !== "") {
        let url = "php/requetesAjout.php";
        let requete = new XMLHttpRequest();
        requete.open("POST", url, true);
        requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        requete.addEventListener("load",function () {
            afficherListes();
        })
        let urlParametres = "objet=" + objet + "&tabValeur=" + tabValeur;
        requete.send(urlParametres);
    }
}

function requeteAJAXSelection (objet,valeur){
    let url = "php/requetesSelection.php";
    let requete = new XMLHttpRequest();
    requete.open("POST",url,true);
    requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requete.addEventListener("load",function () {
        fenetreObjet(objet,requete);
    });
    requete.send("objet=" + objet + "&id=" + valeur);
}

function fenetreObjet(objet,req){
    tab=JSON.parse(req.responseText);
    tabAttributs=Object.keys(tab[0]);
    tabValeurs=Object.values(tab[0]);
    let i=0
    for (attribut of tabAttributs) {
        if(document.getElementById(attribut).type!=="checkbox") {
            document.getElementById(attribut).value = tabValeurs[i];
        }
        else
            if(tabValeurs[i]==1) {
                document.getElementById(attribut).checked="true";
            }
            else {
                console.log(tabValeurs[i]);
                document.getElementById(attribut).checked="";
            }
            i++;
    }
}
function requeteAJAXSuppression(objet, tabValeur){
    let url= "php/requetesSupression.php";
    let requete= new XMLHttpRequest();
    requete.open("POST",url,true);
    requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requete.addEventListener("load",function (){
        afficherListes();
    })
    let para="objet=" + objet + "&id=" + tabValeur[0];
    if(objet === "Emprunt")
        para += "&id1=" + tabValeur[1];

    requete.send(para);
}

function viderAffichage(){
    let tab = document.querySelectorAll("#affichageElement input");
    for (input of tab){
        if (input.type != "checkbox"){
            input.value = "";
        }
        else{
            input.checked = "";
        }
    }
}






