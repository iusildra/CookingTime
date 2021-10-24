const html= document.getElementsByTagName("html");
const type= html.item(0).id;
const listeElement= document.getElementById("listeElement");
const boutonListe= document.getElementById("boutonListe");
const boutonCreerElement= document.getElementById("boutonCreerElement");
const boutonAjoutElement= document.getElementById("boutonAjouterElement");





document.body.onload= remplirBalisesSelect();


boutonAjoutElement.addEventListener("click", function () {

});

boutonListe.addEventListener("click", function (){
    listeElement.parentElement.parentElement.hidden='';
    requeteAJAXgetAll(type,afficherListe);
});

boutonCreerElement.addEventListener("click",function () {
    viderAffichage();
});

function ajouterOptions(req,balise){
    console.log(req);
    tab= JSON.parse(req.responseText);
    for(element of tab){
        values=Object.values(element)
        option=document.createElement("option");
        //option.id="option"+values[0];
        option.value=values[0];
        if(values[1]!=null)
            option.innerText=values[1];
        else option.innerText=values[0];
        balise.append(option);
    }
}

function choisirOptions(select,valeur){
    //options=document.querySelectorAll("."+select+" option");
    let options = select.childNodes;
    console.log("j'essaie de trouver option " + valeur );
    console.log(options);
    console.log(options[0]);
    /*options.forEach(option => function () {
        console.log("salut");
        console.log(option.innerText+"yo")
        if (choix.value == valeur)
            choix.selected = "true";
    })*/
    for(choix of options) {
        console.log("salut");
        console.log(choix.innerText)
        if (choix.innerHTML == valeur)
            choix.selected = "true";
    }
}

function remplirBalisesSelect(){
    tabBalise=document.querySelectorAll("select:not(.selectRecette)");
    for(balise of tabBalise) {
        balise.innerHTML="";
        requeteAJAXgetAll(balise.id, ajouterOptions,balise);
    }
}
// Requete d'affichage, elle permet de récupérer les données d'affichage dans la BD et de les afficher
function requeteAJAXgetAll(nom,funcToExec,balise) {
    let url = "php/requetesAffichage.php";
    let requete = new XMLHttpRequest();
    requete.open("POST", url, true);
    requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requete.addEventListener("load", function () {
        funcToExec(requete,balise);
    });
    requete.send("objet=" + nom);
}

function viderListe(){
    let liste = document.querySelector("#listeElement");
    liste.innerHTML = "";
}

function viderAffichage(){
    let tab = document.querySelectorAll("#affichageElement input,select");
    for (input of tab){
        if (input.type != "checkbox"){
            if(input.name != "select")
                input.value = "";
            else
                input.value="";
        }
        else{
            input.checked = "";
        }
    }
    if(type==="Fiche"){
        viderRecette();
    }
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
    for (ligne of lignesTableau)
        ligne.addEventListener("click", function () {
            requeteAJAXSelection(type,event.target.parentNode.id);
        });
}

function afficherListe(req) {
    viderListe();
    tab=JSON.parse(req.responseText);
    let table = document.getElementById("listeElement");
    let trHead = document.createElement("tr");
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
        tr.id=tabValeurs[0];
        table.append(tr);
        for (let val of tabValeurs) {
            let th = document.createElement("th");
            th.innerHTML= val;
            tr.append(th);
        }
        tr.addEventListener("click", function () {
            requeteAJAXSelection(type,event.target.parentNode.id,fenetreObjet);
        });
    }
}

// Requete d'ajout, elle permet d'ajouter un objet dans la BD ( et dans l'affichage ), elle prend un objet et un tableau de valeur
function requeteAJAXAdd (objet, tabValeur, funcToExec) {
    if (tabValeur[0] !== "") {
        let url = "php/requetesAjout.php";
        let requete = new XMLHttpRequest();
        requete.open("POST", url, true);
        requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        requete.addEventListener("load",function () {
            funcToExec();
        })
        let urlParametres = "objet=" + objet + "&tabValeur=" + tabValeur;
        requete.send(urlParametres);
    }
}

function requeteAJAXSelection (objet,valeur,funcToExec){
    let url = "php/requetesSelection.php";
    let requete = new XMLHttpRequest();
    requete.open("POST",url,true);
    requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requete.addEventListener("load",function () {
        funcToExec(requete,valeur);
    });
    requete.send("objet=" + objet + "&id=" + valeur);
}

function fenetreObjet(req,valeur){
    viderAffichage();
    tab=JSON.parse(req.responseText)[0];
    console.log(tab);
    tabAttributs=Object.keys(tab);
    if(type==="Fiche"){
        remplirRecette(tab["Etapes"],valeur)
        tabAttributs=tabAttributs.slice(0,6);
    }
    for (attribut of tabAttributs) {
        if (document.getElementById(attribut).type != "checkbox") {
            if(document.getElementById(attribut).tagName != "SELECT") {
                document.getElementById(attribut).value = tab[attribut];
            }
            else {
                console.log("je remplis avec choisirOption pour "+ attribut);
                choisirOptions(document.getElementById(attribut), tab[attribut]);
            }
        } else if (tab[attribut] == 1) {
            document.getElementById(attribut).checked = "true";
        } else {
            document.getElementById(attribut).checked = "";
        }
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
    requete.send(para);
}








