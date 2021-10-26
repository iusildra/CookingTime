const boutonAjouterEtape= document.getElementById("boutonAjouterEtape");
const boutonAjouterIngredient= document.getElementById("boutonAjouterIngredient");
const boutonAjouterSousRecette= document.getElementById("boutonAjouterSousRecette");
const etapes= document.getElementById("etapesRecette");
const ingredients = document.getElementById("ingredientsRecette");
const sousrecettes = document.getElementById("sousRecettesRecette");
const elementsRecette= document.getElementsByClassName("elementsRecette");
const boutonImpression = document.getElementById("boutonImprimerFiche");
const boutonImprimerEtiquette = document.getElementById("boutonImprimerEtiquette");
const tabsRecette=document.getElementsByClassName("tabsRecette")

let idFiche;
let coutTotal = 0
let coutIngredientBase = 0
let dureeTotale = 0
let nbEtape = 0;
let TVA = 0;



boutonImpression.addEventListener("click",function () {
    printFiche();
});

boutonAjouterEtape.addEventListener("click",function (){
    ajouterEtape(["",0]);
});
boutonAjouterIngredient.addEventListener("click",function (){
    document.querySelectorAll("#affichageElement thead")[0].hidden='';
    ajouterIngredient(["","","",""]);
});
boutonAjouterSousRecette.addEventListener("click",function (){
    document.querySelectorAll("#affichageElement thead")[1].hidden='';
    ajouterSousRecette(["","",""]);
});

function ajouterFiche() {
    let content = document.querySelectorAll("#infoFiche input, #infoFiche select");
    let etapes = "";
    let inputEtape = document.querySelectorAll(".etape input,textarea");
    for (let i=0;i<inputEtape.length;i+=3) {
        etapes += inputEtape[i+2].value + " |-" + inputEtape[i+1].value + " ||";
    }
    let tab=[];
    for(let i=1;i<content.length;i++)
        if(content[i].type=="number")
            tab.push(parseFloat(content[i].value));
        else
            tab.push(content[i].value);
    tab.push(etapes);
    if (content[0].value !== '') {
        var updateTab = tab
        updateTab.push(content[0].value);
        console.log(updateTab)
        requeteAJAXSuppression("Contenir", content[0].value);
        requeteAJAXSuppression("PeutContenir", content[0].value);
        requeteAJAXUpdate(type, JSON.stringify(updateTab));
    } else {
        requeteAJAXAdd(type, JSON.stringify(tab));
    }
    idFiche = content[0].value;
    setTimeout(ajouterContenirIngredientBD, 500);
    setTimeout(ajouterSousRecetteBD, 500);

}

function supprimerFicheBD(id){
    requeteAJAXSuppression("Contenir",id);
    requeteAJAXSuppression("PeutContenir",id);
    setTimeout(requeteAJAXSuppression,500,"Fiche",id);
}

function ajouterContenirIngredientBD() {
    let input = document.querySelectorAll("#ingredientsRecette select,#ingredientsRecette input");
    console.log(input)
    for (let i=0;i<input.length;i+=2) {
        let tab = [idFiche,input[i].value,input[i+1].value];
        requeteAJAXAdd("Contenir", JSON.stringify(tab));
    }
}

function ajouterSousRecetteBD() {
    let input = document.querySelectorAll("#sousRecettesRecette input");
    console.log(input)
    for (let index of input) {
        let tab = [idFiche, input[index].value]
        requeteAJAXAdd("PeutContenir", JSON.stringify(tab));
    }
}

function ajouterEtape(contenu){
    nbEtape++;
    let div=document.createElement("div");
    div.id="etape" + nbEtape;
    div.className="etape";
    div.innerHTML="<div><div><span>N° d'étape</span><span>Durée étape (min)</span></div>\n" +
        "                    <div>\n"+
        "                       <input class='id' type='number' value='"+ nbEtape +"' readonly/>\n" +
        "                       <input type='number' name=\"dureePhase\" value='"+ parseInt(contenu[1]) +"'/>\n" +
        "                    </div>\n"+
        "                    <p>Description</p>\n" +
        "                    <textarea rows='4' cols='45'>"+ contenu[0] +"</textarea>\n" +
        "                  </div>\n" +
        "                  <div class='action'>\n" +
        "                    <button class='boutonSupprimerEtape'>Supprimer l\'étape</button>\n" +
        "                    <button class='boutonMonterEtape'>↑</button>\n" +
        "                    <button class='boutonDescendreEtape'>↓</button>\n" +
        "                  </div>\n"
    etapes.append(div);
    actualiserBoutons(div);
}

function ajouterIngredient(contenu) {
    let tr = document.createElement("tr");
    tr.innerHTML = "<td><select/></select></td>\n" +
        "<td><input type='number' value='" + contenu[2] + "'><span>" + contenu[3] + "</span></td>\n" +
        "<td><button class='boutonSupprimerElementRecette'>X</button></td>";
    ingredients.append(tr);
    tabSelect = document.querySelectorAll("#" + ingredients.id + " select");
    select = tabSelect[tabSelect.length - 1];
    requeteAJAXgetAll("Ingredient", ajouterOptions, select);
    setTimeout(choisirOptions, 200, select, contenu[1]);
    select.addEventListener("change", () => {
        requeteAJAXSelection("Ingredient", select.value, supprimerUnite, tr);
    });
    tabBoutons = document.querySelectorAll("#" + ingredients.id + " .boutonSupprimerElementRecette");
    tabBoutons[tabBoutons.length - 1].addEventListener("click", function () {
        ligne = event.target.parentElement.parentElement;
        table = ligne.parentElement;
        supprimerElementRecette(ligne, table);
    });
}


function supprimerUnite(req, valeur, balise) {
    tab = JSON.parse(req.responseText);
    tabValeur = Object.values(tab);
    balise.children[1].children[1].innerText = tabValeur[0]["unite"];
}

function ajouterSousRecette(contenu) {
    elementsRecette[2].hidden='';
    let tr = document.createElement("tr");
    tr.innerHTML = "<td><select class='selectRecette'/></select></td>\n"+
        "<td><button class='boutonSupprimerElementRecette'>X</button></td>";
    sousrecettes.append(tr);
    tabSelect=document.querySelectorAll("#"+sousrecettes.id+" select");
    select=tabSelect[tabSelect.length-1];
    requeteAJAXgetAll("Fiche",ajouterOptions,select);
    setTimeout(choisirOptions,200,select,contenu[1]);
    tabBoutons=document.querySelectorAll("#"+sousrecettes.id+" .boutonSupprimerElementRecette");
    tabBoutons[tabBoutons.length-1].addEventListener("click", function () {
        ligne=event.target.parentElement.parentElement;
        table=ligne.parentElement;
        supprimerElementRecette(ligne,table);
    });
}

function supprimerElementRecette(ligne,tab){
    tab.removeChild(ligne);
}

function supprimerEtape(etape){
    etapes.removeChild(etape);
    nbEtape--;
    actualiserIds();
}

function actualiserBoutons(div){
    let boutons=document.querySelectorAll("#"+div.id+" button");
    boutons[0].addEventListener("click", function () {
        supprimerEtape(div);
    })
    boutons[1].addEventListener("click", function () {
        echanger(div,div.previousSibling);
    })
    boutons[2].addEventListener("click", function () {
        echanger(div,div.nextSibling);
    })
}

function echanger(div1,div2){
    let div3=div1.innerHTML;
    div1.innerHTML=div2.innerHTML;
    div2.innerHTML=div3;
    actualiserBoutons(div1);
    actualiserBoutons(div2);
    actualiserIds();
}

function actualiserIds(){
    tabIdEtapes=document.querySelectorAll("#etapesRecette input.id");
    for(let i=0;i<tabIdEtapes.length;i++)
        tabIdEtapes[i].value=i+1;
}

function remplirEtapes(etapes) {
    if (etapes == null) return
    let tabEtape = etapes.split("||");
    for (let i=0;i<tabEtape.length-1;i++) {
        let input= tabEtape[i].split("|-");
        ajouterEtape(input);
    }
}

function viderRecette(){
    for (element of elementsRecette)
        element.innerHTML="";
    for (tab of tabsRecette)
        tab.hidden='true';
    nbEtape=0;
    coutTotal=0;
}

function remplirIngredients(req){
    coutIngredientBase = 0;
    let tabContenu= JSON.parse(req.responseText);
    for(contenu of tabContenu) {
        coutTotal+= contenu[2]*contenu[4];
        valeurs = Object.values(contenu);
        coutIngredientBase += valeurs[2] * valeurs[4];
        TVA = Math.max(TVA, valeurs[5]);
        let input = [valeurs[0], valeurs[1] , valeurs[2] , valeurs[3]];
        ajouterIngredient(input);
    }
}


function remplirSousRecettes(req){
    let tabContenu= JSON.parse((req.responseText))
    for(contenu of tabContenu) {
        valeurs=Object.values(contenu)
        let input = [valeurs[0], valeurs[1] , valeurs[2]];
        ajouterSousRecette(input);
    }
}

function remplirRecette(etapes,idFiche){
    boutonImpression.hidden='';
    for( thead of tabsRecette)
        thead.hidden='';
    remplirEtapes(etapes);
    requeteAJAXSelection("Contenir",idFiche,remplirIngredients);
    requeteAJAXSelection("PeutContenir",idFiche,remplirSousRecettes);
    champs= document.querySelectorAll("#affichageElement input,select")
    for (champ of champs)
        champ.addEventListener("change",function () {
            boutonImpression.hidden='true';
        })
}


function printFiche() {
    coutTotal = coutIngredientBase;
    dureeTotale = 0;
    let printer = document.querySelectorAll("#printer div div");
    for (div of printer) {
        div.innerText = "";
    }
    document.getElementById("printEtape").innerHTML += "<h3>" + document.getElementById("nom").value + "</h3>";
    for (etape of document.getElementById("etapesRecette").children) {
        var content = "";
        let content1 = document.querySelectorAll("#" + etape.id + " input");
        let content2 = document.querySelectorAll("#" + etape.id + " textarea");

        content += "<b>Phase n°" + content1[0].value + " - ";
        content += content1[1].value + "min</b> <br/>";
        content += content2[0].value + "<br/><br/>";

        let divEtape = document.getElementById("printEtape");
        divEtape.innerHTML += content;
    }

    document.getElementById("printIngredient").innerHTML += "<h3>"+document.getElementById("nom").value+"</h3><br>";
    for (ing of document.getElementById("ingredientsRecette").children) {
        let select = ing.children[0].children[0];
        let name = select.options[select.selectedIndex].text
        let quantite = ing.children[1].children[0].value;
        let unite = ing.children[1].children[1].innerText;

        document.getElementById("printIngredient").innerHTML +=
            name + " : " + quantite + unite + "<br>";
    }
    for (sr of document.getElementById("sousRecettesRecette").children) {
        let select = sr.children[0].children[0];
        let id = select.value;
        let name = select.options[select.selectedIndex].text;
        document.getElementById("printIngredient").innerHTML +=
            "<br><h3>" + name + "</h3><br>";
        document.getElementById("printEtape").innerHTML +=
            "<br><h3>" + name + "</h3><br>";
        requeteAJAXSelection("Contenir", id, printSousRecetteIngredient, document.getElementById("printIngredient"))
        requeteAJAXSelection("Fiche", id, printSousRecetteEtape, document.getElementById("printEtape"))

        document.getElementById("printSousRecettes").innerHTML +=
            name + "<br>";
    }

    let printContenu = "";
    for (infos of document.getElementById("infoFiche").children) {
        for (info of infos.children) {
            if (info.tagName == "LABEL") { printContenu += info.innerText + " : " }
            if (info.tagName == "INPUT") { printContenu += info.value + "<br>" }
            if (info.tagName == "SELECT") { printContenu += info.value }
        }
    }
    document.getElementById("printContenu").innerHTML = printContenu;

    for (dureeN of document.getElementsByName("dureePhase")) {
        dureeTotale += parseInt(dureeN.value);
    }
    setTimeout(printPriceDuree, 250)
    setTimeout(window.print, 500)
}

function printSousRecetteIngredient(req, valeur, balise) {
    tab = JSON.parse(req.responseText)
    for (elt of tab) {
        coutTotal += elt["prixU"] * elt["quantiteIngredient"];
        balise.innerHTML += elt["nom"] + " : " + elt["quantiteIngredient"] + elt["unite"] + "<br>"
    }
}

function printSousRecetteEtape(req, valeur, balise) {
    req = JSON.parse(req.responseText)[0];
    if (req["Etapes"] != null) {
        etapesTab = req["Etapes"].split("\n")
        for (i in etapesTab) {
            etapeTab = etapesTab[i].split("&&")
            dureeTotale += parseInt(etapeTab[1])
            balise.innerHTML += "<b>Phase n°" + (parseInt(i)+1) + " - " + etapeTab[1] + "min</b> <br/>" + etapeTab[0] + "<br/><br/>";
        }
    }
}

function printPriceDuree() {
    document.getElementById("printDuree").innerHTML = "Durée totale : " + Math.floor(parseInt(dureeTotale) / 60) + "h" + (parseInt(dureeTotale) % 60) + "min"

    document.getElementById("printPrix").innerHTML = "PTHT : " + coutTotal + "<br>PTTTC : " + coutTotal * (1 + TVA)
}
function requeteAJAXSelectID(valeur){
    let url= "php/requetesGetID.php";
    let requete= new XMLHttpRequest();
    requete.open("POST",url,true);
    requete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requete.addEventListener("load",function (){
        avoirID(requete);
    })
    let para="&val=" + valeur;
    requete.send(para);
}

function avoirID(req){
    tab=JSON.parse(req.responseText);
    idFiche=tab[0]["idFiche"];
}