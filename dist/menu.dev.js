"use strict";

var _require = require("electron"),
    Menu = _require.Menu;

var shell = require("electron").app;

var menu = Menu.buildFromTemplate([{
  label: "File",
  submenu: [{
    label: "New",
    accelerator: "Ctrl+N",
    click: function click(_menuItem, browserWindow, _event) {
      browserWindow.webContents.executeJavaScript("\n                        if (cachedText == document.getElementById(\"editor_input\").value) {\n                            document.getElementById(\"editor_input\").value = \"\";\n                            cachedText = document.getElementById(\"editor_input\").value\n                            document.getElementById(\"current_state\").innerHTML = \"\";\n                            document.getElementById(\"_file_name\").innerHTML = \"Untitled\";\n                        } else {\n                            require(\"electron\").remote.dialog.showMessageBox(null, {\n                                type: \"question\",\n                                buttons: [\"Save\", \"Don't Save\", \"Cancel\"],\n                                defaultId: 0,\n                                title: \"edit - Unsaved File\",\n                                message: \"You have unsaved file, do you want to save them?\"\n                            }).then((response) => {\n                                if (response.response == 0) {\n                                    require(\"electron\").remote.dialog.showSaveDialog(null, {title: \"Save File\", buttonLabel: \"Save file\", defaultPath: \"default.txt\"}).then((fileName) => {\n                                        require(\"fs\").writeFile(fileName.filePath, document.getElementById(\"editor_input\").value, (error) => {\n                                            if (error) {\n                                                //alert(\"An error ocurred writing the file:\", error.message)\n                                            }\n                                            cachedText = document.getElementById(\"editor_input\").value\n                                        })\n                                    }).then(function() {\n                                        document.getElementById(\"editor_input\").value = \"\";\n                                        cachedText = document.getElementById(\"editor_input\").value\n                                        document.getElementById(\"current_state\").innerHTML = \"\";\n                                        document.getElementById(\"_file_name\").innerHTML = \"Untitled\";\n                                    })\n                                } else if (response.response == 1) {\n                                    document.getElementById(\"editor_input\").value = \"\";\n                                    cachedText = document.getElementById(\"editor_input\").value\n                                    document.getElementById(\"current_state\").innerHTML = \"\";\n                                    document.getElementById(\"_file_name\").innerHTML = \"Untitled\";\n                                }\n                            })\n                        }\n                    ");
    }
  }, {
    label: "Open",
    accelerator: "Ctrl+O",
    click: function click(_menuItem, browserWindow, _event) {
      browserWindow.webContents.executeJavaScript("\n                        if (cachedText == document.getElementById(\"editor_input\").value) {\n                            require(\"electron\").remote.dialog.showOpenDialog(null, {title: \"Open File\", buttonLabel: \"Load file\"}).then((fileNames) => {\n                                // fileNames is an array that contains all the selected\n                                if(fileNames === undefined){\n                                    console.log(\"No file selected\");\n                                    return;\n                                }\n                                require(\"fs\").readFile(fileNames.filePaths[0], 'utf-8', (err, data) => {\n                                    if(err){\n                                        //alert(\"An error ocurred reading the file:\" + err.message);\n                                        return;\n                                    }\n                                    document.getElementById(\"editor_input\").value = data\n                                    cachedText = document.getElementById(\"editor_input\").value\n                                    document.getElementById(\"_file_name\").innerHTML = fileNames.filePaths[0]\n                                    document.getElementById(\"current_state\").innerHTML = \"\";\n                                });\n                            });\n                        } else {\n                            require(\"electron\").remote.dialog.showMessageBox(null, {\n                                type: \"question\",\n                                buttons: [\"Save\", \"Don't Save\", \"Cancel\"],\n                                defaultId: 0,\n                                title: \"edit - Unsaved File\",\n                                message: \"You have unsaved file, do you want to save them?\"\n                            }).then((response) => {\n                                if (response.response == 0) {\n                                    require(\"electron\").remote.dialog.showSaveDialog(null, {title: \"Save File\", buttonLabel: \"Save file\", defaultPath: \"default.txt\"}).then((fileName) => {\n                                        require(\"fs\").writeFile(fileName.filePath, document.getElementById(\"editor_input\").value, (error) => {\n                                            if (error) {\n                                                //alert(\"An error ocurred writing the file:\", error.message)\n                                            }\n                                            cachedText = document.getElementById(\"editor_input\").value\n                                        })\n                                    }).then(function() {\n                                        require(\"electron\").remote.dialog.showOpenDialog(null, {title: \"Open File\", buttonLabel: \"Load file\"}).then((fileNames) => {\n                                            // fileNames is an array that contains all the selected\n                                            if(fileNames === undefined){\n                                                console.log(\"No file selected\");\n                                                return;\n                                            }\n                                            require(\"fs\").readFile(fileNames.filePaths[0], 'utf-8', (err, data) => {\n                                                if(err){\n                                                    //alert(\"An error ocurred reading the file:\" + err.message);\n                                                    return;\n                                                }\n                                                document.getElementById(\"editor_input\").value = data\n                                                cachedText = data\n                                                document.getElementById(\"_file_name\").innerHTML = fileNames.filePaths[0]\n                                                document.getElementById(\"current_state\").innerHTML = \"\";\n                                            });\n                                        });\n                                    })\n                                } else if (response.response == 1) {\n                                    require(\"electron\").remote.dialog.showOpenDialog(null, {title: \"Open File\", buttonLabel: \"Load file\"}).then((fileNames) => {\n                                        // fileNames is an array that contains all the selected\n                                        if(fileNames === undefined){\n                                            console.log(\"No file selected\");\n                                            return;\n                                        }\n                                        require(\"fs\").readFile(fileNames.filePaths[0], 'utf-8', (err, data) => {\n                                            if(err){\n                                                //alert(\"An error ocurred reading the file:\" + err.message);\n                                                return;\n                                            }\n                                            document.getElementById(\"editor_input\").value = data\n                                            cachedText = document.getElementById(\"editor_input\").value\n                                            document.getElementById(\"_file_name\").innerHTML = fileNames.filePaths[0]\n                                            document.getElementById(\"current_state\").innerHTML = \"\";\n                                        });\n                                    });\n                                }\n                            })\n                        }\n                    ");
    }
  }, {
    label: "Save",
    accelerator: "Ctrl+S",
    click: function click(_menuItem, browserWindow, _event) {
      browserWindow.webContents.executeJavaScript("\n                        require(\"electron\").remote.dialog.showSaveDialog(null, {title: \"Save File\", buttonLabel: \"Save file\", defaultPath: \"default.txt\"}).then((fileName) => {\n                            require(\"fs\").writeFile(fileName.filePath, document.getElementById(\"editor_input\").value, (error) => {\n                                if (error) {\n                                    //alert(\"An error ocurred writing the file:\", error.message)\n                                }\n                            })\n                            document.getElementById(\"_file_name\").innerHTML = fileName.filePath\n                            document.getElementById(\"current_state\").innerHTML = \"\";\n                        })\n                        cachedText = document.getElementById(\"editor_input\").val\n                    ");
    }
  }, {
    label: "Close",
    click: function click(_menuItem, browserWindow, _event) {
      browserWindow.webContents.executeJavaScript("\n                        if (cachedText == document.getElementById(\"editor_input\").value) {\n                            require(\"electron\").remote.getCurrentWindow().close()\n                        } else {\n                            require(\"electron\").remote.dialog.showMessageBox(null, {\n                                type: \"question\",\n                                buttons: [\"Save\", \"Don't Save\", \"Cancel\"],\n                                defaultId: 0,\n                                title: \"edit - Unsaved File\",\n                                message: \"You have unsaved file, do you want to save them?\"\n                            }).then((response) => {\n                                if (response.response == 0) {\n                                    require(\"electron\").remote.dialog.showSaveDialog(null, {title: \"Save File\", buttonLabel: \"Save file\", defaultPath: \"default.txt\"}).then((fileName) => {\n                                        require(\"fs\").writeFile(fileName.filePath, document.getElementById(\"editor_input\").value, (error) => {\n                                            if (error) {\n                                                //alert(\"An error ocurred writing the file:\", error.message)\n                                            }\n                                            cachedText = document.getElementById(\"editor_input\").value\n                                        })\n                                    }).then(function() {\n                                        require(\"electron\").remote.getCurrentWindow().close()\n                                    })\n                                } else if (response.response == 1) {\n                                    require(\"electron\").remote.getCurrentWindow().close()\n                                }\n                            })\n                        }\n                    ");
    }
  }]
}, {
  label: "Edit",
  submenu: [{
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
  }, {
    label: "Copy",
    accelerator: "Ctrl+C",

    /*click(_menuItem, browserWindow, _event) {
        browserWindow.webContents.executeJavaScript('if (!document.execCommand("copy")) {alert("Sorry! document.execCommand is not supported anymore");return false;} else {document.execCommand("copy");}')
    }*/
    role: "copy"
  }, {
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
  }, {
    label: "Select All",
    accelerator: "Ctrl+A",

    /*click(_menuItem, browserWindow, _event) {
        browserWindow.webContents.executeJavaScript(`
            document.getElementById("editor_input").focus();
            document.getElementById("editor_input").select();
        `)
    }*/
    role: "selectAll"
  }, {
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
  }, {
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
  }, {
    label: "Time/Date",
    accelerator: "F5",
    click: function click(_menuItem, browserWindow, _event) {
      browserWindow.webContents.executeJavaScript("\n                        var td = new Date();\n                        document.getElementById(\"editor_input\").value += td;\n                    ");
    }
  }]
}, {
  label: "Search",
  submenu: [{
    label: "Find",
    accelerator: "Ctrl+F",
    click: function click(_menuItem, browserWindow, _event) {
      browserWindow.webContents.executeJavaScript("\n                        var open = document.querySelector(\"#editor_find\");\n                        open.style.display = \"block\";\n                        document.querySelector(\"#editor_overlay\").style.display = \"block\";\n                    "); //require("electron").ipcRenderer.send("abc", document.body.innerHTML)

      /*require("electron").ipcMain.on("abc", (event, abc) => {
          let open = document.querySelector("#editor_find");
          open.style.display = "block";
          document.querySelector("#editor_overlay").style.display = "block";
      })*/
    }
  }, {
    label: "Replace",
    accelerator: "Ctrl+H",
    click: function click(_menuItem, browserWindow, _event) {
      browserWindow.webContents.executeJavaScript("\n                        var open1 = document.querySelector(\"#editor_replace\");\n                        open1.style.display = \"block\";\n                        document.querySelector(\"#editor_overlay\").style.display = \"block\";\n                    ");
    }
  }, {
    label: "Go to line",
    accelerator: "Ctrl+G",
    click: function click(_menuItem, browserWindow, _event) {
      browserWindow.webContents.executeJavaScript("\n                        var open2 = document.querySelector(\"#editor_gotoline\");\n                        open2.style.display = \"block\";\n                        document.querySelector(\"#editor_overlay\").style.display = \"block\";\n                    ");
    }
  }, {
    label: "Search selected text with Google",
    accelerator: "Ctrl+E",
    click: function click(_menuItem, browserWindow, _event) {
      browserWindow.webContents.executeJavaScript("\n                        var highlight = document.getSelection();\n                        require(\"electron\").shell.openExternal(\"https://google.com/search?q=\" + highlight)\n                    ");
    }
  }]
}, {
  label: "Help",
  submenu: [{
    label: "About",
    click: function click() {
      require("electron").dialog.showMessageBox(null, {
        type: "info",
        buttons: ["Ok"],
        title: "Info about edit",
        message: "edit v1.0 (Native Edition)\nVersion: 1.4\nRelease Date: Monday, 4th 2021\nFirst release (For web version): Wednesday, 9th 2020\nCopyright (C) 2020 Quan_MCPC\nSource code are free to copy, modify and publish. Just remember to include my Copyright"
      });
    }
  }, {
    label: "Toggle Developer Tools",
    role: "toggleDevTools",
    accelerator: "Ctrl+Shift+I"
  }, {
    label: "Settings",
    accelerator: "Ctrl+Shift+S",
    click: function click(_menuItem, browserWindow, _event) {
      browserWindow.webContents.executeJavaScript("\n                        var closeSettings = document.getElementById(\"editor_settings\")\n                        closeSettings.style.display = \"block\"\n                        document.querySelector(\"#editor_overlay\").style.display = \"block\";\n                    ");
    }
  }]
}]);
Menu.setApplicationMenu(menu);
module.exports = {
  menu: menu
};