const html= document.getElementsByTagName("html");
const type= html.item(0).id;
const listeElement= document.getElementById("listeElement");
const boutonListe= document.getElementById("boutonListe");
const listeSR = document.getElementById("listeSousRecettes");
const boutonCreerElement= document.getElementById("boutonCreerElement");
const boutonAjoutElement= document.getElementById("boutonAjouterElement");
const boutonSupprimerElement= document.getElementById("boutonSupprimerElement")
const inputRecherche= document.getElementById("recherche");
const boutonRechercher= document.getElementById("boutonRechercher");

document.body.onload= remplirBalisesSelect();

boutonAjoutElement.addEventListener("click", function () {
    ajouterElement();
});

function ajouterElement(){
    if(type=="Fiche") ajouterFiche()
    else{
        tab=[];
        vals = document.querySelectorAll("#affichageElement input,select");
        for (let i = 1; i < vals.length; i++) {
            if (vals[i].type == "checkbox")
                if (vals[i].checked == true) tab.push(1);
                else tab.push(0);
            else
                if (vals[i].type == "number") tab.push(parseFloat(vals[i].value));
                else tab.push(vals[i].value);
        }
        if (vals[0].value !== "") {
            var updateTab = tab
            updateTab.push(vals[0].value);
            requeteAJAXUpdate(type, JSON.stringify(updateTab));
        } else requeteAJAXAdd(type,JSON.stringify(tab));
    }
}

boutonSupprimerElement.addEventListener("click", function () {
    id= document.querySelectorAll("#affichageElement input")[0].value;
    if(type!="Fiche")
        requeteAJAXSuppression(type,id);
    else
        supprimerFicheBD(id);
})

boutonRechercher.addEventListener("click",function () {
   input= inputRecherche.value;
   viderListe();
   requeteAJAXSelectionMultiple(type,input,afficherListe);
});

inputRecherche.addEventListener("change",function () {
    input= inputRecherche.value;
    viderListe();
    requeteAJAXSelectionMultiple(type,input,afficherListe);
})

boutonListe.addEventListener("click", function (){
    listeElement.parentElement.parentElement.hidden = '';
    //listeSR.parentElement.parentElement.hidden = '';
    boutonListe.hidden = 'true';
    requeteAJAXgetAll(type, afficherListe);
    //if(type=="Fiche") { requeteAJAXgetAll("PeutContenir", afficherListe)}
});



boutonCreerElement.addEventListener("click",function () {
    viderAffichage();
    boutonSupprimerElement.hidden='true';
    if(type=="Fiche")
        boutonImpression.hidden='true';
});

function ajouterOptions(req,balise){
    tab= JSON.parse(req.responseText);
    for(element of tab){
        values=Object.values(element)
        option=document.createElement("option");
        option.value=values[0];
        if(values[1]!=null)
            option.innerText=values[1];
        else option.innerText=values[0];
        balise.append(option);
    }
}

function choisirOptions(select,valeur){
    let options = select.childNodes;
    for(choix of options) {
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
    if(type=="Fiche"){
        viderRecette();
    }
}

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
    let table = document.getElementById("listeElement")
    let trHead = document.createElement("tr");
    table.append(trHead);
    tabAttributs = Object.keys(tab[0]);
    var idH = true;
    for (let val of tabAttributs) {
        if (idH) {
            idH = false
            continue
        }
        let th= document.createElement("th");
        th.innerHTML=val;
        trHead.append(th);
    }
    for(let elt of tab) {
        let tr=document.createElement("tr");
        tabValeurs=Object.values(elt);
        tr.id=tabValeurs[0];
        table.append(tr);
        var id = true;
        for (let val of tabValeurs) {
            let th = document.createElement("td");
            if (id) {
                th.hidden = "true"
                id = false;
            }
            th.innerHTML= val;
            tr.append(th);
        }
        tr.addEventListener("click", function () {
            boutonSupprimerElement.hidden='';
            if(type=="Fiche")
                    boutonImpression.hidden='';
            requeteAJAXSelection(type,event.target.parentNode.id,fenetreObjet);
        });
    }
}

// Requete d'ajout, elle permet d'ajouter un objet dans la BD ( et dans l'affichage ), elle prend un objet et un tableau de valeur
function requeteAJAXAdd (objet, tabValeur, funcToExec) {
    let url = "php/requetesAjout.php";
    let requete = new XMLHttpRequest();
    requete.open("POST", url, true);
    requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requete.addEventListener("load",function () {
        if(objet!=="PeutContenir" && objet!=="Fiche") {
            viderAffichage();
            requeteAJAXgetAll(type,afficherListe);
        }
        if (objet == "Fiche") {
            funcToExec()
        }
    })
    let urlParametres = "objet=" + objet + "&tabValeur=" + tabValeur;
    requete.send(urlParametres);
}

function requeteAJAXUpdate(objet, tabValeur, funcToExec) {
  let url = "php/requetesUpdate.php";
  let requete = new XMLHttpRequest();
  requete.open("POST", url, true);
  requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  requete.addEventListener("load", function () {
    if (objet !== "PeutContenir" && objet !== "Fiche") {
      viderAffichage();
      requeteAJAXgetAll(type, afficherListe);
      }
      if (objet == "Fiche") {
        funcToExec()
    }
  });
  let urlParametres = "objet=" + objet + "&tabValeur=" + tabValeur;
  requete.send(urlParametres);
}

function requeteAJAXSelection (objet,valeur,funcToExec,balise){
    let url = "php/requetesSelection.php";
    let requete = new XMLHttpRequest();
    requete.open("POST",url,true);
    requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requete.addEventListener("load",function () {
        funcToExec(requete,valeur,balise);
    });
    requete.send("objet=" + objet + "&id=" + valeur);
}

function requeteAJAXSelectionMultiple(objet, valeur, funcToExec) {
    let url = "php/requetesSelectionMultiple.php";
    let requete = new XMLHttpRequest();
    requete.open("POST", url, true);
    requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requete.addEventListener("load", function () {
        funcToExec(requete);
    });
    requete.send("objet=" + objet + "&valeur=" + valeur);
}

function fenetreObjet(req,valeur){
    viderAffichage();
    tab=JSON.parse(req.responseText)[0];
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
                choisirOptions(document.getElementById(attribut), tab[attribut]);
            }
        } else if (tab[attribut] == 1) {
            document.getElementById(attribut).checked = "true";
        } else {
            document.getElementById(attribut).checked = "";
        }
    }
    champs= document.querySelectorAll("#affichageElement input,select")
    for (champ of champs)
        champ.addEventListener("change",function () {
            boutonSupprimerElement.hidden='true';
            boutonImpression.hidden='true';
        });
}

function requeteAJAXSuppression(objet, tabValeur){
    let url= "php/requetesSupression.php";
    let requete= new XMLHttpRequest();
    requete.open("POST",url,true);
    requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requete.addEventListener("load",function (){
        if(objet!=="Contenir" && objet!=="PeutContenir") {
            viderAffichage();
            requeteAJAXgetAll(type, afficherListe);
        }
    })
    let para="objet=" + objet + "&id=" + tabValeur;
    requete.send(para);
}

function requeteAJAXGetID(objet, nom, funcToExec) {
    let url = "php/requetesGetID.php";
    let requete = new XMLHttpRequest();
    requete.open("POST", url, true);
    requete.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    requete.addEventListener("load", function () {
      funcToExec(requete);
    });
    requete.send("val=" + nom);
}