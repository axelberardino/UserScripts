// ==UserScript==
// @name        GitHub link to file
// @version     1.0.0
// @description A userscript that replace click on line number in diff view by a link to the complete file.
// @author      Axel Berardino
// @namespace   https://github.com/axelberardino
// @include     https://github.com/*
// @run-at      document-idle
// @grant       GM_addStyle
// @require     https://greasyfork.org/scripts/28721-mutations/code/mutations.js?version=597950
// @icon        https://assets-cdn.github.com/pinned-octocat.svg
// @updateURL   https://github.com/axelberardino/UserScripts/raw/master/github-link-to-file.user.js
// @downloadURL https://github.com/axelberardino/UserScripts/raw/master/github-link-to-file.user.js
// ==/UserScript==
(() => {
    "use strict";

    function processDiff() {
	if (document.querySelector(".highlight")) {
	    let indx = 0,
		els = document.querySelectorAll(`[id^=diff-]`),
		len = els.length;

	    // loop with delay to allow user interaction
	    function loop() {
		let el, txt, firstNode,
		    // max number of DOM insertions per loop
		    max = 0;
		while ( max < 50 && indx < len ) {
		    if (indx >= len) {
			return;
		    }
		    el = els[indx];
                    let lineNb = parseInt(el.getAttribute("data-line-number"), 10);
                    if (!isNaN(lineNb)) {
                        let parent = el.parentNode;
                        while (parent != null && !parent.id.startsWith("diff-")) {
                            parent = parent.parentNode;
                        }
                        if (parent == null) {
                            continue;
                        }
			let link = parent.children[0].children[0].children[1].href;
                        el.onclick = function() {
                            //alert(link + '#L' + lineNb);
			    window.open(link + '#L' + lineNb, "_blank");
			}
		    }
		    max++;
		    indx++;
		}
		if (indx < len) {
		    setTimeout(() => {
			loop();
		    }, 200);
		}
	    }
	    loop();
	}
    }

    // Observe GitHub dynamic content
    document.addEventListener("ghmo:container", init);
    document.addEventListener("ghmo:diff", processDiff);

    function init() {
	if (document.querySelector("#files.diff-view")) {
	    processDiff();
	}
    }

    init();

})();
