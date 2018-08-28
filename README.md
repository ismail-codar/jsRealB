# jsRealB - A JavaScript bilingual text realizer for web development

**Natural language generation**, a part of artificial intelligence, studies the development of systems that produce text for different applications, for example the textual description of massive datasets or the automation of routine text creation.

The web is constantly growing and its contents, getting progressively more dynamic, us well-suited to automation by a realizer. However, existing realizers are not designed with the web in mind and their operation requires much knowledge, complicating their use.

**jsRealB is a text realizer designed specifically for the web**, easy to learn and to use. This realizer allows its user to build a variety of French and English expressions and sentences, to add HTML tags to them and to easily integrate them into web pages.

**jsRealB can also be used in Javascript application** by means of a `node.js` module.

Most of the documentation is in French and can be accessed [here](documentation/user.html).

However, there are a number of resources written in English available [on our website](http://rali.iro.umontreal.ca/rali/?q=en/jsrealb-bilingual-text-realiser), including
live demos.

**Caution**

* Although `jsRealB` can be used in a web page using only one of the generated javascript files in the [`dist`](dist/) directory, [`node.js`](https://nodejs.org/en/) is necessary for the Javascript applications and for minifying the javascript using the `uglifyjs`.
* The current build process rely on the availability of some unix tools such as `makefile`, `cat` and output redirection 

## Directories
* ``build``: build system to create the JavaScript library
* ``dist``: pre-built JavaScript files ready for use.
* ``documentation``: new version of the documentation (up to date and in both English and French). The examples are generated on the fly by embedding jsRealB in the page.
    * ``style-new.css``: style sheet
    * ``user-infos.js``: definitions of variables containing the examples
    * ``user-new.html``: HTML of the core of the page (div[id] correspond to variables in user-infos.js)
    * ``user-new.js``  : JavaScript helper script.
* ``IDE`` : An Integrated Development Environment that embeds jsRealB. [Try it here](https://rawgit.com/rali-udem/JSrealB/master/IDE/IDE.html). It is slightly modified from previous versions to take into account the new way of loading lexicons.

##Documentation
In both English and French for their respective language: the examples are generated on the fly by embedding jsRealB in the page. It uses the following files in the `documentation` directory:

* `style.css`: style sheet
* `user-infos.js`: definitions of variables containing the examples
* `user.html`: HTML of the core of the page (each `div[id]` corresponds to a variable in `user-infos.js`)
* `user.js`  : Javascript

## Demos

* [Random English text generation](https://rawgit.com/rali-udem/JSrealB/master/demos/randomGeneration/english.html) [[JavaScript code](demos/randomGeneration/english.js)]
* [Random French text generation](https://rawgit.com/rali-udem/JSrealB/master/demos/randomGeneration/french.html) [[JavaScript code](demos/randomGeneration/french.js)]
* [Conjugation and declension](https://rawgit.com/rali-udem/JSrealB/master/demos/inflection/index.html) [[JavaScript code](demos/inflection/inflection.js)] 
* [99 bottles of beer: a repetitive text in English](https://rawgit.com/rali-udem/JSrealB/master/demos/99BottlesOfBeer/index.html)
* [1 km à pied: a repetitive text in French](https://rawgit.com/rali-udem/JSrealB/master/demos/kilometresAPied/index.html)
* [Date generation](https://rawgit.com/rali-udem/JSrealB/master/demos/date/index.html)
* [Elision: tests for the French elision module](https://rawgit.com/rali-udem/JSrealB/master/demos/elision/index.html)
* [Exercises in style à la Raymond Queneau](http://rawgit.com/rali-udem/JSrealB/master/demos/exercicesDeStyle/index.html) [[JavaScript code](demos/ExercicesDeStyle/exercicesDeStyle.js)] [[The Exercises on Wikipedia](https://en.wikipedia.org/wiki/Exercises_in_Style)]

## IDE

[An IDE](https://rawgit.com/rali-udem/JSrealB/master/IDE.html) Development Environment that embeds jsRealB and also rapid testing of expressions and retrieving information from the lexicons. 

## Credits
jsRealB was updated, developed and brought to its current version by [Guy Lapalme](http://www.iro.umontreal.ca/~lapalme) building on the works of:   

1. [Francis Gauthier](http://www-etud.iro.umontreal.ca/~gauthif) as part of his summer internship at RALI in 2016; 
2. [Paul Molins](http://paul-molins.fr/) as part of an internship from INSA Lyon spent at RALI, University of Montreal in 2015;   
3. [Nicolas Daoust](mailto:n@daou.st) built the JSreal realizer (French only).

For more information, contact [Guy Lapalme](http://rali.iro.umontreal.ca/lapalme).      
