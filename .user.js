// ==UserScript==
// @name         AutoTrimps-StoneDigger
// @version      1.0
// @namespace    https://github.com/StoneDiggerX/AutoTrimps-StoneDigger
// @updateURL    https://github.com/StoneDiggerX/AutoTrimps-StoneDigger/blob/main/.user.js
// @description  Automate all the trimps!
// @author       StoneDigger
// @include      *trimps.github.io*
// @connect      *github.com/StoneDiggerX/AutoTrimps-StoneDigger*
// @connect      *trimps.github.io*
// @connect      self
// @grant        GM_xmlhttpRequest 
// ==/UserScript==

var script = document.createElement('script');
script.id = 'AutoTrimps-Zek';
//This can be edited to point to your own Github Repository URL.
script.src = 'https://github.com/StoneDiggerX/AutoTrimps-StoneDigger/blob/main/AutoTrimpsSD.js';
//script.setAttribute('crossorigin',"use-credentials");
script.setAttribute('crossorigin',"anonymous");
document.head.appendChild(script);
