const boutonAjouterEtape= document.getElementById("boutonAjouterEtape");
const etapes= document.getElementById("etapesRecette");
const elementsRecette= document.getElementsByClassName("elementsRecette");

let nbEtape=0;

boutonAjouterEtape.addEventListener("click",function () {
    ajouterEtape(["",""]);
})

function ajouterEtape(contenu){
    nbEtape++;
    let div=document.createElement("div");
    div.id="etape" + nbEtape;
    div.className="etape";
    div.innerHTML="<div><label for='idPhase' >N° d'étape</label><br />\n" +
        "                    <input class='id' type='number' value='"+ nbEtape +"' readonly/><br />\n" +
        "                    <label for='dureePhase'>Durée de l'étape (min)</label><br/> "+
        "                    <input type='number' id=\"dureePhase\" value='"+ parseInt(contenu[1]) +"'/><br />" +
        "                    Description<br/>\n" +
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

}