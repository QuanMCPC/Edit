"use strict";

var _require = require("electron"),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow,
    ipcMain = _require.ipcMain;

var path = require("path");

var _require2 = require("./menu"),
    menu = _require2.menu;

var isWindows = process.platform === "win32";
app.whenReady().then(function () {
  var myWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true,
      nativeWindowOpen: true
    },
    frame: isWindows ? false : true,
    minWidth: 320,
    minHeight: 240,
    icon: "./icon.ico"
  });
  myWindow.webContents.executeJavaScript("var cachedText = \"\"");
  myWindow.loadFile("index.html");
  ipcMain.on("display-app-menu", function (e, args) {
    if (isWindows && myWindow) {
      menu.popup({
        window: myWindow,
        x: args.x,
        y: args.y
      });
    }
  });
});