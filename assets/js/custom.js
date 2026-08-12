/* Small enhancements for the editorial theme layer.
   Everything here is progressive: with JS off the page still works. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Expand every <details> before printing, restore afterwards.
     A collapsed <details> cannot be opened from CSS, so print styles
     alone would silently drop all the abstracts from a printed page.
     ------------------------------------------------------------------ */
  var forced = [];

  function expandForPrint() {
    forced = [];
    var list = document.querySelectorAll("details:not([open])");
    for (var i = 0; i < list.length; i++) {
      forced.push(list[i]);
      list[i].open = true;
    }
  }

  function restoreAfterPrint() {
    for (var i = 0; i < forced.length; i++) {
      forced[i].open = false;
    }
    forced = [];
  }

  if (window.matchMedia) {
    var mql = window.matchMedia("print");
    var handler = function (e) {
      if (e.matches) {
        expandForPrint();
      } else {
        restoreAfterPrint();
      }
    };
    if (mql.addEventListener) {
      mql.addEventListener("change", handler);
    } else if (mql.addListener) {
      mql.addListener(handler);
    }
  }

  window.addEventListener("beforeprint", expandForPrint);
  window.addEventListener("afterprint", restoreAfterPrint);

  /* ------------------------------------------------------------------
     Deep-linking: /research/#covariance-implied-risk-factors opens and
     scrolls to that paper's abstract.
     ------------------------------------------------------------------ */
  function openFromHash() {
    if (!window.location.hash) return;
    var target;
    try {
      target = document.querySelector(window.location.hash);
    } catch (err) {
      return; /* malformed selector in the hash */
    }
    if (!target) return;

    var details = target.querySelector
      ? target.querySelector("details")
      : null;
    if (details) details.open = true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", openFromHash);
  } else {
    openFromHash();
  }
  window.addEventListener("hashchange", openFromHash);
})();
