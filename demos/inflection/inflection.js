//
//   Conjugation-Declension tables with jsRealB
//
Object.assign(globalThis,jsRealB);

var $entree,$tableau;
var language;

var titleConj={"fr": "Conjugaison de ","en":"Conjugation of <i>to</i> "};
var titleDecl={"fr": "Déclinaison de ","en":"Declension of "};
var titleCommeNom={"fr": " comme nom","en":" as noun"};
var titleCommeAdj={"fr": " comme adjectif","en":" as adjective"};

function conjuguer(verbe, lang,typs){
    function realize(t,pe,n,g){
        try {
             if (g !== undefined){ // French past participle
                return VP(V(verbe).t("pp").n(n).g(g)).typ(typs).realize()
            } else if (t=="ip"){
                if ((n=="s" && [1,3].indexOf(pe)>=0) || (n=="p" && pe==3)){
                    return "&mdash;"
                } else {
                    return VP(V(verbe).t("ip").pe(pe).n(n)).typ(typs).realize()
                }
            } else {
                let v = V(verbe).t(t);
                if (pe == null) return VP(v).typ(typs).realize();
                let sp= SP(Pro(lang=="fr"?"moi":"me").c("nom").pe(pe).n(n),VP(v)).typ(typs);
                if (t.startsWith("s") && lang=="fr")// subjonctif français
                    sp=SP(Q("que"),sp);
                return sp.realize()
            }
        } catch (error) {
            return "&mdash;"
        }
    }
    let temps;
    if (lang=="fr"){
        loadFr();
        const entry=getLemma(verbe)
        if (entry===undefined || !("V" in entry))return;
        temps= [
            [["Présent","p"],["Imparfait","i"],["Futur simple","f"],["Passé simple","ps"]],
            [["Passé composé","pc"],["Plus-que-parfait","pq"],["Futur antérieur","fa"],["Passé antérieur","pa"]],
            [["Subjonctif présent","s"],["Subjonctif imparfait","si"],["Subjonctif passé","spa"],
             ["Subjonctif plus-que-parfait","spq"]],
            [["Conditionnel présent","c"],["Conditionnel passé","cp"],["Impératif","ip"]],
            [["Participe présent","pr"],["Participe passé","pp"],["Infinitif","b"],["Infinitif passé","bp"]]
        ]
    } else {
        loadEn();
        const entry=getLemma(verbe)
        if (entry===undefined || !("V" in entry))return;
        temps= [
            [["Present","p"],["Simple past","ps"],["Future","f"]],
            [["Subjonctive","s"],["Conditional","c"],["Imperative","ip"]],
            [["Participle present","pr"],["Participle past","pp"],["Infinitive","b-to"],["Infinitive past","bp-to"],]
        ]
    }
    $("#tableau").append(`<h1>${titleConj[language]} <i>${verbe}</i></h1>`);
    for (tmp of temps) {
        let $row=$("<tr/>");
        for (t of tmp){
            $row.append(`<th>${t[0]}</th>`)
        }
        $("#tableau").append($row)
        if (tmp[0][0].startsWith("Particip")){
            $row=$("<tr/>");
            for (t of tmp){
                let vs;
                if (t[1]=="pp" && lang=="fr"){
                    vs = [realize(t[1],null,"s","m")]
                    vs.push(realize(t[1],null,"s","f"))
                    vs.push(realize(t[1],null,"p","m"))
                    vs.push(realize(t[1],null,"p","f"))
                } else {
                    vs = [realize(t[1],null,null)]
                }
                $row.append("<td>"+vs.join("<br/>")+"</td>")
            }
            $("#tableau").append($row)
        } else {
            for (n of "sp"){
                for (pe of [1,2,3]){
                    $row=$("<tr/>");
                    for (t of tmp)
                        $row.append("<td>"+realize(t[1],pe,n)+"</td>")
                    $("#tableau").append($row)
                }
            }
        }
    }
}

function realize(exp){
    try {
        return exp().realize()
    } catch (error) {
        return "&mdash;"
    }
}

function declinerNom(mot,lang){
    if (lang=="fr"){
        $("#tableau").append("<tr><th></th><th>Singulier</th><th>Pluriel</th></tr>");
        const g=getLemma(mot)["N"]["g"];
        if ("mx".indexOf(g)>=0)
            $("#tableau")
               .append(`<tr><td><i>Masculin</i></td><td>${realize(()=>N(mot).g("m").n("s"))}</td>`+
                                               `<td>${realize(()=>N(mot).g("m").n("p"))}</td></tr>`);
        if ("fx".indexOf(g)>=0)
            $("#tableau")
               .append(`<tr><td><i>Féminin</i></td><td>${realize(()=>N(mot).g("f").n("s"))}</td>`+
                                               `   <td>${realize(()=>N(mot).g("f").n("p"))}</td></tr>`);
    } else {
         $("#tableau").append("<tr><th>Singular</th><th>Plural</th></tr>");
         $("#tableau").append(`<tr><td>${realize(()=>N(mot).n("s"))}</td><td>${realize(()=>N(mot).n("p"))}</td></tr>`);
    }
}

function declinerAdj(mot,lang){
    if (lang=="fr"){
        $("#tableau").append("<tr><th></th><th>Singulier</th><th>Pluriel</th></tr>");
        $("#tableau")
            .append(`<tr><td><i>Masculin</i></td><td>${realize(()=>A(mot).g("m").n("s"))}</td>`+
                                   `<td>${realize(()=>A(mot).g("m").n("p"))}</td></tr>`);
        $("#tableau")
            .append(`<tr><td><i>Féminin</i></td><td>${realize(()=>A(mot).g("f").n("s"))}</td>`+
                                   `<td>${realize(()=>A(mot).g("f").n("p"))}</td></tr>`);
    } else {
        $("#tableau").append("<tr><th>Comparative</th><th>Superlative</th></tr>");
        $("#tableau").append(`<tr><td>${realize(()=>A(mot).f("co"))}</td><td>${realize(()=>A(mot).f("su"))}</td></tr>`);
    }
}

function decliner(mot,lang){
    if (lang=="fr") loadFr(); else loadEn();
    const entry=getLemma(mot);
    if (entry === undefined){
        $("#messErreur")[0].innerHTML=mot+" : "+
             (lang=="fr"?"n'appartient pas au lexique":"is not in the lexicon");
        $("#messErreur").css('color','red');
        return
    }
    $("#messErreur")[0].innerHTML="";
    if ("N" in entry || "A" in entry){
        $("#tableau").append(`<h1>${titleDecl[language]} <i>${mot}</i></h1>`);
        if ("N" in entry){
            $("#tableau").append(`<tr><th colspan="2"><i>${titleCommeNom[language]}</i></th></tr>`)
            declinerNom(mot,lang)
        }
        if ("A" in entry){
            $("#tableau").append(`<tr><th colspan="2"><i>${titleCommeAdj[language]}</i></th></tr>`)
            declinerAdj(mot,lang)
        }
    } else {
        $("#messErreur")[0].innerHTML=mot+" : "+
             (lang=="fr"?"n'est pas un N ou un A":"is not an N or an A");
        $("#messErreur").css('color','red');
    }
}


function conjugueDecline(e){
    // console.log("conjugueDecline("+e+")")
    if (e.which==13){
        $tableau.text("");
        var val=$entree.val().trim();
        if(val.length!=0){
            conjuguer(val,language,getTyps(language));
            decliner(val,language);
        }
    } 
}

function getTyps(lang){
    let typs={neg:$("#negationButton").is(':checked'),
              pas:$("#passiveButton").is(':checked'),
              prog:$("#progressiveButton").is(':checked'),
              refl:$("#reflexiveButton").is(':checked')
             }
    if (lang=="en")
        typs["perf"]= $("#perfectButton").is(':checked');
    return typs;
}

const labels = [
    ["negationButton",{fr:"Négation",en:"Negation"}],
    ["passiveButton",{fr:"Passif",en:"Passive"}],
    ["progressiveButton",{fr:"Progressif",en:"Progressif"}],
    ["reflexiveButton",{fr:"Réflexif",en:"Reflexive"}],
    ["perfectButton",{fr:"Parfait",en:"Perfect"}]
]
function checkLanguage() {
    language = $("#lang-fr")[0].checked?"fr":"en";
    for (label of labels){
        $(`label[for=${label[0]}]`).text(label[1][language])
    }
    if(language == 'fr'){
        loadFr();
        $("label[for=perfectButton]").hide();
        $("#perfectButton").hide();
        $("#entree").prop("placeholder","verbe, nom ou adjectif");
        $("#title").text("Flexions - Verbe, Nom ou Adjectif")
    }
    else{
        loadEn();
        $("label[for=perfectButton]").show();
        $("#perfectButton").show();
        $("#entree").prop("placeholder","verb, noun or adjective");
        $("#title").text("Inflections - Verb, Noun or Adjective")
    }
};


$(document).ready(function() {
    setExceptionOnWarning(true)
   $entree=$("#entree");
   $tableau=$("#tableau");
   $entree.keypress(conjugueDecline);
   $("input[type=checkbox]").change(
       function(){
           var val=$entree.val().trim();
           if(val.length!=0){
               $tableau.text("");
               conjuguer(val,language,getTyps(language));
               decliner(val,language);
           }
       }
   )
   checkLanguage();
   $("#lang-fr").click(checkLanguage);
   $("#lang-en").click(checkLanguage);
});