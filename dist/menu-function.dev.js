"use strict";

var _require = require("electron"),
    remote = _require.remote,
    ipcRenderer = _require.ipcRenderer;

function _getCurrentWindow() {
  return remote.getCurrentWindow();
}

function openMenu(x, y) {
  ipcRenderer.send("display-app-menu", {
    x: x,
    y: y
  });
}

function minimizeWindow() {
  var browserWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _getCurrentWindow();

  if (browserWindow.minimizable) {
    browserWindow.minimize();
  }
}

function maximizeWindow() {
  var browserWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _getCurrentWindow();

  if (browserWindow.maximizable) {
    browserWindow.maximize();
  }
}

function unmaximizeWindow() {
  var browserWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _getCurrentWindow();
  browserWindow.unmaximize();
}

function maxUnmaxWindow() {
  var browserWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _getCurrentWindow();

  if (browserWindow.isMaximized()) {
    browserWindow.unmaximize();
  } else {
    browserWindow.maximize();
  }
}

function closeWindow() {
  var browserWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _getCurrentWindow();
  //browserWindow.close();
  browserWindow.webContents.executeJavaScript("\n        if (cachedText == document.getElementById(\"editor_input\").value) {\n            require(\"electron\").remote.getCurrentWindow().close()\n        } else {\n            require(\"electron\").remote.dialog.showMessageBox(null, {\n                type: \"question\",\n                buttons: [\"Save\", \"Don't Save\", \"Cancel\"],\n                defaultId: 0,\n                title: \"edit - Unsaved File\",\n                message: \"You have unsaved file, do you want to save them?\"\n            }).then((response) => {\n                if (response.response == 0) {\n                    require(\"electron\").remote.dialog.showSaveDialog(null, {title: \"Save File\", buttonLabel: \"Save file\", defaultPath: \"default.txt\"}).then((fileName) => {\n                        require(\"fs\").writeFile(fileName.filePath, document.getElementById(\"editor_input\").value, (error) => {\n                            if (error) {\n                                //alert(\"An error ocurred writing the file:\", error.message)\n                            }\n                            cachedText = document.getElementById(\"editor_input\").value\n                        })\n                    }).then(function() {\n                        require(\"electron\").remote.getCurrentWindow().close()\n                    })\n                } else if (response.response == 1) {\n                    require(\"electron\").remote.getCurrentWindow().close()\n                }\n            })\n        }\n    ");
}

function isWindowMaximized() {
  var browserWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _getCurrentWindow();
  return browserWindow.isMaximized();
}

module.exports = {
  getCurrentWindow: _getCurrentWindow,
  openMenu: openMenu,
  minimizeWindow: minimizeWindow,
  maximizeWindow: maximizeWindow,
  unmaximizeWindow: unmaximizeWindow,
  maxUnmaxWindow: maxUnmaxWindow,
  isWindowMaximized: isWindowMaximized,
  closeWindow: closeWindow
};