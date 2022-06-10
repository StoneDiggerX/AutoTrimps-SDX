// ==UserScript==
// @name         AutoTrimps-StoneDigger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate some trimps functions
// @author       StoneDigger
// @match        *trimps.github.io*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// ==/UserScript==
if(!unsafeWindow.settings){
    unsafeWindow.settings = {
        autoBuild:true
    };
}
var autoTrimpSD = (function() {

    // Your code here...
   var ATversion = 'SD v0.0.1',
    atscript = document.getElementById('AutoTrimps-script'),
    basepath = 'https://github.com/StoneDiggerX/AutoTrimps-StoneDigger', //Link to your own Github here if you forked!
    modulepath = 'modules/';
null !== atscript && (basepath = atscript.src.replace(/AutoTrimpsSD\.js$/, ''));

function ATscriptLoad(a, b) {
    null == b && console.log('Wrong Syntax. Script could not be loaded. Try ATscriptLoad(modulepath, \'example.js\'); ');
    var c = document.createElement('script');
    null == a && (a = ''), c.src = basepath + a + b + '.js', c.id = b + '_MODULE', document.head.appendChild(c)
}

function ATscriptUnload(a) {
    var b = document.getElementById(a + "_MODULE");
    b && (document.head.removeChild(b), console.log("Removing " + a + "_MODULE", "other"))
}

//var isSteam = false;

function initializeAutoTrimps() {

    ATmoduleList = ['import-export', 'query'];
    for (var m in ATmoduleList) {
        ATscriptLoad(modulepath, ATmoduleList[m]);
    }
    console.log('AutoTrimps-StoneDigger Loaded!');
}

initializeAutoTrimps();

})();
