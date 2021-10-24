const boutonAjouterEtape= document.getElementById("boutonAjouterEtape");
const boutonAjouterIngredient= document.getElementById("boutonAjouterIngredient");
const boutonAjouterSousRecette= document.getElementById("boutonAjouterSousRecette");
const etapes= document.getElementById("etapesRecette");
const ingredients = document.getElementById("ingredientsRecette");
const sousrecettes = document.getElementById("sousRecettesRecette");
const elementsRecette= document.getElementsByClassName("elementsRecette");
const boutonImpression= document.getElementById("boutonImpression");

let nbEtape=0;

boutonAjouterEtape.addEventListener("click",function (){
    ajouterEtape(["",""]);
});
boutonAjouterIngredient.addEventListener("click",function (){
    ajouterIngredient(["","","",""]);
});
boutonAjouterSousRecette.addEventListener("click",function (){
    ajouterSousRecette(["","",""]);
});

boutonImpression.addEventListener("click", function () {
    window.print();
})

function printPDF() {
    for (div in document.querySelectorAll("#printer div")) {
        div.innerHTML = "";
    }

    for (etape of document.getElementById("etapesRecette").children) {
        var content = ""
        let content1 = document.querySelectorAll("#" + etape.id + " input");
        let content2 = document.querySelectorAll("#" + etape.id + " textarea");

        content += "<b>Phase n°"+content1[0].value + " - ";
        content += content1[1].value + "min</b> <br/>";
        content += content2[0].value + "<br/><br/>";

        let divEtape = document.getElementById("printEtape");
        console.log(divEtape)
        divEtape.innerHTML += content;
    }

    for (ing of document.getElementById("ingredientsRecette").children) {
        let name = ing.children[0].children[0].value
        let quantite = ing.children[1].children[0].value
        let unite = ing.children[1].children[0].innerText;
        console.log(unite);

        document.getElementById("printIngredient").innerHTML +=
            name + " : " + quantite + unite + "<br>";
    }

    for (sr of document.getElementById("sousRecettesRecette").children) {
        let name = sr.children[0].children[0].value;
        console.log(name);
        let quantite = sr.children[1].children[0].value;
        console.log(quantite);
        document.getElementById("printSousRecette").innerHTML +=
            name + " : " + quantite + "<br>";
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
        "                       <input type='number' id=\"dureePhase\" value='"+ parseInt(contenu[1]) +"'/>\n" +
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
// value='" + contenu[0]"'
function ajouterIngredient(contenu) {
    elementsRecette[1].hidden='';
    let tr = document.createElement("tr");
    tr.innerHTML = "<td><select/></select></td>\n"+
        "<td><input id='quantite'type='number' value='"+contenu[2]+"'/>  "+contenu[3]+"</td>\n"+
        "<td><button class='boutonSupprimerElementRecette'>X</button></td>";
    ingredients.append(tr);
    tabSelect=document.querySelectorAll("#"+ingredients.id+" select");
    select=tabSelect[tabSelect.length-1];
    console.log(select);
    requeteAJAXgetAll("Ingredient",ajouterOptions,select);
    setTimeout(choisirOptions,200,select,contenu[1]);
    tabBoutons=document.querySelectorAll("#" +ingredients.id + " .boutonSupprimerElementRecette");
    tabBoutons[tabBoutons.length-1].addEventListener("click", function () {
        ligne=event.target.parentElement.parentElement;
        table=ligne.parentElement;
        supprimerElementRecette(ligne,table);
    });
}

function ajouterSousRecette(contenu) {
    elementsRecette[2].hidden='';
    let tr = document.createElement("tr");
    tr.innerHTML = "<td><select class='selectRecette'/></select></td>\n"+
        "<td><input id='quantite'type='number' value='"+contenu[2]+"'/></td>\n"+
        "<td><button class='boutonSupprimerElementRecette'>X</button></td>";
    sousrecettes.append(tr);
    tabSelect=document.querySelectorAll("#"+sousrecettes.id+" select");
    select=tabSelect[tabSelect.length-1];
    console.log(select);
    requeteAJAXgetAll("Fiche",ajouterOptions,select);
    setTimeout(choisirOptions,200,select,contenu[1]);
    tabBoutons=document.querySelectorAll("#"+sousrecettes.id+" .boutonSupprimerElementRecette");
    tabBoutons[tabBoutons.length-1].addEventListener("click", function () {
        ligne=event.target.parentElement.parentElement;
        table=ligne.parentElement;
        supprimerElementRecette(ligne,table);
    });
}

/*<tr id="i0" style="display: none;">
                  <td>
                    <input type="text" name="ingredient" placeholder="nom" />
                  </td>
                  <td>
                    <input type="number" name="ingredientQte" placeholder="0" />
                  </td>
                  <td>
                    <button id="b0" class="suppression">X</button>
                  </td>
                </tr>*/


/*<tr id="r0" style="display: none">
              <td>
                <input type="text" id="recette" placeholder="nom" />
              </td>
              <td>
                <input type="number" id="recetteQte" placeholder="0" />
              </td>
              <td><button id="b0" class="suppression">X</button></td>
            </tr> */

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
    console.log(tabIdEtapes)
    for(let i=0;i<tabIdEtapes.length;i++)
        tabIdEtapes[i].value=i+1;
}

function remplirEtapes(etapes){
    let tabEtape = etapes.split("\n");
    for (etape of tabEtape) {
        let input= etape.split("&&");
        ajouterEtape(input);
    }
}

function viderRecette(){
    for (element of elementsRecette)
        element.innerHTML="";
    elementsRecette[1].hidden="true";
    elementsRecette[2].hidden="true";
    nbEtape=0;
}

function remplirIngredients(req){
    let tabContenu= JSON.parse(req.responseText);
    for(contenu of tabContenu) {
        valeurs=Object.values(contenu)
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
    remplirEtapes(etapes);
    requeteAJAXSelection("Contenir",idFiche,remplirIngredients);
    requeteAJAXSelection("PeutContenir",idFiche,remplirSousRecettes);
}