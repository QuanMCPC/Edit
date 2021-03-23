const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { menu } = require("./menu");
const isWindows = process.platform === "win32";
const DZip = require("decompress-zip");
const ProgressBar = require('electron-progressbar');
const del = require("del");
const contextMenu = require('electron-context-menu');
const DecompressZip = require("decompress-zip");
var updateFinished = false, global_data_, updateOnStartup = true
app.whenReady().then(() => {
    var a_ = require("node-localstorage").LocalStorage;
    var localStorage_ = new a_("autoRecovery")
    var settings;
    require("fs").readFile(require("path").join(__dirname, "settings.json"), { encoding: "utf-8" }, (_error, data) => {
        settings = JSON.parse(data)
        //console.log(settings)
        update_Phrase_2()
    })
    function update_Phrase_2() {
        if (fs.existsSync(path.normalize(process.execPath + "/../../../update-info-82163921.json"))) {
            console.log("If you can see this message, please change the directory to somewhere else if the current one is in the old version's folder")
            fs.readFile(path.normalize(process.execPath + "/../../../update-info-82163921.json"), {encoding: "utf-8"}, (err, data) => {
                var data_ = JSON.parse(data)
                if (data_.stage == 1) {
                    //Stage 1: new version
                    //Goal: Rename the old version to a random name / Run old version
                    //Old version directory: C:\edit\ -> C:\edit-0192837465
                    //Rename to: C:\edit-123\
                    //New version (Current): C:\edit-update-12312\edit\edit.exe
                    var count1 = 0
                    function repeat1() {
                        fs.rename(path.normalize(process.execPath + "/../../../edit/"), path.normalize(process.execPath + "/../../../edit-0192837465/"), (err) => {
                            if (!err) {
                                data_.stage = 2
                                fs.writeFile(path.normalize(process.execPath + "/../../../update-info-82163921.json"), JSON.stringify(data_), () => {
                                    if (process.platform === "win32") {
                                        count1 = 0
                                        require("electron").shell.openPath(path.normalize(process.execPath + "/../../../" + `edit-0192837465/edit.exe`)).then(() => { process.exit() })
                                    } else {
                                        count1 = 0
                                        require("electron").shell.openPath(path.normalize(process.execPath + "/../../../" + `edit-0192837465/edit`)).then(() => { process.exit() })
                                    }
                                })
                            } else if (count1 <= 30) { setTimeout(() => { repeat1(); ++count1; }, 1000) } else {
                                require("electron").dialog.showMessageBox(null, {
                                    title: "edit - Problem while updating",
                                    message: `A problem occurred that make edit unable to complete the update.\nDetail: Unable to rename folder: ${path.normalize(process.execPath + "/../../../edit/")} to ${path.normalize(process.execPath + "/../../../edit-0192837465/")}.\nMore detail: ${err}\nBecause this can sometimes happened during update, click "Try again", or try and close program that can be locking the file/folder`,
                                    buttons: ["Try again"],
                                    noLink: true
                                }).then(response => { if (response.response == 0) { count1 = 0; repeat1() } })
                            }
                        })
                    }
                    repeat1()
                }
            })
        } else if (fs.existsSync(path.normalize(process.execPath + "/../../update-info-82163921.json"))) {
            console.log("If you can see this message, please change the directory to somewhere else if the current one is in the old version's folder")
            fs.readFile(path.normalize(process.execPath + "/../../update-info-82163921.json"), {encoding: "utf-8"}, (err, data) => {
                var data_ = JSON.parse(data)
                if (data_.stage == 2) {
                    //Stage 2: Old version
                    //Goal: Move the new folder to the parent directory / Rename the new folder to edit
                    //Current directory: C:\edit-0192837465\edit.exe
                    //New version: C:\edit-update-12312\edit\edit.exe -> C:\edit\edit.exe
                    var count2 = 0
                    function repeat2() {
                        require("fs-extra").move(path.normalize(process.execPath + `/../../edit-update-${data_.updateId}/edit/`), path.normalize(process.execPath + "/../../edit/"), err => {
                            if (!err) {
                                data_.stage = 3
                                fs.writeFile(path.normalize(process.execPath + "/../../update-info-82163921.json"), JSON.stringify(data_), () => {
                                    if (process.platform === "win32") {
                                        require("electron").shell.openPath(path.normalize(process.execPath + "/../../edit/edit.exe")).then(() => { process.exit() })
                                    } else {
                                        require("electron").shell.openPath(path.normalize(process.execPath + "/../../edit/edit.exe")).then(() => { process.exit() })
                                    }
                                })
                            } else if (count2 <= 30) { setTimeout(() => { repeat2(); ++count2; }, 1000) } else {
                                require("electron").dialog.showMessageBox(null, {
                                    title: "edit - Problem while updating",
                                    message: `A problem occurred that make edit unable to complete the update.\nDetail: Unable to move folder: ${path.normalize(process.execPath + "/../../" + `edit-update-${data_.updateId}/edit`)} to ${path.normalize(process.execPath + "/../../")}.\nMore detail: ${err}\nBecause this can sometimes happened during update, click "Try again", or try and close program that can be locking the file/folder`,
                                    buttons: ["Try again"],
                                    noLink: true
                                }).then(response => { if (response.response == 0) { count2 = 0; repeat2() } })
                            }
                        })
                    }
                    repeat2()
                } else if (data_.stage == 3) {
                    //Stage 3: New version
                    //Goal: Delete the old version, Move the settings from the old version to the new version
                    //Current directory: C:\edit\edit.exe
                    //Old version: C:\edit-0192837465\edit.exe
                    var count3 = 0
                    function repeat3() {
                        require("fs-extra").move(process.execPath + "/../../edit-0192837465/resources/app/settings.json", process.execPath + "/../resources/app/settings.json", { overwrite: true }).then(() => {
                            del([path.normalize(process.execPath + "/../../edit-0192837465"), path.normalize(process.execPath + `/../../update-${data_.updateId}.zip`), path.normalize(process.execPath + `/../../edit-update-${data_.updateId}`), path.normalize(process.execPath + "/../../update-info-82163921.json")], { force: true }).then(() => {
                                count3 = 0
                                require("electron").dialog.showMessageBox(null, {
                                    noLink: true,
                                    type: "info",
                                    title: "edit - Update finished",
                                    message: "The update installed sucessfully!"
                                }).then(() => {
                                    updateFinished = true
                                    require("fs").readFile(require("path").join(__dirname, "settings.json"), { encoding: "utf-8" }, (_error, data) => { settings = JSON.parse(data); main(); })
                                })
                            }).catch(err => {
                                if (count3 <= 30) {
                                    setTimeout(() => { repeat3(); ++count3; }, 1000)
                                } else {
                                    require("electron").dialog.showMessageBox(null, {
                                        title: "edit - Problem while updating",
                                        message: `A problem occurred that make edit unable to complete the update.\nDetail: Unable to remove folder: ${path.normalize(process.execPath + "/../../edit-0192837465")}.\nMore detail: ${err}\nBecause this can sometimes happened during update, click "Try again", or try and close program that can be locking the file/folder`,
                                        buttons: ["Try again"],
                                        noLink: true
                                    }).then(response => { if (response.response == 0) { count3 = 0; repeat3() } })
                                }
                            })
                        })
                    }
                    repeat3()
                }
                // del(path.normalize(process.execPath + "/.." + `/../edit/`).replace(/\\/g, "/"), { force: true }).then(() => {
                //     //fs.rmdirSync(path.normalize(process.execPath + "/.." + `/../edit-${process.platform}-${data}`), { recursive: true })
                //     del(path.normalize(process.execPath + "/../update-info.json").replace(/\\/g, "/")).then(() => {
                //         //fs.unlinkSync(path.normalize(process.execPath + "/../update-info.json"))
                //         require("electron").dialog.showMessageBox(null, {
                //             noLink: true,
                //             type: "info",
                //             title: "edit - Update finished",
                //             message: "The update installed sucessfully!"
                //         }).then(() => {
                //             updateFinished = true
                //             main()
                //         })
                //     })
                // }).catch((err) => {
                //     require("electron").dialog.showMessageBox(null, {
                //         noLink: true,
                //         type: "info",
                //         title: "edit - Update paused",
                //         message: "edit was unable to complete the update.\n Details are in below\n" + err,
                //         buttons: ["Try again", "Cancel"]
                //     }).then(response => {
                //         if (response.response == 0) {
                //             update_Phrase_2();
                //         } else {
                //             require("electron").dialog.showMessageBox(null, {
                //                 noLink: true,
                //                 type: "info",
                //                 title: "edit - Update canceled",
                //                 message: "You have canceled update, edit will now always try to complete the update on every startup"
                //             }).then(() => {
                //                 updateFinished = true;
                //                 main()
                //             })
                //         }
                //     })
                // })
            })
        } else {
            main()
        }
    }
    function main() {
        const myWindow = new BrowserWindow({
            width: 0,
            height: 0,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, "preload.js"),
                enableRemoteModule: true,
                nativeWindowOpen: true,
                spellcheck: false
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
        contextMenu({
            prepend: (_defaultActions, _contextMenu, _myWindow) => [
                {
                    label: "Undo",
                    role: "undo"
                },
                {
                    label: "Redo",
                    role: "redo"
                }
            ],
            window: myWindow,
            labels: {
                searchWithGoogle: "Serach Google for \"{selection}\""
            }
        })
        function loadSettings() {
            console.log(JSON.stringify(settings))
            if (settings.unResizable) {
                myWindow.setResizable(false)
            } else {
                myWindow.setResizable(true)
            }
            if (settings.noUpdateOnStartup) {
                updateOnStartup = false
                //console.log(updateOnStartup)
                myWindow.show()
                myWindow.setAlwaysOnTop(false)
            }
            myWindow.setMinimumSize(settings.minWidth, settings.minHeight)
            if (settings.width < myWindow.getMinimumSize()[0]) {
                myWindow.setMinimumSize(settings.minWidth, myWindow.getMinimumSize()[1])
            }
            if (settings.height < myWindow.getMinimumSize()[1]) {
                myWindow.setMinimumSize(myWindow.getMinimumSize()[0], settings.minHeight)
            }
            myWindow.setSize(settings.width, settings.height)
            myWindow.webContents.executeJavaScript(`
                document.getElementById("editor_input").style.color = "${settings.textColor}"
                document.getElementById("editor_input").style.backgroundColor = "${settings.backgroundTextColor}"
            `)
        }
        require("electron").ipcMain.on("reload_settings", () => {
            require("fs").readFile(require("path").join(__dirname, "settings.json"), { encoding: "utf-8" }, (_error, data) => {
                settings = JSON.parse(data)
                loadSettings();
                myWindow.webContents.send("reload_settings_1")
            })
        })
        myWindow.loadFile("index.html").then(() => {
            loadSettings();
            myWindow.webContents.executeJavaScript(`var cachedText = ""`)
            myWindow.center()
            if (updateOnStartup) {
                checkForUpdate(false)
            } else {
                test_autoRecovery()
                updateOnStartup = true
            }
        })
        function test_autoRecovery() {
            if (!!localStorage_.getItem("autoRecoveryContent")) {
                require("electron").dialog.showMessageBox(myWindow, {
                    type: "question",
                    title: "edit - AutoRecovery",
                    message: "It look like the program has closed and the document haven't been saved. Would you like to saved it?",
                    buttons: ["Yes", "No"]
                }).then((response) => {
                    if (response.response == 0) {
                        myWindow.webContents.executeJavaScript(`
                        var a_ = require("node-localstorage").LocalStorage;
                        var localStorage_ = new a_("autoRecovery")
                        document.getElementById("editor_input").value = localStorage_.getItem("autoRecoveryContent")
                        require("electron").remote.dialog.showSaveDialog(null, {title: "Save File", buttonLabel: "Save file", defaultPath: "default.txt"}).then((fileNames) => {
                            if (!fileNames.canceled) {
                                require("fs").writeFile(fileNames.filePath, document.getElementById("editor_input").value, (error) => {
                                    if (error) {
                                        //alert("An error ocurred writing the file:", error.message)
                                    } else {
                                        document.getElementById("_file_name").innerHTML = fileNames.filePath
                                        document.getElementById("current_state").innerHTML = "";
                                        cachedText = document.getElementById("editor_input").value
                                        localStorage_.removeItem("autoRecoveryContent")
                                    }
                                })
                            }
                        })
                    `)
                    } else {
                        localStorage_.removeItem("autoRecoveryContent")
                    }
                })
            }
        }
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
        //console.log(value)
        if (app.commandLine.hasSwitch("file") || app.commandLine.hasSwitch("f")) {
            if (app.commandLine.hasSwitch("version") || app.commandLine.hasSwitch("v")) {
                console.log("Warning: --version or --v is not allow with other switches")
            } else if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
                console.log("Warning: --help or --h is not allowed with other switches")
            } else {
                require("fs").readFile((app.commandLine.getSwitchValue("file") ? app.commandLine.getSwitchValue("file") : app.commandLine.getSwitchValue("f")), {encoding: "utf-8"}, (error, data) => {
                    //console.log(data)
                    if (error) {
                        console.log(`Warning: Cannot find certain file to load, edit will continue loading with no file loaded.\nDetail are in below:\n${error}`)
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
            app.quit()
        }
        if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
            console.log(`==================================\nedit version ${app.getVersion()} - Help page\n------------------------------\nUsage: edit <switch>\n--file=<directory_of_file> or --f=<directory_of_file>: Load the file into edit\n--no-update-on-startup or --n: Prevent edit from checking update on startup, require user to manually check for update\n--unresizable or --u: Make the edit window unresizable\n--size=<width>,<height> or --s=<width>,<height>: Load edit with the specify width and height.\nIf the width or height is smaller then the minimal width (320) or minimal height (240), the minimal width/height will be set to the width/height you specify\n--version or --v: Display the version of edit\n--help or --h: Display the help page\n--ghostTyping="<message>",<speed> or --g="<message>",<speed>: Ghost-typing a text into edit. Replace the <message> with the message you want ghost typing and <speed> with the delay between each character\n==================================`)
            //process.exit()
            app.quit()
        }
        if (app.commandLine.hasSwitch("ghostTyping") || app.commandLine.hasSwitch("g")) {
            if (app.commandLine.hasSwitch("version") || app.commandLine.hasSwitch("v")) {
                console.log("Warning: --version or --v is not allow with other switches")
            } else if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
                console.log("Warning: --help or --h is not allowed with other switches")
            } else {
                var message_gT = app.commandLine.getSwitchValue("ghostTyping").split(",")[0] ? app.commandLine.getSwitchValue("ghostTyping").split(",")[0] : app.commandLine.getSwitchValue("g").split(",")[0]
                var speed_gT = app.commandLine.getSwitchValue("ghostTyping").split(",")[1] ? app.commandLine.getSwitchValue("ghostTyping").split(",")[1] : app.commandLine.getSwitchValue("g").split(",")[1]
                console.log(message_gT, speed_gT)
                myWindow.webContents.executeJavaScript(`
                    function ghost_typing(input = "", id = "", delay = 1000) {
                        var start = 0;
                        var input = [...input]
                        console.log(input)
                        var inter = setInterval(() => {
                            document.getElementById(id).value += input[start]
                            start++
                            if (start >= input.length) {
                                clearInterval(inter)
                            }
                        }, delay)
                    }
                    ghost_typing("${message_gT}", "editor_input", ${speed_gT})
                `)
            }
        }
        //myWindow.webContents.executeJavaScript(`console.log("${path.normalize(process.execPath + "/..")}")`)
        var version = 0
        const fetch = require("electron-fetch").default
        myWindow.webContents.session.on('will-download', (event, item, webContents) => {
            var updatePackageId = Math.round(Math.random() * 1000000)
            item.setSavePath(path.normalize(process.execPath + "/../.." + `/update-${updatePackageId}.zip`))
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
                        //del(item.getSavePath().replace(/\\/g, "/")).then(() => {
                        if (os == "win32") {
                            //Execute the new version
                            //New version location: C:\edit\edit.exe\..\..\edit-update-12312\edit\edit.exe
                            //Short: C:\edit-update-12312\edit\edit.exe
                            var loop1 = 0
                            var path1 = path.normalize(process.execPath + "/.." + `/../edit-update-${updatePackageId}/edit/edit.exe`)
                            var path2 = path.normalize(process.execPath + "/.." + `/../update-info-82163921.json`) //Root directory
                            console.log(path1, path2)
                            setTimeout(() => {
                                // require("electron").shell.openPath(`${path1}`).then((error) => {
                                //     if (error) {
                                //         console.error(error);
                                //     }
                                //     var content = {
                                //         oldVersion: `${require("electron").app.getVersion().split(".").splice(0, 2).join(".")}`,
                                //         stage: 1,
                                //         updateId: updatePackageId
                                //     }
                                //     require("fs").writeFile(`${path2}`, JSON.stringify(content), () => { process.exit() })
                                // })
                                var content = {
                                    oldVersion: `${require("electron").app.getVersion().split(".").splice(0, 2).join(".")}`,
                                    stage: 1,
                                    updateId: updatePackageId
                                }
                                function openFile1() { require("electron").shell.openPath(`${path1}`).then(err => {if (err && loop1 <= 30) {setTimeout(() => {openFile1()}, 1000)} else if (err && loop1 >= 30) { require("electron").dialog.showMessageBox(myWindow, { title: "edit - Problem will updating", message: `A problem has occur while opening: ${path1}\nDetail: ${err}` }) } else {process.exit()}} ) }
                                require("fs").writeFile(`${path2}`, JSON.stringify(content), () => { openFile1() })
                            }, 1000)
                        } else {
                            var path3 = path.normalize(process.execPath + "/.." + `/../edit-update-${updatePackageId}/edit/edit`)
                            var path4 = path.normalize(process.execPath + "/.." + `/../update-info-82163921.json`)
                            console.log(path3, path4)
                            setTimeout(() => {
                                var content = {
                                    oldVersion: `${require("electron").app.getVersion().split(".").splice(0, 2).join(".")}`,
                                    stage: 1,
                                    updateId: updatePackageId
                                }
                                function openFile2() { require("electron").shell.openPath(`${path3}`).then(err => {if (err && loop1 <= 30) {setTimeout(() => {openFile2()}, 1000)} else if (err && loop1 >= 30) { require("electron").dialog.showMessageBox(myWindow, { title: "edit - Problem will updating", message: `A problem has occur while opening: ${path3}\nDetail: ${err}` }) } else {process.exit()}} ) }
                                require("fs").writeFile(`${path4}`, JSON.stringify(content), () => { openFile2() })
                                // require("electron").shell.openPath(`${path3}`).then((error) => {
                                //     if (error) {
                                //         console.error(error);
                                //     }
                                //     var content = {
                                //         oldVersion: `${require("electron").app.getVersion().split(".").splice(0, 2).join(".")}`,
                                //         stage: 1,
                                //         updateId: updatePackageId
                                //     }
                                //     require("fs").writeFile(`${path4}`, JSON.stringify(content), () => { process.exit() })
                                // })
                            }, 1000)
                        }
                        //})
                        // require("fs").unlink(item.getSavePath().replace(/\\/g, "/"), (err) => {
                        //     if (err) {
                        //         //myWindow.webContents.executeJavaScript(`console.log("${err}")`)
                        //     }
                        // })
                        // myWindow.webContents.executeJavaScript(`console.log("${app.getAppPath()}", "${path.normalize(process.execPath + "/..")}")`)
                        //myWindow.focus()
                    })
                    unzip.on("progress", (fileIndex, fileCount) => {
                        progressBar1.value = ((fileIndex + 1) / fileCount * 100)
                        progressBar1.detail = `Extracted file ${fileIndex + 1} of ${fileCount}`
                        //console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
                    })
                    unzip.extract({
                        path: path.normalize(process.execPath + "/.." + `/../edit-update-${updatePackageId}`)
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
                    if ((settings.allowBetaUpdate) || (!data_[0].prerelease && !settings.allowBetaUpdate)) {
                        if (require("electron").app.getVersion().split(".").splice(0, 2).join(".") !== data_[0].tag_name.replace("v", "")) {
                            require("electron").dialog.showMessageBox(myWindow, {
                                noLink: true,
                                type: "question",
                                buttons: ["Yes", "Later"],
                                defaultId: 0,
                                title: "edit - Update",
                                message: `Update is avaliable! Would you like to install it now?\nCurrent version: v${require("electron").app.getVersion()}\nNew verion: ${data_[0].tag_name} (Created at: ${data_[0].created_at}, Published at: ${data_[0].published_at})`,
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
                                    test_autoRecovery()
                                }
                            })
                        } else {
                            myWindow.show()
                            myWindow.setAlwaysOnTop(false)
                            test_autoRecovery()
                            if (userAsked) {
                                require("electron").dialog.showMessageBox(myWindow, {
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
                        test_autoRecovery()
                        if (userAsked) {
                            require("electron").dialog.showMessageBox(myWindow, {
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
    }
})