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
  browserWindow.close();
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