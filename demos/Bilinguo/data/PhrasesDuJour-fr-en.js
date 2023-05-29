import {dets,pes,numbers,relatives} from "./entities.js"
export {sentences}
const sentences = [
{
  "id":1,
  "level":1,
  "text":'The pretty woman comes with a carrot. | La jolie femme arrive avec une carotte.',
  "TEXT":'The pretty woman comes with a carrot. | La jolie femme arrive avec une carotte. ',
  "en":(pe,n,pretty,woman,carrot)=>
  root(V('come'),
         subj(N(woman).n(n),
              det(D('the')),
              mod(A(pretty)).pos('pre')),
         comp(N(carrot),
              mod(P('with')).pos('pre'),
              det(D('a')))),
  "fr":(pe,n,jolie,femme,carotte)=>
  root(V('arriver'),
         subj(N(femme).n(n),
              det(D('le')),
              mod(A(jolie)).pos('pre')),
         comp(N(carotte),
              mod(P('avec')).pos('pre'),
              det(D('un')))),   
  "params":[pes,numbers,
          [['joli', 'pretty'], ['jeune', 'young'], ['vieux', 'old']],
          [['femme', 'woman'], ['homme', 'man'], ['fille', 'girl'], ['garçon', 'boy']],
          [['carotte', 'carrot'], ['tomate', 'tomato'], ['pomme', 'apple'], ['poire', 'pear']]],
},
{
  "id":2,
  "level":2,
  "text":'The rooster crows every day in the yard. | Le coq chante à chaque jour dans la cour.',
  "TEXT":'The rooster crows every day in the yard. | Le coq chante à chaque jour dans la cour. ',
  "en":(pe,n,rooster,crows,yard)=>
  root(V(crows),
         subj(N(rooster).n(n),
              det(D('the'))),
         comp(N('day'),
              det(D('every'))),
         comp(N(yard),
              mod(P('in')).pos('pre'),
              det(D('the')))),
  "fr":(pe,n,coq,chante,cour)=>
  root(V(chante),
         subj(N(coq).n(n),
              det(D('le'))),
         comp(N('jour'),
              mod(P('à')).pos('pre'),
              det(D('chaque'))),
         comp(N(cour),
              mod(P('dans')).pos('pre'),
              det(D('le')))),   
  "params":[pes,numbers,
          [['coq', 'rooster'], ['poule', 'hen'], ['chanteur', 'singer']],
          [['chanter', 'crow'], ['courir', 'run']],
          [['cour', 'yard'], ['ferme', 'barn']]],
},
{
  "id":3,
  "level":1,
  "text":'My mother receives an apple as a gift. | Ma mère reçoit une pomme en cadeau.',
  "TEXT":'My mother receives an apple as a gift. | Sa mère reçoit une pomme en cadeau. ',
  "en":(pe,n,mother,apple)=>
  root(V('receive'),
         subj(N(mother).n(n),
              comp(D('my').pe(pe).n(n).g('f')).pos('pre')),
         comp(N(apple),
              det(D('a'))),
         comp(N('gift'),
              mod(P('as')).pos('pre'),
              det(D('a')))),
  "fr":(pe,n,mère,pomme)=>
  root(V('recevoir'),
         subj(N(mère).n(n),
              det(D('son').pe(pe).n(n))),
         comp(N(pomme),
              det(D('un')),
              mod(N('cadeau'),
                  mod(P('en')).pos('pre')))),   
  "params":[pes,numbers,
          [['mère', 'mother'], ['grand-mère', 'grandmother'], ['grand-père', 'grandfather'], ['père', 'father']],
          [['pomme', 'apple'], ['poire', 'pear'], ['ananas', 'pineapple'], ['prune', 'plum']]],
},
{
  "id":4,
  "level":1,
  "text":'This father is very old and wise. | Ce père est très vieux et sage.',
  "TEXT":'This father is very old and wise. | Ce père est très vieux et sage. ',
  "en":(pe,n)=>
  root(V('be'),
         subj(N('father').n(n),
              det(D('this'))),
         mod(Adv('very')),
         root(A('old')).pos('post'),
         mod(A('wise'),
             mod(C('and')).pos('pre'))),
  "fr":(pe,n)=>
  root(V('être'),
         subj(N('père').n(n),
              det(D('ce'))),
         mod(Adv('très')),
         root(A('vieux')).pos('post'),
         mod(A('sage'),
             mod(C('et')).pos('pre'))),   
  "params":[pes,numbers],
},
{
  "id":5,
  "level":1,
  "text":'I eat the good soup. | Je mange la bonne soupe.',
  "TEXT":'I eat the good soup. | Je mange la bonne soupe. ',
  "en":(pe,n, eat)=>
  root(V('eat'),
         subj(Pro('me').c('nom').n(n).pe(pe)),
         comp(N('soup'),
              det(D('the')),
              mod(A('good')).pos('pre'))),
  "fr":(pe,n,mange)=>
  root(V(mange),
         subj(Pro('moi').c('nom').n(n).pe(pe)),
         comp(N('soupe'),
              det(D('le')),
              mod(A('bon')).pos('pre'))),   
  "params":[pes,numbers,
          [['manger', ' eat'], ['boire', 'drink']]],
},
{
  "id":6,
  "level":2,
  "text":'My baby sometimes cries when I leave the house. | Mon bébé pleure quelques fois lorsque je quitte la maison.',
  "TEXT":'My baby sometimes cries when I leave the house. | Son bébé pleure quelque fois lorsque je quitte la maison. ',
  "en":(pe,n, baby, cries)=>
  root(V('cry'),
         subj(N('baby').n(n),
              comp(D('my').pe(pe).n(n).g('f')).pos('pre')),
         mod(Adv('sometimes')).pos('pre'),
         mod(V('leave'),
             mod(C('when')).pos('pre'),
             subj(Pro('me').c('nom').n(n).pe(pe)),
             comp(N('house'),
                  det(D('the'))))),
  "fr":(pe,n,bébé,pleure)=>
  root(V(pleure),
         subj(N(bébé).n(n),
              det(D('son').pe(pe).n(n))),
         comp(N('fois'),
              det(D('quelque'))),
         mod(V('quitter'),
             mod(C('lorsque')).pos('pre'),
             subj(Pro('moi').c('nom').n(n).pe(pe)),
             comp(N('maison'),
                  det(D('le'))))),   
  "params":[pes,numbers,
          [['bébé', ' baby'], ['enfant', ' child'], ['garçon', ' boy'], ['fille', ' girl']],
          [['pleurer', ' cries'], ['chanter', ' single']]],
},];
