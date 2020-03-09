// design of a new organisation for warnings
// it uses jsRealB for the realization of messages
// not sure this is simpler, but at least it shows how jsRealB can be used for realizing its own messages

// add words to the basic lexicon for use in the warnings
//  the lexical information is taken from dmf and dme
loadFr();
addToLexicon("aucun",{ D: { tab: [ 'd4' ] }})
addToLexicon("comme",{ Adv: { tab: [ 'av' ] }, C: { tab: [ 'cj' ] } })
addToLexicon("contraction",{ N: { g: 'f', tab: [ 'n17' ] } })
addToLexicon("français",{ A: { tab: [ 'n27' ] }, N: { g: 'm', tab: [ 'n35' ] } })
addToLexicon("implémenter",{ V: { aux: [ 'av' ], tab: 'v36' } })
addToLexicon("lexique",{ N: { g: 'm', tab: [ 'n3' ] } })
addToLexicon("option",{ N: { g: 'f', tab: [ 'n17' ] } })
addToLexicon("morphologie",{ N: { g: 'f', tab: [ 'n17' ] } })
addToLexicon("ordinal",{ A: { tab: [ 'n47' ] }, N: { g: 'm', tab: [ 'n5' ] } })
addToLexicon("paramètre",{ N: { g: 'm', tab: [ 'n3' ] } })

loadEn();
addToLexicon("as",{ Adv: { tab: [ 'b1' ]}})
addToLexicon("French",{ A: { tab: [ 'a1' ] }, N: { tab: [ 'n5' ] } })
addToLexicon("implement",{ N: { tab: [ 'n1' ] }, V: { tab: 'v1' } })
addToLexicon("lexicon",{ N: { tab: [ 'n1' ] } })
addToLexicon("morphology",{ N: { tab: [ 'n5' ] } })
addToLexicon("ordinal",{ A: { tab: [ 'a1' ] }, N: { tab: [ 'n1' ] } })

// generate a warning message in the current language
//   the first argument must correspond to a key in the warnings table
Constituent.prototype.warn = function(_){
    let args=Array.from(arguments);
    let mess;
    const lang=getLanguage();
    // load the current language, 
    // HACK:  wrap object with parentheses so that the parser does not think this is the start of a block
    ({en:loadEn,fr:loadFr})[lang](); 
    const messFns = this.warnings[args.shift()];  // get the English and French jsRealB structure
    if (messFns===undefined){
        this.error("warn called with an unknown error message:"+arguments[0])
    }
    mess=this.me()+":: "+ messFns[lang].apply(null,args).cap(false) // realize the warning 
    if (exceptionOnWarning) throw mess;
    console.warn(mess);
    return this;
}

// create a list of elements [a,b,c] => "a, b $conj c" 
makeDisj = function(conj,elems){
    return CP.apply(null,[C(conj)].concat(elems.map(e=>Q(e))))+""
}

// table of jsRealB structures for warning messages
//   the warnings are parameterized by strings that are inserted verbatim in the realization
Constituent.prototype.warnings = {
    "bad parameter":
        {en:(good,bad)=> // the parameter should be $good, not $bad
            S(NP(D("the"),N("parameter")),
              VP(V("be").t("ps"),Q(good).a(","),Adv("not"),Q(bad))).typ({mod:"nece"}),
         fr:(good,bad)=> // le paramètre devrait être $good, pas $bad
            S(NP(D("le"),N("paramètre")),
              VP(V("être").t("c"),Q(good).a(","),Adv("pas"),Q(bad))).typ({mod:"nece"})},
    "bad application":
        {en:(info,goods,bad)=> // $info should be applied to $good, not to $bad
            S(Q(info),VP(V("apply").t("ps"),
                         PP(P("to"),makeDisj("or",goods)).a(","),Adv("not"),PP(P("to"),Q(bad)))).typ({mod:"nece",pas:true}),
         fr:(info,goods,bad)=> // $info devrait être appliqué à $good, non à $bad.
            S(Q(info),VP(V("appliquer").t("c"),
                         PP(P("à"),makeDisj("ou",goods)).a(','),Adv("non"),PP(P("à"),Q(bad)))).typ({mod:"nece",pas:true})},
    "bad position":
        {en:(bad,limit)=> // $bad should be smaller than $limit.
            S(NO(bad),VP(V("be").t("ps"),A("small").f("co"),P("than"),NO(limit))).typ({mod:"nece"}),
         fr:(bad,limit)=> // $bad devrait être plus petit que $limit.
            S(NO(bad),VP(V("être").t("c"),A("petit").f("co"),Pro("que"),NO(limit))).typ({mod:"nece"})},
    "bad const for option":
        {en:(option,constType,allowedConsts)=> 
            // option $option is applied to $constType, but it should be $allowedConsts.
              CP(C("but"),
                 VP(V("apply"),NP(N("option"),Q(option)),PP(P("to"),Q(constType))).typ({pas:true}).a(","),
                 VP(Pro("I"),V("be").t("ps"),makeDisj("or",allowedConsts)).typ({mod:"nece"})
              ),
         fr:(option,constType,allowedConsts)=>
              //  l'option $option est appliquée à $constType, mais elle devrait être $allowedConsts
              CP(C("mais"),
                 VP(V("appliquer"),NP(D("le"),N("option"),Q(option)),PP(P("à"),Q(constType))).typ({pas:true}).a(","),
                 VP(Pro("je").g("f"),V("être").t("c"),makeDisj("ou",allowedConsts)).typ({mod:"nece"})
              )},
    "ignored value for option":
        {en:(option,bad)=> // $bad: bad value for option $option is ignored.
            S(Q(bad).a(":"),
              VP(V("ignore"),NP(D("this"),A("bad"),N("value"),
                                PP(P("for"),N("option"),Q(option)))).typ({pas:true})),
         fr:(option,bad)=>  // $bad : cette mauvaise valeur pour l'option $option est ignorée
            S(NP(Q(bad).a(":"),
              VP(V("ignorer"),NP(D("ce"),A("mauvais"),N("valeur"),
                                 PP(P("pour"),D("le"),N("option"),Q(option)))).typ({pas:true})))},
    "no value for option":
        {en:(option,validVals)=> //  no value for option $option should be one of $validVals.
            S(NP(Adv("no"),N("value"),PP(P("for"),N("option"),Q(option))),
              VP(V("be").t("ps"),Pro("one"),PP(P("of"),Q(validVals)))).typ({mod:"nece"}),
         fr:(option,validVals)=> // aucune valeur pour l'option $option, devrait être une parmi $validVals.
            S(NP(D("aucun"),N("valeur"),PP(P("pour"),D("le"),N("option"),Q(option))).a(","),
              VP(V("être").t("c"),D("un").g("f"),PP(P("parmi"),Q(validVals)))).typ({mod:"nece"})},
    "not found":
        {en:(missing,context)=> // no $missing found in $context.
            S(NP(Adv("no"),Q(missing)),VP(V("find").t("pp"),PP(P("in"),Q(context)))),
         fr:(missing,context)=> // aucun $missing trouvé dans $context.
            S(NP(D("aucun"),Q(missing)),VP(V("trouver").t("pp"),PP(P("dans"),Q(context))))},
    "bad ordinal":
        {en:(value)=> // cannot realize $value as ordinal.
            S(VP(V("realize"),Q(value),AdvP(Adv("as"),N("ordinal")))).typ({neg:true,mod:"poss"}),
         fr:(value)=> // $value ne peut pas être réalisé comme un ordinal.
            S(Q(value),VP(V("réaliser"),AdvP(Adv("comme"),NP(D("un"),N("ordinal"))))).typ({neg:true,mod:"poss",pas:true})},
    "bad number in word":
        {en:(value)=> // cannot realize $value in words.
            S(VP(V("realize"),Q(value),PP(P("in"),N("word").n("p")))).typ({neg:true,mod:"poss"}),
         fr:(value)=>// $value ne peut pas être réalisé en mots.
            S(VP(Q(value),V("réaliser"),PP(P("en"),NP(N("mot").n("p"))))).typ({neg:true,mod:"poss",pas:true})},
    "no French contraction":
        {en:()=> // contraction is ignored in French.
            S(VP(V("ignore"),NP(N("contraction")),PP(P("in"),N("French")))).typ({pas:true}),
         fr:()=> // la contraction est ignorée en français.
            S(VP(V("ignorer"),NP(D("le"),N("contraction")),PP(P("en"),N("français")))).typ({pas:true})},
    "morphology error":
        {en:(info)=> // morphology error: $info.
            S(NP(N("morphology"),N("error")).a(":"),Q(info)),
         fr:(info)=> // erreur de morphologie : $info.
            S(NP(N("erreur"),PP(P("de"),N("morphologie"))).a(":"),Q(info))},
    "not implemented":
        {en:(info)=> // $info is not implemented.
            S(Q(info),VP(V("implement"))).typ({neg:true,pas:true}),
         fr:(info)=> // $info n'est pas implémenté.
            S(Q(info),VP(V("implémenter"))).typ({neg:true,pas:true})},
    "not in lexicon":
        {en:()=> // not found in lexicon.
            S(Adv("not"),V("find").t("pp"),PP(P("in"),N("lexicon"))),
         fr:()=> // absent du lexique.
            S(AP(A("absent"),PP(P("de"),NP(D("le"),N("lexique")))))},
    "bad Constituent":
        {en:(rank,type)=> // the $rank parameter is not Constituent.
            S(NP(D("the"),Q(rank),N("parameter")),
              VP(V("be"),Q("Constituent"))).typ({neg:true}),
         fr:(rank,type)=> // le $rank paramètre n'est pas Constituent.
            S(NP(D("le"),Q(rank),N("paramètre")),
              VP(V("être"),Q("Constituent"))).typ({neg:true})},
    "too many parameters":
        {en:(termType,number)=> // $termType accepts one parameter, but has $number.
             S(Q(termType),CP(C("but"),
                              VP(V("accept"),NP(D("a"),A("single"),N("parameter"))).a(","),
                              VP(VP(V("have"),NO(number))))),
         fr:(termType,number)=> // $termType accepte un paramètre, mais en a $number.
             S(Q(termType),CP(C("mais"),
                              VP(V("accepter"),NP(D("un"),A("seul"),N("paramètre"))).a(","),
                              VP(VP(Pro("en"),V("avoir"),NO(number)))))}
}

// function testWarnings(n){
//     for (w in warnings){
//         console.log(w)
//         N(n).warn(w,"A","B","C")
//     }
// }
