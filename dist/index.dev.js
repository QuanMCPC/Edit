"use strict";

var _require = require("electron"),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow,
    ipcMain = _require.ipcMain;

var _require2 = require("electron-updater"),
    autoUpdater = _require2.autoUpdater;

var path = require("path");

var _require3 = require("./menu"),
    menu = _require3.menu;

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
    icon: "./icon.png"
  });
  myWindow.webContents.executeJavaScript("var cachedText = \"\"");
  myWindow.once("ready-to-show", function () {
    autoUpdater.checkForUpdatesAndNotify();
  });
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
  ipcMain.on('app_version', function (event) {
    event.sender.send('app_version', {
      version: app.getVersion()
    });
  });
  autoUpdater.on('update-available', function () {
    myWindow.webContents.send('update_available');
  });
  autoUpdater.on('update-downloaded', function () {
    myWindow.webContents.send('update_downloaded');
  });
  ipcMain.on('restart_app', function () {
    autoUpdater.quitAndInstall();
  });
});