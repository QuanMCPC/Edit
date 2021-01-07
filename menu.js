const { Menu } = require("electron")
const shell = require("electron").app
const menu = Menu.buildFromTemplate([
    {
        label: "File",
        submenu: [
            {
                label: "New",
                accelerator: "Ctrl+N",
                click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript(`
                        if (cachedText == document.getElementById("editor_input").value) {
                            document.getElementById("editor_input").value = "";
                            cachedText = document.getElementById("editor_input").value
                            document.getElementById("current_state").innerHTML = "";
                            document.getElementById("_file_name").innerHTML = "Untitled";
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
                                        return fileName.canceled
                                        require("fs").writeFile(fileName.filePath, document.getElementById("editor_input").value, (error) => {
                                            if (error) {
                                                //alert("An error ocurred writing the file:", error.message)
                                            }
                                        })
                                    }).then(function(response) {
                                        if (!response) {
                                            document.getElementById("editor_input").value = "";
                                            cachedText = document.getElementById("editor_input").value
                                            document.getElementById("current_state").innerHTML = "";
                                            document.getElementById("_file_name").innerHTML = "Untitled";
                                        }
                                    })
                                } else if (response.response == 1) {
                                    document.getElementById("editor_input").value = "";
                                    cachedText = document.getElementById("editor_input").value
                                    document.getElementById("current_state").innerHTML = "";
                                    document.getElementById("_file_name").innerHTML = "Untitled";
                                }
                            })
                        }
                    `)
                }
            },
            {
                label: "Open",
                accelerator: "Ctrl+O",
                click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript(`
                        if (cachedText == document.getElementById("editor_input").value) {
                            require("electron").remote.dialog.showOpenDialog(null, {title: "Open File", buttonLabel: "Load file"}).then((fileNames) => {
                                // fileNames is an array that contains all the selected
                                if(fileNames === undefined){
                                    console.log("No file selected");
                                    throw new Error()
                                }
                                require("fs").readFile(fileNames.filePaths[0], 'utf-8', (err, data) => {
                                    if(err){
                                        //alert("An error ocurred reading the file:" + err.message);
                                        return;
                                    } else {
                                        document.getElementById("editor_input").value = data
                                        cachedText = document.getElementById("editor_input").value
                                        document.getElementById("_file_name").innerHTML = fileNames.filePaths[0]
                                        document.getElementById("current_state").innerHTML = "";
                                    }
                                });
                            });
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
                                        return fileName.canceled;
                                        require("fs").writeFile(fileName.filePath, document.getElementById("editor_input").value, (error) => {
                                            if (error) {
                                                //alert("An error ocurred writing the file:", error.message)
                                            } else {
                                                cachedText = document.getElementById("editor_input").value
                                            }
                                        })
                                    }).then(function(response) {
                                        if (!response) {
                                            require("electron").remote.dialog.showOpenDialog(null, {title: "Open File", buttonLabel: "Load file"}).then((fileNames) => {
                                                // fileNames is an array that contains all the selected
                                                if(fileNames === undefined){
                                                    console.log("No file selected");
                                                }
                                                require("fs").readFile(fileNames.filePaths[0], 'utf-8', (err, data) => {
                                                    if(err){
                                                        //alert("An error ocurred reading the file:" + err.message);
                                                    } else {
                                                        document.getElementById("editor_input").value = data
                                                        cachedText = data
                                                        document.getElementById("_file_name").innerHTML = fileNames.filePaths[0]
                                                        document.getElementById("current_state").innerHTML = "";
                                                    }
                                                });
                                            });
                                        }
                                    })
                                } else if (response.response == 1) {
                                    require("electron").remote.dialog.showOpenDialog(null, {title: "Open File", buttonLabel: "Load file"}).then((fileNames) => {
                                        // fileNames is an array that contains all the selected
                                        if(fileNames === undefined){
                                            console.log("No file selected");
                                        }
                                        require("fs").readFile(fileNames.filePaths[0], 'utf-8', (err, data) => {
                                            if(err){
                                                //alert("An error ocurred reading the file:" + err.message);
                                            } else {
                                                document.getElementById("editor_input").value = data
                                                cachedText = document.getElementById("editor_input").value
                                                document.getElementById("_file_name").innerHTML = fileNames.filePaths[0]
                                                document.getElementById("current_state").innerHTML = "";
                                            }
                                        });
                                    });
                                }
                            })
                        }
                    `)
                }
            },
            {
                label: "Save",
                accelerator: "Ctrl+S",
                click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript(`
                        require("electron").remote.dialog.showSaveDialog(null, {title: "Save File", buttonLabel: "Save file", defaultPath: "default.txt"}).then((fileName) => {
                            require("fs").writeFile(fileName.filePath, document.getElementById("editor_input").value, (error) => {
                                if (error) {
                                    //alert("An error ocurred writing the file:", error.message)
                                } else {
                                    document.getElementById("_file_name").innerHTML = fileName.filePath
                                    document.getElementById("current_state").innerHTML = "";
                                    cachedText = document.getElementById("editor_input").value
                                }
                            })
                        })
                    `)
                }
            },
            {
                label: "Close",
                click(_menuItem, browserWindow, _event) {
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
                                            } else {
                                                cachedText = document.getElementById("editor_input").value
                                            }
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
            }
        ]
    },
    {
        label: "Edit",
        submenu: [
            {
                label: "Cut",
                accelerator: "Ctrl+X",
                /*click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript(`
                        if (!document.execCommand('cut')) {
                            alert("Sorry! document.execCommand is not supported anymore");
                            return false;
                        } else {
                            document.getElementById("editor_input").focus();
                            document.execCommand('cut');
                        }
                    `)
                }*/
                role: "cut"
            },
            {
                label: "Copy",
                accelerator: "Ctrl+C",
                /*click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript('if (!document.execCommand("copy")) {alert("Sorry! document.execCommand is not supported anymore");return false;} else {document.execCommand("copy");}')
                }*/
                role: "copy"
            },
            {
                label: "Paste",
                accelerator: "Ctrl+V",
                /*click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript(`
                        if (!document.execCommand('paste')) {
                            alert("Sorry! document.execCommand is not supported anymore");
                            return false;
                        } else {
                            document.getElementById("editor_input").focus();
                            var editor_pasteTest = document.querySelector("#editor_input");
                            editor_pasteTest.focus();
                            document.execCommand('paste');
                            navigator.clipboard.readText()
                        }
                    `)
                }*/
                role: "paste"
            },
            {
                label: "Select All",
                accelerator: "Ctrl+A",
                /*click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript(`
                        document.getElementById("editor_input").focus();
                        document.getElementById("editor_input").select();
                    `)
                }*/
                role: "selectAll"
            },
            {
                label: "Undo",
                accelerator: "Ctrl+Z",
                /*click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript(`
                        if (!document.execCommand('undo')) {
                            alert("Sorry! document.execCommand is not supported anymore");
                            return false;
                        } else {
                            document.execCommand('undo');
                        }
                    `)
                }*/
                role: "undo"
            },
            {
                label: "Redo",
                accelerator: "Ctrl+Y",
                /*click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript(`
                        if (!document.execCommand('redo')) {
                            alert("Sorry! document.execCommand is not supported anymore");
                            return false;
                        } else {
                            document.execCommand('redo');
                        }
                    `)
                }*/
                role: "redo"
            }
        ]
    },
    {
        label: "Search",
        submenu: [
            {
                label: "Find",
                accelerator: "Ctrl+F",
                click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript(`
                        var open = document.querySelector("#editor_find");
                        open.style.display = "block";
                        document.querySelector("#editor_overlay").style.display = "block";
                    `)
                    //require("electron").ipcRenderer.send("abc", document.body.innerHTML)
                    /*require("electron").ipcMain.on("abc", (event, abc) => {
                        let open = document.querySelector("#editor_find");
                        open.style.display = "block";
                        document.querySelector("#editor_overlay").style.display = "block";
                    })*/
                }
            },
            {
                label: "Replace",
                accelerator: "Ctrl+H",
                click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript(`
                        var open1 = document.querySelector("#editor_replace");
                        open1.style.display = "block";
                        document.querySelector("#editor_overlay").style.display = "block";
                    `)
                }
            },
            {
                label: "Go to line",
                accelerator: "Ctrl+G",
                click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript(`
                        var open2 = document.querySelector("#editor_gotoline");
                        open2.style.display = "block";
                        document.querySelector("#editor_overlay").style.display = "block";
                    `)
                }
            },
            {
                label: "Search selected text with Google",
                accelerator: "Ctrl+E",
                click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript(`
                        var highlight = document.getSelection();
                        require("electron").shell.openExternal("https://google.com/search?q=" + highlight)
                    `)
                }
            }
        ]
    },
    {
        label: "Help",
        submenu: [
            {
                label: "About",
                click() {
                    require("electron").dialog.showMessageBox(null, {
                        type: "info",
                        buttons: ["Ok"],
                        title: "Info about edit",
                        message: `edit (Native Edition)\nVersion: ${app.getVersion()}\nRelease Date: Monday, 4th 2021\nFirst release (For web version): Wednesday, 9th 2020\nCopyright (C) 2020 Quan_MCPC\nSource code are free to copy, modify and publish. Just remember to include my Copyright`
                    })
                }
            },
            {
                label: "Toggle Developer Tools",
                role: "toggleDevTools",
                accelerator: "Ctrl+Shift+I"
            },
            {
                label: "Settings",
                accelerator: "Ctrl+Shift+S",
                click(_menuItem, browserWindow, _event) {
                    browserWindow.webContents.executeJavaScript(`
                        var closeSettings = document.getElementById("editor_settings")
                        closeSettings.style.display = "block"
                        document.querySelector("#editor_overlay").style.display = "block";
                    `)
                }
            }
        ]
    }
])
Menu.setApplicationMenu(menu)
module.exports = {
    menu
}