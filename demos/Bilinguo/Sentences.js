"use strict"
import {sentences} from "./data/PhrasesDuJour-fr-en.js"
// import {sentences} from "./data/gen-en-fr.js"
// import {tests as sentences} from "./data/tests-en-fr.js"

export {makeStructs,sentences,getIndices,tokenize,shuffle}

  // taken from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array/6274381#6274381
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// return a list of shuffled indices for a list
function getIndices(list){
    return shuffle(Array.from(Array(list.length).keys()));
}

// split a string into tokens taking into account French accented letters
// because of the parentheses in the regex all tokens are kept. 
// Tokens with only spaces are removed
function tokenize(s){
    return s.split(/([^a-zA-Zà-üÀ-Ü]+)/).filter(e=>e.trim().length>0)
}
//  get value of parameter and evaluate it in the appropriate language if it is a function
function getParam(lang,val){
    if (typeof val == 'function'){
        load(lang);
        return val()
    }
    return val;
}

function makeStructs(src,tgt,level){
    // HACK: the word selection is done by shuffling a new list of indices (so that the corresponding src and tgt words are selected)
    //       and taking (shifting) the first indices of this list when needed either for a word or a distractor 
    const [srcIdx,tgtIdx] = src=="fr" ? [0,1] : [1,0]
    const s = oneOf(sentences.filter(s=>s.level===undefined || s.level<=level));  // select a sentence
    // const s = sentences[6];   // useful for testing a single sentence
    // build the list of parameters and distractors for the target language
    let params=[], distractors=[];
    for (let ps of s.params){
        if (!Array.isArray(ps[0]))ps=ps.map(e=>[e,e]); // src and tgt values are the same
        let indices = getIndices(ps);
        let idx=indices.shift();
        const param=new Array(2);
        param[srcIdx]=getParam(src,ps[idx][srcIdx])
        param[tgtIdx]=getParam(tgt,ps[idx][tgtIdx]);
        params.push(param);
        if (indices.length>0){
          if (typeof(param[tgtIdx])=="string" && param[tgtIdx].length>1){
              const distractor=ps[indices.shift()][tgtIdx];
              if (!distractors.includes(distractor))
                distractors.push(distractor)
          } else if (param[tgtIdx] instanceof Constituent){
                distractors.push(...tokenize(getParam(tgt,ps[indices.shift()][tgtIdx]).realize()))
          }
        }          
    }
    // create source and target structure
    load(src);
    const srcStruct = s[src].apply(null,params.map(e=>e[srcIdx]));
    load(tgt);
    const tgtStruct = s[tgt].apply(null,params.map(e=>e[tgtIdx]));
    return [srcStruct,tgtStruct,distractors]
}
