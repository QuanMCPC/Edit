const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { menu } = require("./menu");
const isWindows = process.platform === "win32";
const DZip = require("decompress-zip");
const ProgressBar = require('electron-progressbar');
const del = require("del")
var updateFinished = false, global_data_, updateOnStartup = true
app.whenReady().then(() => {
    if ((fs.existsSync(path.normalize(process.execPath + "/.." + "/continue-update.edit_file")))) {
        fs.readFile(path.normalize(process.execPath + "/.." + "/continue-update.edit_file"), {encoding: "utf-8"}, (_err, data) => {
            del(path.normalize(process.execPath + "/.." + `/../edit-${process.platform}-${data}`).replace(/\\/g, "/"), {  }).then(() => {
                //fs.rmdirSync(path.normalize(process.execPath + "/.." + `/../edit-${process.platform}-${data}`), { recursive: true })
                fs.unlinkSync(path.normalize(process.execPath + "/../continue-update.edit_file"))
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
    //console.log(value)
    if (app.commandLine.hasSwitch("file") || app.commandLine.hasSwitch("f")) {
        if (app.commandLine.hasSwitch("version") || app.commandLine.hasSwitch("v")) {
            console.log("Warning: --version or --v is not allow with other switches")
        } else if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
            console.log("Warning: --help or --h is not allowed with other switches")
        } else {
            require("fs").readFile((app.commandLine.getSwitchValue("file") ? app.commandLine.getSwitchValue("file") : app.commandLine.getSwitchValue("f")), {encoding: "utf-8"} ,(error, data) => {
                //console.log(data)
                if (error) {
                    console.log(`Warning: Cannot find file ${value[1]} to load, edit will continue loading with no file loaded.\nDetail are in below:\n${error}`)
                } else {
                    myWindow.webContents.executeJavaScript(`
                        document.getElementById("editor_input").value = "${data}"
                        cachedText = document.getElementById("editor_input").value
                        document.getElementById("_file_name").innerHTML = "${path.resolve(path.normalize((app.commandLine.getSwitchValue("file") ? app.commandLine.getSwitchValue("file") : app.commandLine.getSwitchValue("f")))).replace(/\\/g, "\\\\")}"
                        document.getElementById("current_state").innerHTML = "";
                    `)
                }
            })
        }
    }
    if (app.commandLine.hasSwitch("no-update-on-startup") || app.commandLine.hasSwitch("n")) {
        if (app.commandLine.hasSwitch("version") || app.commandLine.hasSwitch("v")) {
            console.log("Warning: --version or --v is not allow with other switches")
        } else if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
            console.log("Warning: --help or --h is not allowed with other switches")
        } else {
            updateOnStartup = false
            myWindow.show()
            myWindow.setAlwaysOnTop(false)
        }
    }
    if (app.commandLine.hasSwitch("unresizable") || app.commandLine.hasSwitch("u")) {
        if (app.commandLine.hasSwitch("version") || app.commandLine.hasSwitch("v")) {
            console.log("Warning: --version or --v is not allow with other switches")
        } else if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
            console.log("Warning: --help or --h is not allowed with other switches")
        } else { myWindow.setResizable(false) }
    }
    if (app.commandLine.hasSwitch("size") || app.commandLine.hasSwitch("s")) {
        if (app.commandLine.hasSwitch("version") || app.commandLine.hasSwitch("v")) {
            console.log("Warning: --version or --v is not allow with other switches")
        } else if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
            console.log("Warning: --help or --h is not allowed with other switches")
        } else {
            var width = (app.commandLine.getSwitchValue("size") ? app.commandLine.getSwitchValue("size") : app.commandLine.getSwitchValue("s")).split(",")[0]
            var height = (app.commandLine.getSwitchValue("size") ? app.commandLine.getSwitchValue("size") : app.commandLine.getSwitchValue("s")).split(",")[1]
            console.log(width, height, typeof width, typeof height)
            if (isNaN(Number(width)) || isNaN(Number(height))) {
                console.log("Warning: Width or height is not a number, edit will continue loading at the default size")
            } else {
                if (Number(width) < myWindow.getMinimumSize()[0]) {
                    myWindow.setMinimumSize(Number(width), myWindow.getMinimumSize()[1])
                }
                if (Number(height) < myWindow.getMinimumSize()[1]) {
                    myWindow.setMinimumSize(myWindow.getMinimumSize()[0], Number(height))
                }
                myWindow.setSize(Number(width), Number(height))
            }
        }
    }
    if (app.commandLine.hasSwitch("version") || app.commandLine.hasSwitch("v")) {
        console.log(`Version: ${app.getVersion()}`);
        process.exit()
    }
    if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
        console.log(`==================================\nedit version ${app.getVersion()} - Help page\n------------------------------\nUsage: edit <switch>\n--file=<directory_of_file> or --f=<directory_of_file>: Load the file into edit\n--no-update-on-startup or --n: Prevent edit from checking update on startup, require user to manually check for update\n--unresizable or --u: Make the edit window unresizable\n--size=<width>,<height> or --s=<width>,<height>: Load edit with the specify width and height.\nIf the width or height is smaller then the minimal width (320) or minimal height (240), the minimal width/height will be set to the width/height you specify\n--version or --v: Display the version of edit\n--help or --h: Display the help page\n==================================`)
        process.exit()
    }
    //myWindow.webContents.executeJavaScript(`console.log("${path.normalize(process.execPath + "/..")}")`)
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
                //console.log('Download is interrupted but can be resumed')
                item.resume()
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    //console.log('Download is paused')
                } else {
                    progressBar.value = Math.floor(item.getReceivedBytes() / item.getTotalBytes() * 100)
                    progressBar.detail = `Received bytes: ${item.getReceivedBytes()} bytes / ${item.getTotalBytes()} bytes`
                    //console.log(`Received bytes: ${item.getReceivedBytes()} / ${item.getTotalBytes()}`)
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
                    //console.log(error)
                })
                unzip.on("extract", (log) => {
                    //console.log("Finish:", log)
                    var os = ( version ? "win32" : "linux" );
                    var versionNumber = "";
                    var data_ = global_data_
                    versionNumber = data_[0].tag_name.replace("v", "");
                    require("fs").unlink(item.getSavePath().replace(/\\/g, "/"), (err) => {
                        if (err) {
                            //myWindow.webContents.executeJavaScript(`console.log("${err}")`)
                        }
                    })
                   // myWindow.webContents.executeJavaScript(`console.log("${app.getAppPath()}", "${path.normalize(process.execPath + "/..")}")`)
                    //myWindow.focus()
                    if (os == "win32") {
                        var path1 = path.normalize(process.execPath + "/.." + `/../edit-${os}-${versionNumber}/edit.exe`)
                        var path2 = path.normalize(process.execPath + "/.." + `/../edit-${os}-${versionNumber}/continue-update.edit_file`)
                        console.log(path1, path2)
                        setTimeout(() => {
                            require("electron").shell.openPath(`${path1}`).then(() => {
                                require("fs").writeFile(`${path2}`, `${require("electron").app.getVersion().split(".").splice(0, 2).join(".")}`, () => { process.exit() })
                            })
                        }, 1000)
                    } else {
                        var path3 = path.normalize(process.execPath + "/.." + `/../edit-${os}-${versionNumber}/edit`)
                        var path4 = path.normalize(process.execPath + "/.." + `/../edit-${os}-${versionNumber}/continue-update.edit_file`)
                        console.log(path3, path4)
                        setTimeout(() => {
                            require("electron").shell.openPath(`${path3}`).then(() => {
                                require("fs").writeFile(`${path4}`, `${require("electron").app.getVersion().split(".").splice(0, 2).join(".")}`, () => { process.exit() })
                            })
                        }, 1000)
                    }
                })
                unzip.on("progress", (fileIndex, fileCount) => {
                    progressBar1.value = ((fileIndex + 1) / fileCount * 100)
                    progressBar1.detail = `Extracted file ${fileIndex + 1} of ${fileCount}`
                    //console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
                })
                unzip.extract({
                    path: path.normalize(process.execPath + "/.." + "/..")
                })
            } else {
                //console.log(`Download failed: ${state}`)
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
        //console.log("Checking for update")
        fetch(`https://api.github.com/repos/QuanMCPC/Edit/releases?no-cache=${Math.round(Math.random() * 1000000)}`)
            .then(data => data.json())
            .then(data_ => {
                global_data_ = data_
                //console.log(data_)
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
                            //console.log(response)
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
                        } else {
                            myWindow.show()
                            myWindow.setAlwaysOnTop(false)
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
                    } else {
                        myWindow.show()
                        myWindow.setAlwaysOnTop(false)
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
    if (updateOnStartup) {
        checkForUpdate(false)
    } else {
        updateOnStartup = true
    }
})