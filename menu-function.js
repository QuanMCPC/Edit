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
    browserWindow.close();
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