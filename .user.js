// ==UserScript==
// @name         AutoTrimps-StoneDigger
// @version      0.1
// @description  Automate some trimps functions
// @author       StoneDigger
// @match        *trimps.github.io*
// @connect      *raw.githubusercontent.com/StoneDiggerX/AutoTrimps-StoneDigger*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// ==/UserScript==


(function() {
    var mainPath = "https://raw.githubusercontent.com/StoneDiggerX/AutoTrimps-StoneDigger/main/";
    var modulesPath = mainPath + "modules/";
    var modules = ["module.js", "main.js"];

    var loadExternalScript = function(url){
        GM_xmlhttpRequest({
            method : "GET",
            // from other domain than the @match one (.org / .com
            url : url,
            onload : (ev) =>
            {
                let e = document.createElement('script');
                e.innerText = ev.responseText;
                document.head.appendChild(e);
            }
        });
    };

    // load modules
    scripts.map(script => modulesPath + modules).forEach(loadExternalScript);
    // load main as last module!
    loadExternalScript(mainPath + "main.js");
})();   