// select elements
var elements = Array.from(document.querySelectorAll('svg .svg'));

// add event listeners
elements.forEach(function (el) {
  el.addEventListener("touchstart", start);
  el.addEventListener("mousedown", start);
  el.addEventListener("touchmove", move);
  el.addEventListener("mousemove", move);
})

// event listener functions

function start(e) {
  console.log(e);
  // just an example
}

function move(e) {
  console.log(e);
  // just an example
}

var a = document.getElementById("svg");
a.addEventListener("load", function () {
  var svgDoc = a.contentDocument;
  var els = svgDoc.querySelectorAll(".myclass");
  for (var i = 0, length = els.length; i < length; i++) {
    els[i].addEventListener("click",
      function () {
        console.log("clicked");
      }, false);
  }
}, false);