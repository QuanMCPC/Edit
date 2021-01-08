const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { menu } = require("./menu")
const isWindows = process.platform === "win32";
require('update-electron-app')()
app.whenReady().then(() => {
    const myWindow = new BrowserWindow({
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
    myWindow.webContents.executeJavaScript(`var cachedText = ""`)
    myWindow.loadFile("index.html")
    ipcMain.on(`display-app-menu`, function(e, args) {
        if (isWindows && myWindow) {
            menu.popup({
                window: myWindow,
                x: args.x,
                y: args.y
            });
        }
    });
})