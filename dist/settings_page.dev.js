"use strict";

window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("close-btn").addEventListener("click", function () {
    window.close_settings();
  });
});
var settings;

require("fs").readFile(require("path").join(__dirname, "settings.json"), {
  encoding: "utf-8"
}, function (_err, data) {
  settings = JSON.parse(data);
  document.getElementById("width").value = settings.width;
  document.getElementById("height").value = settings.height;
  document.getElementById("minWidth").value = settings.minWidth;
  document.getElementById("minHeight").value = settings.minHeight;
  document.getElementById("noUpdateOnStartup").checked = settings.noUpdateOnStartup;
  document.getElementById("unresizable").checked = settings.unResizable;
  document.getElementById("backgroundTextColor").value = settings.backgroundTextColor;
  document.getElementById("textColor").value = settings.textColor;
  document.getElementById("autoRecovery").checked = settings.autoRecovery;
  document.getElementById("autoRecoveryInterval").value = settings.autoRecoveryInterval;
  document.getElementById("showInfoBar").checked = settings.showInfoBar;
  document.getElementById("characterLimit").value = settings.characterLimit;
  document.getElementById("allowBetaUpdate").checked = settings.allowBetaUpdate;
  document.getElementById("apply").addEventListener("click", function () {
    settings.minWidth = Number(document.getElementById("minWidth").value);
    settings.minHeight = Number(document.getElementById("minHeight").value);

    if (settings.minWidth > document.getElementById("width").value) {
      settings.width = settings.minWidth;
      document.getElementById("width").value = settings.minWidth;
    } else {
      settings.width = Number(document.getElementById("width").value);
    }

    if (settings.minHeight > document.getElementById("height").value) {
      settings.height = settings.minHeight;
      document.getElementById("height").value = settings.minHeight;
    } else {
      settings.height = Number(document.getElementById("height").value);
    }

    settings.noUpdateOnStartup = document.getElementById("noUpdateOnStartup").checked;
    settings.unResizable = document.getElementById("unresizable").checked;
    settings.backgroundTextColor = document.getElementById("backgroundTextColor").value;
    settings.textColor = document.getElementById("textColor").value;
    settings.autoRecovery = document.getElementById("autoRecovery").checked;
    settings.autoRecoveryInterval = Number(document.getElementById("autoRecoveryInterval").value);
    settings.showInfoBar = document.getElementById("showInfoBar").checked;
    settings.characterLimit = document.getElementById("characterLimit").value;
    settings.allowBetaUpdate = document.getElementById("allowBetaUpdate").checked; //console.log(JSON.stringify(settings))

    require("fs").writeFile(require("path").join(__dirname, "settings.json"), JSON.stringify(settings), function () {
      require("electron").ipcRenderer.send("reload_settings");

      document.getElementById("saved").innerHTML = "Settings has been saved!";
      var t = setTimeout(function () {
        document.getElementById("saved").innerHTML = "";
      }, 15000);

      document.body.onclick = function () {
        document.getElementById("saved").innerHTML = "";
        clearTimeout(t);
      };
    });
  });
  document.getElementById("reset").addEventListener("click", function () {
    require("fs").writeFile(require("path").join(__dirname, "settings.json"), "{\"backgroundTextColor\":\"#000000\",\"textColor\":\"#ffffff\",\"width\":800,\"height\":600,\"minWidth\":360,\"minHeight\":240,\"noUpdateOnStartup\":false,\"unResizable\":false,\"characterLimit\":\"0\",\"autoRecovery\":false,\"autoRecoveryInterval\":0,\"showInfoBar\":false,\"allowBetaUpdate\":false}", function () {
      document.getElementById("width").value = 800;
      document.getElementById("height").value = 600;
      document.getElementById("minWidth").value = 360;
      document.getElementById("minHeight").value = 240;
      document.getElementById("noUpdateOnStartup").checked = false;
      document.getElementById("unresizable").checked = false;
      document.getElementById("backgroundTextColor").value = "#000000";
      document.getElementById("textColor").value = "#ffffff";
      document.getElementById("autoRecovery").checked = false;
      document.getElementById("autoRecoveryInterval").value = 0;
      document.getElementById("showInfoBar").checked = false;
      document.getElementById("characterLimit").value = 0;
      document.getElementById("allowBetaUpdate").checked = false;

      require("electron").ipcRenderer.send("reload_settings");

      document.getElementById("saved").innerHTML = "Settings has been reset!";
      var t = setTimeout(function () {
        document.getElementById("saved").innerHTML = "";
      }, 15000);

      document.body.onclick = function () {
        document.getElementById("saved").innerHTML = "";
        clearTimeout(t);
      };
    });
  });
});