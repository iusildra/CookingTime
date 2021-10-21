const boutonAjouterEtape= document.getElementById("boutonAjouterEtape");
const boutonAjouterIngredient= document.getElementById("boutonAjouterIngredient");
const boutonAjouterSousRecette= document.getElementById("boutonAjouterSousRecette");
const etapes= document.getElementById("etapesRecette");
const ingredients = document.getElementById("ingredientsRecette");
const sousrecettes = document.getElementById("sousRecettesRecette");
const elementsRecette= document.getElementsByClassName("elementsRecette");

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

function ajouterEtape(contenu){
    nbEtape++;
    let div=document.createElement("div");
    div.id="etape" + nbEtape;
    div.className="etape";
    div.innerHTML="<div><p>N° d'étape</p>\n" +
        "                    <input class='id' type='number' value='"+ nbEtape +"' readonly/>\n" +
        "                    <p>Durée de l'étape (min)</p>"+
        "                    <input type='number' id=\"dureePhase\" value='"+ parseInt(contenu[1]) +"'/><br />" +
        "                    <p>Description</p>\n" +
        "                    <textarea class='descriptionEtape' rows='4' cols='45'>"+ contenu[0] +"</textarea>\n" +
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
    let tr = document.createElement("tr");
    tr.innerHTML = "<td><select class='baliseSelect'/></select></td>\n"+
        "<td><input id='quantite'type='number' value='"+contenu[2]+"'/>  "+contenu[3]+"</td>\n"+
        "<td><button class='boutonSupprimerElementRecette'>X</button></td>";
    ingredients.append(tr);
    tabSelect=document.querySelectorAll("#"+ingredients.id+" select");
    select=tabSelect[tabSelect.length-1];
    console.log(select);
    requeteAJAXgetAll("Ingredient",ajouterOptions,select);
    choisirOptions(select,contenu[1]),100

    tabBoutons=document.querySelectorAll("#" +ingredients.id + " .boutonSupprimerElementRecette");
    tabBoutons[tabBoutons.length-1].addEventListener("click", function () {
        ligne=event.target.parentElement.parentElement;
        table=ligne.parentElement;
        supprimerElementRecette(ligne,table);
    });
}

function remplirBalisesSelectRecette(objet,colonne){
    tabBalises=document.getElementById("#"+colonne)
}

function ajouterSousRecette(contenu) {
    let tr = document.createElement("tr");
    tr.innerHTML = "<td><input type='text' value='"+contenu[1]+"'/></td>\n"+
        "<td><input class='qteSousRecettes' type='number' value='"+contenu[2]+"'/></td>\n"+
        "<td><button class='boutonSupprimerElementRecette'>X</button></td>"
    sousrecettes.append(tr);
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
    nbEtape=0;
}

function remplirIngredients(req){
    let tabContenu= JSON.parse(req.responseText);
    for(contenu of tabContenu) {
        valeurs=Object.values(contenu)
        let input = [valeurs[0], valeurs[1] , valeurs[2] , valeurs[3]];
        ajouterIngredient(input,);
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