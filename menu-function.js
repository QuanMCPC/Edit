const { remote, ipcRenderer } = require("electron");
function _getCurrentWindow() {
    return remote.getCurrentWindow();
}
function openMenu(x, y) {
    ipcRenderer.send(`display-app-menu`, { x, y });
}
function minimizeWindow(browserWindow = _getCurrentWindow()) {
    if (browserWindow.minimizable) {
        browserWindow.minimize();
    }
}
function maximizeWindow(browserWindow = _getCurrentWindow()) {
    if (browserWindow.maximizable) {
        browserWindow.maximize();
    }
}
function unmaximizeWindow(browserWindow = _getCurrentWindow()) {
    browserWindow.unmaximize();
}
function maxUnmaxWindow(browserWindow = _getCurrentWindow()) {
    if (browserWindow.isMaximized()) {
        browserWindow.unmaximize();
    } else {
        browserWindow.maximize();
    }
}
function closeWindow(browserWindow = _getCurrentWindow()) {
    //browserWindow.close();
    browserWindow.webContents.executeJavaScript(`
        if (cachedText == document.getElementById("editor_input").value) {
            require("electron").remote.getCurrentWindow().close()
        } else {
            require("electron").remote.dialog.showMessageBox(null, {
                type: "question",
                buttons: ["Save", "Don't Save", "Cancel"],
                defaultId: 0,
                title: "edit - Unsaved File",
                message: "You have unsaved file, do you want to save them?"
            }).then((response) => {
                if (response.response == 0) {
                    require("electron").remote.dialog.showSaveDialog(null, {title: "Save File", buttonLabel: "Save file", defaultPath: "default.txt"}).then((fileName) => {
                        require("fs").writeFile(fileName.filePath, document.getElementById("editor_input").value, (error) => {
                            if (error) {
                                //alert("An error ocurred writing the file:", error.message)
                            }
                            cachedText = document.getElementById("editor_input").value
                        })
                    }).then(function() {
                        require("electron").remote.getCurrentWindow().close()
                    })
                } else if (response.response == 1) {
                    require("electron").remote.getCurrentWindow().close()
                }
            })
        }
    `)
}
function isWindowMaximized(browserWindow = _getCurrentWindow()) {
    return browserWindow.isMaximized();
}
module.exports = {
    getCurrentWindow: _getCurrentWindow,
    openMenu,
    minimizeWindow,
    maximizeWindow,
    unmaximizeWindow,
    maxUnmaxWindow,
    isWindowMaximized,
    closeWindow
};