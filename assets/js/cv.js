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
      var ratio = window.devicePixelRatio || 1;
      var width = host.clientWidth;
      var scale = width / page.getViewport({ scale: 1 }).width;
      var viewport = page.getViewport({ scale: scale * ratio });

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
