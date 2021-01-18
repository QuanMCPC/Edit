const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { menu } = require("./menu")
const isWindows = process.platform === "win32";
const DZip = require("decompress-zip");
const ProgressBar = require('electron-progressbar')
var updateFinished = false, global_data_
app.whenReady().then(() => {
    if ((require("fs").existsSync(path.normalize(process.execPath + "/.." + "continue-update.edit_file")))) {
        require("fs").readFile(path.normalize(process.execPath + "/.." + "continue-update.edit_file"), (_err, data) => {
            require("fs-extra").remove(path.normalize(process.execPath + "/.." + `/../edit-${process.platform}-${data}`)).then(function() {
                require("electron").dialog.showMessageBox(new BrowserWindow({
                    show: false,
                    alwaysOnTop: true
                }), {
                    noLink: true,
                    type: "info",
                    title: "edit - Update finished",
                    message: "The update installed sucessfully!"
                }).then(() => {
                    updateFinished = true
                })
            })
        })
    }
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
        icon: "./icon.ico",
        show: false,
        alwaysOnTop: true
    });
    if (updateFinished) {
        myWindow.setAlwaysOnTop(false)
        myWindow.show()
        updateFinished = false;
    }
    myWindow.webContents.executeJavaScript(`console.log("${path.normalize(process.execPath + "/..")}")`)
    myWindow.webContents.executeJavaScript(`var cachedText = ""`)
    myWindow.loadFile("index.html")
    ipcMain.on(`display-app-menu`, function(_e, args) {
        if (isWindows && myWindow) {
            menu.items[3].submenu.items[3].click = function() {
                checkForUpdate(true)
            }
            menu.popup({
                window: myWindow,
                x: args.x,
                y: args.y
            });
        }
    });
    var version = 0
    const fetch = require("electron-fetch").default
    myWindow.webContents.session.on('will-download', (event, item, webContents) => {
        item.setSavePath(path.normalize(process.execPath + "/.." + "/update.zip"))
        var progressBar = new ProgressBar({
            indeterminate: false,
            text: 'Downloading the latest version of edit...',
            browserWindow: {
                parent: myWindow,
                minimizable: true
            },
            style: {
                bar: {
                    "background-color": "#808080",
                    "color": "#008080"
                }
            }
        });
        item.on('updated', (_event, state) => {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed')
                item.resume()
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused')
                } else {
                    progressBar.value = Math.floor(item.getReceivedBytes() / item.getTotalBytes() * 100)
                    progressBar.detail = `Received bytes: ${item.getReceivedBytes()} bytes / ${item.getTotalBytes()} bytes`
                    console.log(`Received bytes: ${item.getReceivedBytes()} / ${item.getTotalBytes()}`)
                }
            }
        })
        item.once('done', (event, state) => {
            var progressBar1 = new ProgressBar({
                indeterminate: false,
                text: 'Extracting data...',
                browserWindow: {
                    parent: myWindow,
                    minimizable: true
                },
                style: {
                    bar: {
                        "background-color": "#808080",
                        "color": "#008080"
                    },
                },
            });
            if (state === 'completed') {
                var unzip = new DZip(item.getSavePath())
                unzip.on("error", (error) => {
                    console.log(error)
                })
                unzip.on("extract", (log) => {
                    console.log("Finish:", log)
                    var os = ( version ? "win32" : "linux" );
                    var versionNumber = "";
                    var data_ = global_data_
                    versionNumber = data_[0].tag_name.replace("v", "");
                    require("fs").unlink(item.getSavePath().replace(/\\/g, "/"), (err) => {
                        if (err) {
                            myWindow.webContents.executeJavaScript(`console.log("${err}")`)
                        }
                    })
                    myWindow.webContents.executeJavaScript(`console.log("${app.getAppPath()}", "${path.normalize(process.execPath + "/..")}")`)
                    //myWindow.focus()
                    if (os == "win32") {
                        var path1 = path.normalize(process.execPath + "/.." + `/../edit-${os}-${versionNumber}/edit.exe`)
                        var path2 = path.normalize(process.execPath + "/.." + `/../edit-${os}-${versionNumber}/continue-update.edit_file`)
                        console.log(path1, path2)
                        setTimeout(() => {
                            require("electron").shell.openExternal(`${path1}`).then(() => {
                                require("fs").writeFile(`${path2}`, `${require("electron").app.getVersion().split(".").splice(0, 2).join(".")}`, () => { process.exit() })
                            })
                        }, 200)
                    } else {
                        var path3 = path.normalize(process.execPath + "/.." + `/../edit-${os}-${versionNumber}/edit`)
                        var path4 = path.normalize(process.execPath + "/.." + `/../edit-${os}-${versionNumber}/continue-update.edit_file`)
                        console.log(path3, path4)
                        setTimeout(() => {
                            require("electron").shell.openExternal(`${path3}`).then(() => {
                                require("fs").writeFile(`${path4}`, `${require("electron").app.getVersion().split(".").splice(0, 2).join(".")}`, () => { process.exit() })
                            })
                        }, 200)
                    }
                })
                unzip.on("progress", (fileIndex, fileCount) => {
                    progressBar1.value = ((fileIndex + 1) / fileCount * 100)
                    progressBar1.detail = `Extracted file ${fileIndex + 1} of ${fileCount}`
                    console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
                })
                unzip.extract({
                    path: path.normalize(process.execPath + "/.." + "/..")
                })
            } else {
                console.log(`Download failed: ${state}`)
            }
        })
    })
    function checkForUpdate(userAsked) {
        var checkForUpdateProgressBar = new ProgressBar({
            text: "Checking for update",
            detail: "Wait...",
            indeterminate: true,
            browserWindow: {
                parent: myWindow,
                minimizable: true
            },
            style: {
                bar: {
                    "background-color": "#808080",
                    "color": "#008080"
                },
            }
        })
        console.log("Checking for update")
        fetch(`https://api.github.com/repos/QuanMCPC/Edit/releases?no-cache=${Math.round(Math.random() * 1000000)}`)
            .then(data => data.json())
            .then(data_ => {
                global_data_ = data_
                console.log(data_)
                checkForUpdateProgressBar.setCompleted()
                if (!data_[0].prerelease) {
                    if (require("electron").app.getVersion().split(".").splice(0, 2).join(".") !== data_[0].tag_name.replace("v", "")) {
                        require("electron").dialog.showMessageBox(myWindow, {
                            noLink: true,
                            type: "question",
                            buttons: ["Yes", "Later"],
                            defaultId: 0,
                            title: "edit - Update",
                            message: "Update is avaliable! Would you like to install it now?",
                        }).then((response) => {
                            console.log(response)
                            if (response.response == 0) {
                                myWindow.webContents.executeJavaScript(`
                                    if (cachedText == document.getElementById("editor_input").value) {
                                        require('electron').ipcRenderer.send("file_done")
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
                                                        } else {
                                                            cachedText = document.getElementById("editor_input").value
                                                            require('electron').ipcRenderer.send("file_done")
                                                        }
                                                    })
                                                })
                                            } else if (response.response == 1) {
                                                require('electron').ipcRenderer.send("file_done")
                                            } else if (response.response == 2) {}
                                        })
                                    }
                                `)
                                require("electron").ipcMain.on("file_done", () => {
                                    myWindow.hide()
                                    myWindow.setAlwaysOnTop(true)
                                    if (process.platform == "win32") { version = 1 }
                                    if (process.platform == "linux") { version = 0 }
                                    myWindow.webContents.downloadURL(data_[0].assets[version].browser_download_url)
                                })
                            } else if (response.response == 1) {
                                myWindow.show()
                                myWindow.setAlwaysOnTop(false)
                            }
                        })
                    } else {
                        myWindow.show()
                        myWindow.setAlwaysOnTop(false)
                        if (userAsked) {
                            require("electron").dialog.showMessageBox(null, {
                                type: "info",
                                message: "There is currently no update avaliable",
                                title: "edit - Update"
                            })
                        }
                    }
                } else {
                    myWindow.show()
                    myWindow.setAlwaysOnTop(false)
                    if (userAsked) {
                        require("electron").dialog.showMessageBox(null, {
                            type: "info",
                            message: "There is currently no update avaliable",
                            title: "edit - Update"
                        })
                    }
                }
                /*if (process.platform == "win32") { version = 1 }
                if (process.platform == "linux") { version = 0 }
                myWindow.webContents.downloadURL(data_[0].assets[version].browser_download_url)*/ //-- For testing only
            })
            .catch((err) => {
                checkForUpdateProgressBar.setCompleted()
                require("electron").dialog.showMessageBox(myWindow, {
                    title: "edit - Unable to check for update",
                    message: `edit was unable to check for update, detail:\n${err}`,
                    buttons: [
                        "Try again",
                        "Cancel"
                    ],
                    noLink: true
                }).then(response => {
                    if (response.response == 0) {
                        checkForUpdate(false)
                    } else {
                        myWindow.show()
                        myWindow.setAlwaysOnTop(false)
                    }
                })
            })
    }
    checkForUpdate(false)
})