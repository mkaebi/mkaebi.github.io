/* Phone view of the CV.
   Phone browsers cannot show an inline PDF (Android Chrome downloads it
   instead), so on narrow screens the <object> embed is hidden and the CV is
   drawn page by page onto canvases with PDF.js. PDF.js is only fetched on
   those screens. If anything fails, the download button above is still there. */
(function () {
  "use strict";

  var PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
  var host = document.querySelector(".cv-pages");
  if (!host || !window.matchMedia || !window.matchMedia("(max-width: 600px)").matches) {
    return;
  }

  function loadScript(src, done, fail) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = done;
    s.onerror = fail;
    document.head.appendChild(s);
  }

  function renderPage(pdf, n) {
    return pdf.getPage(n).then(function (page) {
      // Size from the screen, not the host: the content column shrinks to fit
      // its contents on phones, so the empty host can measure only a few
      // hundred pixels and the page would be drawn tiny, then stretched.
      // Draw at twice the screen's physical width so pinch-zoom stays sharp,
      // capped to keep each canvas within mobile memory limits.
      var ratio = window.devicePixelRatio || 1;
      var screenWidth = Math.min(window.innerWidth, window.screen.width || window.innerWidth);
      var target = Math.min(screenWidth * ratio * 2, 2400);
      var viewport = page.getViewport({ scale: target / page.getViewport({ scale: 1 }).width });

      var canvas = document.createElement("canvas");
      canvas.className = "cv-page";
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.setAttribute("aria-label", "CV page " + n);
      host.appendChild(canvas);

      return page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport }).promise;
    });
  }

  loadScript(PDFJS + "pdf.min.js", function () {
    var lib = window.pdfjsLib;
    if (!lib) return;
    lib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js";

    lib.getDocument(host.getAttribute("data-pdf")).promise.then(function (pdf) {
      var chain = Promise.resolve();
      for (var n = 1; n <= pdf.numPages; n++) {
        chain = chain.then(renderPage.bind(null, pdf, n));
      }
      return chain;
    }).catch(function () { /* button above still works */ });
  }, function () { /* button above still works */ });
})();
