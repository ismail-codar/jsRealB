"use strict";

// load jsRealB symbols
Object.assign(globalThis,jsRealB);

//  Demo similar to a "game" proposed by Duolingo to translate a
//  source sentence by clicking on words in the target language to build the translation.
//  Not all words are selected because some "distractors" are added to make the exercise more challenging.
//  When the user has finished, the words in the translation are compared to the expected answer
//  and the differences are highlighted.

//  Source sentences are built by selecting randomly from a small list of lemmata
//  of nouns, pronouns, adjectives and verbs. 
//  All sentences are of the form: S(NP(...),VP(V(..),NP(...)))  [NP(...) can be also be Pro(...)]

//  Some jsRealB bilingual features are featured:
//    - random selection of lemma, tense, number, person (for pronoun) using oneOf(...)
//    - The same sentence pattern is used for both languages, but agreement is language dependent
//    - Variants of sentences (e.g. negation, progressive, yes-or-no question, tag question) can be generated.
//      Once a variant is selected for the source, it is applied to the target for building the expected sentence.
//    

// translation direction
let src="en",tgt="fr";
let expectedTokens;
// scores
let nbTries=0,nbSuccesses=0;

// set the source language
function setSrc(lang){
    src=lang;
    tgt=src=="en"?"fr":"en";
    // show elements with the src language and hide one in tgt language
    $(`[lang=${src}]`).show();
    $(`[lang=${tgt}]`).hide();
    if ($("#explanation").is(":visible")){
        $(`#show-${src}-expl`).hide();
    } else {
        $(`#hide-${src}-expl`).hide();
    }
    // initialize everything
    expectedTokens=showExercise();
    nbSuccesses=0;
    nbTries=0;
    showResults();
}

const levels = {
    "fr":["simple","facile","compliqué","difficile","expert","diabolique"],
    "en":["simple","easy","complicated","challenging","expert","devilish"]};
const tenses = {
    "fr":[["p"],["p","pc"],["p","pc","f"],["p","pc","f"],["p","ps","f"],["p","ps","f","c"]],
    "en":[["p"],["p","ps"],["p","ps","f"],["p","ps","f"],["p","ps","f"],["p","ps","f","c"]],
}
const variants = [
     [{}],
     [{},{"neg":true}],
     [{},{"neg":true},{"mod":"poss"}],
     [{},{"neg":true},{"mod":"poss"},{"int":"yon"}],
     [{},{"neg":true},{"mod":"poss"},{"int":"yon"},{"int":"tag"},{"prog":true}],
     [{"neg":true,"pas":true,"mod":"poss","int":"yon","prog":true}],
]

function addLevels(lang,selected){
    const $levels=$(`#levels-${lang}`)
    for (let i=0;i<levels[lang].length;i++){
        const $option=$(`<option value="${i}">${levels[lang][i]}</option>`);
        if (i==selected)$option.prop("selected","selected");
        $levels.append($option)
    }
}

function makeSentences(src,tgt){
    const n = oneOf("s","p");
    // get values of selected exercises from the checkboxes (defaulting to present and affirmative)
    // let t     = oneOf($(`span[lang=${src}] .tense:checked`).map((i,e)=>JSON.parse($(e).val())).get()) || "p";
    // const typ = oneOf($(`span[lang=${src}] .typ:checked`).map((i,e)=>JSON.parse($(e).val())).get()) || {};
    const level=+$(`#levels-${src}`).val();
    const tIdx = oneOf(getIndices(tenses[src][level]));
    const typ = oneOf(variants[level])
    let res={};
    [res[src],res[tgt],res["distractors"]]=makeStructs(src,tgt,level);
    res[src].n(n).t(tenses[src][level][tIdx]).typ(typ);
    res[tgt].n(n).t(tenses[tgt][level][tIdx]).typ(typ);
    return res;
}


///// Display
//  insert words in #target-words that can be clicked 
function showWords(words){
    shuffle(words)
    for (let i=0;i<words.length;i++){
        $("#target-words").append($("<span/>").addClass("word").text(words[i]).click(moveWord));
    }
}

//  move words from to the sentence or back to the target words
function moveWord(e){
    if ($(this).parent().get(0)==$("#target-words").get(0)){ // move to sentence
        $(this).addClass("used").off("click"); // current word is grayed
        // create new word saving reference to original
        const $newWord= $("<span/>").addClass("word").text($(this).text()).click(moveWord);
        $newWord.data("original",$(this));
        $("#target-sentence").append($newWord);
    } else { // move back to original position
        const $original=$(this).data("original");
        $original.removeClass("used").click(moveWord);
        $(this).remove();
    }
}

//  create new exercise
function showExercise(){
    // reset fields
    $("#verdict,#answer").html("");
    $("#source,#target-words,#target-sentence").empty();
    $("#continue-"+src).hide();
    $("#check-"+src).show();
    // create source and target sentences
    const sents = makeSentences(src,tgt);
    // realize source
    load(src);
    $("#source").text(sents[src].realize());
    // realize target
    load(tgt);
    const tgtSent = sents[tgt].realize();
    // tokenize target sentence
    let tgtTokens;
    if (tgtSent.endsWith("n'est-ce pas? ")){
        tgtTokens=tgtSent.slice(0,-"n'est-ce pas? ".length).split(/([^a-zA-Zà-üÀ-Ü]+)/).filter(e=>e.trim().length>0);
        tgtTokens.push("n'est-ce pas?");
    } else
        tgtTokens = tgtSent.split(/([^a-zA-Zà-üÀ-Ü]+)/).filter(e=>e.trim().length>0);
    showWords(tgtTokens.concat(sents["distractors"]))
    return tgtTokens;
}

// indicate as bad, span elements having element id as parent
//      only elements with index between start and end are selected
function showAsBad(id,start,end){
    for (let k=start; k<=end; k++){
        $(`${id} span:nth-child(${k+1})`).addClass("bad")
    }
}

// display statistics 
function showResults(){
    $("#tries .value").text(nbTries); 
    $("#successes .value").text(nbSuccesses);
    $("#percent").text(nbTries>0 ? Math.round(nbSuccesses*100/nbTries)+"%" : "")
}

//  check the produced translation with the expected one
//  compute differences and if there are any, display them
function checkTranslation(e){
    const myId=$(e.target).attr('id');
    const userTokens = $("#target-sentence").children().map((i,e)=>$(e).text()).get();
    // compute edit distance and operations
    const [edits,nbEdits] = levenshtein(userTokens,expectedTokens);
    nbTries++;
    if (nbEdits==0){
        $("#verdict").html("<b style='color:green'>Bravo!</b>")
        nbSuccesses++;
    } else {
        $("#verdict").html(src=="fr" ? "<b style='color:red'>Raté</b>: voici la bonne réponse" 
                                : "<b style='color:red'>Missed</b>: here is the right answer" );
        $("#answer").html(expectedTokens.map(w=>`<span class="word">${w}</span>`).join(""))
        // display edit operations
        for (let [op,start1,end1,start2,end2] of edits){
            if (op=="DEL"){
                showAsBad("#target-sentence",start1,end1);
            } else if (op=="REP"){
                showAsBad("#target-sentence",start1,end1);
                showAsBad("#answer",start2,end2);
            } else {// op=="INS"
                showAsBad("#answer",start1,end1)
            }
        }
    }
    $("#"+myId).hide();
    $("#"+myId.replace("check","continue")).show()
    showResults()
}

//   set callback functions
$(document).ready(function() {
    addLevels("fr",1);addLevels("en",1);
    $("#check-en,#check-fr").click(checkTranslation);
    $("#continue-en,#continue-fr").click(function(){
        expectedTokens=showExercise();
    }).hide()
    $("#changeLang").click(function(){setSrc(tgt)});
    $("#hide-show-explanation").click(function(){
        $("#explanation").toggle();
        if ($("#explanation").is(":visible")){
            $(`#show-${src}-expl`).hide();
            $(`#hide-${src}-expl`).show();
        } else {
            $(`#show-${src}-expl`).show();
            $(`#hide-${src}-expl`).hide();
        }
    })
    setSrc("fr");
    $(`#show-${src}-expl`).hide();
});
