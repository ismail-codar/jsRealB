function np(n){
    return (typeof n=="string")?NP(D("le"),N(n)):n;
}

function tnp(n0,prep,n1){ // task np
    return NP(np(n0),PP(P(prep),np(n1)));
}

function tvp(v,n){ //task vp
    if (typeof v=="string")v=V(v);
    return VP(v,np(n));
}

function generateTaskDescriptions() {
    // ajouts au lexique
    var verbes1erGroupe=["approvisionner","bétonner","débuter","effectuer","planifier","terrasser"];
    for (var i = 0; i < verbes1erGroupe.length; i++) 
        addToLexicon(verbes1erGroupe[i],{"V":{"tab":"v36","aux":["av"]}});
    var nomsFeminins=["canalisation","charpente","couverture","installation","isolation","longrine","maçonnerie","pose"];
    for (var i = 0; i < nomsFeminins.length; i++)
        addToLexicon(nomsFeminins[i],{"N":{"g":"f","tab":["n17"]}});
    var nomsMasculins=["approvisionnement","béton","chantier","dallage","enduit","montage","terrassement"];
    for (var i = 0; i < nomsMasculins.length; i++) 
        addToLexicon(nomsMasculins[i],{"N":{"g":"m","tab":["n3"]}});
    addToLexicon({"en":{"P":{"tab":["pp"]}}});
    addToLexicon({"armé":{"A":{"tab":["n28"]}}});
    addToLexicon({"on":{"N":{"g":"m","tab":["n3"]}}})// hack: on devrait plutôt changer la table pn1...

    betonArme=np("béton").add(A("armé"));
    puits=np("puits").n("p");
    longrines=np("longrine").n("p");
    canalisations=np("canalisation").n("p");

    var q; // variable temporaire utilisée lors de l'initialisation de tasks
    addNPVP(tasks,"a",tnp("étude","de","chauffage"),tvp("planifier","chauffage"));
    addNPVP(tasks,"b",tnp("étude","de","couverture"),tvp("planifier","couverture"));
    addNPVP(tasks,"c",tnp("étude","de","charpente"),tvp("planifier","charpente"));
    addNPVP(tasks,"d",q=tnp("étude","de",betonArme),tvp("planifier",q));
    addNPVP(tasks,"e",tnp("préparation","de","terrain"),tvp("préparer","terrain"));
    addNPVP(tasks,"f",tnp("installation","de","chantier"),tvp("installer","chantier"));
    addNPVP(tasks,"g",q=tnp("terrassement","pour",puits),tvp("effectuer",q));
    addNPVP(tasks,"h",q=tnp("béton","pour",puits),tvp("installer",q));
    addNPVP(tasks,"i",tnp("terrassement","pour",longrines),tvp("terrasser",longrines));
    addNPVP(tasks,"j",q=tnp("béton","pour",longrines),tvp("couler",q));
    addNPVP(tasks,"k",tnp("construction","de",q=tnp("charpente","en",N("atelier"))),tvp("construire",q));
    addNPVP(tasks,"l",q=tnp(NP(D("un"),N("couche"),A("premier")),"de",tnp(N("peinture"),"en",N("usine"))),tvp("appliquer",q));
    addNPVP(tasks,"m",tnp("transport","de","charpente"),tvp("transporter","charpente"));
    addNPVP(tasks,"n",tnp("montage","de","charpente"),tvp("monter","charpente"));
    addNPVP(tasks,"o",tnp("terrassement","pour",canalisations),tvp("terrasser",canalisations));
    addNPVP(tasks,"p",tnp("maçonnerie","pour",canalisations),tvp("bétonner",canalisations));
    addNPVP(tasks,"q",tnp(np("approvisionnement").n("p"),"pour","chauffage"),
                      VP(Q("se"),V("approvisionner"),PP(P("pour"),NP(D("le"),N("chauffage")))));
    addNPVP(tasks,"r",tnp("pose","de","chauffage"),tvp("poser","chauffage"));
    addNPVP(tasks,"s",NP(D("le"),A("autre"),N("couche"),PP(P("de"),N("peinture"))).n("p"),tvp("terminer","peinture"));
    addNPVP(tasks,"t",tnp("étude","pour","électricité"),tvp("planifier",tnp("installation","de","électricité")));
    addNPVP(tasks,"u",tnp("isolation","de","couverture"),tvp("isoler","couverture"));
    addNPVP(tasks,"v",tnp("installation","de","électricité"),tvp("installer","électricité"));
    addNPVP(tasks,"w",q=NP(D("le"),N("dallage")),tvp("exécuter",q));
    addNPVP(tasks,"x",NP(D("le"),N("enduit")).n("p"),
                      PP(CP(C("et"),V("remplir"),V("recouvrir")),P("de"),N("enduit").n("p")));
}

if (typeof module !== 'undefined' && module.exports) {
    exports.generateTaskDescriptions=generateTaskDescriptions;
}