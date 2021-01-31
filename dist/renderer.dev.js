"use strict";

var _require = require("electron"),
    remote = _require.remote;

window.addEventListener("DOMContentLoaded", function () {
  //console.log(remote.getCurrentWindow(), remote.getCurrentWindow())
  var a_ = require("node-localstorage").LocalStorage;

  var localStorage_ = new a_("autoRecovery");
  var settings;

  require("electron").ipcRenderer.on("reload_settings_1", function () {
    loadSettings_(true);
  });

  function loadSettings_(asked) {
    require("fs").readFile(require("path").join(__dirname, "settings.json"), {
      encoding: "utf-8"
    }, function (_err, data) {
      settings = JSON.parse(data);

      if (settings.characterLimit > 0) {
        document.getElementById("editor_input").setAttribute("maxlength", settings.characterLimit);
        document.getElementById("letter_count_1").innerHTML = " / ".concat(settings.characterLimit);
      } else {
        document.getElementById("editor_input").removeAttribute("maxlength");
        document.getElementById("letter_count_1").innerHTML = "";
      }

      if (settings.autoRecovery) {
        if (settings.autoRecoveryInterval <= 0) {
          document.getElementById("editor_input").addEventListener("keydown", function () {
            if (cachedText !== document.getElementById("editor_input").value) {
              localStorage_.setItem("autoRecoveryContent", document.getElementById("editor_input").value);
            }
          });
        } else {
          setInterval(function () {
            if (cachedText !== document.getElementById("editor_input").value) {
              localStorage_.setItem("autoRecoveryContent", document.getElementById("editor_input").value); //console.log(localStorage_.getItem("autoRecoveryContent"))
            } else {
              localStorage_.removeItem("autoRecoveryContent");
            }
          }, settings.autoRecoveryInterval * 1000);
        }
      } //console.log(settings.showInfoBar)


      if (settings.showInfoBar) {
        var removeItemAll = function removeItemAll(arr, value) {
          var i = 0;

          while (i < arr.length) {
            if (arr[i] === value) {
              arr.splice(i, 1);
            } else {
              ++i;
            }
          }

          return arr;
        };

        var input_input = function input_input() {
          document.getElementById('letter_count').innerHTML = document.getElementById('editor_input').value.length; //removeItemAll(document.getElementById('editor_input').value.replace("\n", " ").trim().split(' '), "").length

          var start = 0;
          document.getElementById('editor_input').value.split("\n").forEach(function (element) {
            start = start + removeItemAll(element.trim().split(' '), "").length;
          });
          document.getElementById('word_count').innerHTML = start;

          if (cachedText !== document.getElementById("editor_input").value) {
            document.getElementById("current_state").innerHTML = " (Modified)";
          } else {
            document.getElementById("current_state").innerHTML = "";
          }
        };

        var input_keyup = function input_keyup() {
          var textarea = document.getElementById("editor_input");
          var textLines = textarea.value.substr(0, textarea.selectionStart).split("\n");
          var currentLineNumber = textLines.length;
          var currentColumnIndex = textLines[textLines.length - 1].length; //console.log("Current Line Number "+ currentLineNumber+" Current Column Index "+currentColumnIndex );

          document.getElementById("line_count").innerHTML = currentLineNumber;
          document.getElementById("col_count").innerHTML = currentColumnIndex + 1;
        };

        document.getElementById("editor_info").style.display = "block";
        document.getElementById("editor_input").style.height = "calc(100% - 36px)";
        document.getElementById("editor_input").addEventListener("input", function (event) {
          input_input();
        });

        document.getElementById("editor_input").onkeyup = document.getElementById("editor_input").onmouseup = function () {
          input_keyup();
        };

        if (asked) {
          input_input();
          input_keyup();
        }
      } else {
        document.getElementById("editor_info").style.display = "none";
        document.getElementById("editor_input").style.height = "calc(100% - 12px)";
      }
    });
  }

  loadSettings_(false);
  var menuButton = document.getElementById("menu-btn");
  var minimizeButton = document.getElementById("minimize-btn");
  var maxUnmaxButton = document.getElementById("max-unmax-btn");
  var closeButton = document.getElementById("close-btn");
  var title = document.getElementById("title");

  window.onresize = function () {
    window.innerWidth < 310 ? title.style.display = "none" : title.style.display = "block";
  };

  menuButton.addEventListener("mousedown", function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.openMenu(e.x, e.y);
  });
  minimizeButton.addEventListener("click", function (e) {
    window.minimizeWindow();
  });
  maxUnmaxButton.addEventListener("click", function (e) {
    window.maxUnmaxWindow(); //console.log("D")
  });
  remote.getCurrentWindow().on("maximize", function () {
    document.getElementById("max-unmax-btn").firstElementChild.innerHTML = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\"><path d=\"M3 5v9h9V5H3zm8 8H4V6h7v7z\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5 5h1V4h7v7h-1v1h2V3H5v2z\"/></svg>";
  });
  remote.getCurrentWindow().on("unmaximize", function () {
    document.getElementById("max-unmax-btn").firstElementChild.innerHTML = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\"><path d=\"M3 3v10h10V3H3zm9 9H4V4h8v8z\"/></svg>";
  });
  closeButton.addEventListener("click", function (e) {
    window.closeWindow();
  });
});