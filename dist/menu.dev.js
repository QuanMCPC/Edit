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
      browserWindow.webContents.executeJavaScript("\n                        if (cachedText == document.getElementById(\"editor_input\").value) {\n                            document.getElementById(\"editor_input\").value = \"\";\n                            cachedText = document.getElementById(\"editor_input\").value\n                            document.getElementById(\"current_state\").innerHTML = \"\";\n                            document.getElementById(\"_file_name\").innerHTML = \"Untitled\";\n                        } else {\n                            require(\"electron\").remote.dialog.showMessageBox(null, {\n                                type: \"question\",\n                                buttons: [\"Save\", \"Don't Save\", \"Cancel\"],\n                                defaultId: 0,\n                                title: \"edit - Unsaved File\",\n                                message: \"You have unsaved file, do you want to save them?\"\n                            }).then((response) => {\n                                if (response.response == 0) {\n                                    require(\"electron\").remote.dialog.showSaveDialog(null, {title: \"Save File\", buttonLabel: \"Save file\", defaultPath: \"default.txt\"}).then((fileNames) => {\n                                        if (!fileNames.canceled) {\n                                            require(\"fs\").writeFile(fileNames.filePath, document.getElementById(\"editor_input\").value, (error) => {\n                                                if (error) {\n                                                    //alert(\"An error ocurred writing the file:\", error.message)\n                                                } else {\n                                                    document.getElementById(\"editor_input\").value = \"\";\n                                                    cachedText = document.getElementById(\"editor_input\").value\n                                                    document.getElementById(\"current_state\").innerHTML = \"\";\n                                                    document.getElementById(\"_file_name\").innerHTML = \"Untitled\";\n                                                }\n                                            })\n                                        }\n                                    })\n                                } else if (response.response == 1) {\n                                    document.getElementById(\"editor_input\").value = \"\";\n                                    cachedText = document.getElementById(\"editor_input\").value\n                                    document.getElementById(\"current_state\").innerHTML = \"\";\n                                    document.getElementById(\"_file_name\").innerHTML = \"Untitled\";\n                                }\n                            })\n                        }\n                    ");
    }
  }, {
    label: "Open",
    accelerator: "Ctrl+O",
    click: function click(_menuItem, browserWindow, _event) {
      browserWindow.webContents.executeJavaScript("\n                        if (cachedText == document.getElementById(\"editor_input\").value) {\n                            require(\"electron\").remote.dialog.showOpenDialog(null, {title: \"Open File\", buttonLabel: \"Load file\"}).then((fileNames) => {\n                                // fileNames is an array that contains all the selected\n                                if(fileNames === undefined){\n                                    console.log(\"No file selected\");\n                                    throw new Error()\n                                } else {\n                                    if (!fileNames.canceled) {\n                                        require(\"fs\").readFile(fileNames.filePaths[0], 'utf-8', (err, data) => {\n                                            if(err){\n                                                //alert(\"An error ocurred reading the file:\" + err.message);\n                                                return;\n                                            } else {\n                                                document.getElementById(\"editor_input\").value = data\n                                                cachedText = document.getElementById(\"editor_input\").value\n                                                document.getElementById(\"_file_name\").innerHTML = fileNames.filePaths[0]\n                                                document.getElementById(\"current_state\").innerHTML = \"\";\n                                            }\n                                        });\n                                    }\n                                }\n                            });\n                        } else {\n                            require(\"electron\").remote.dialog.showMessageBox(null, {\n                                type: \"question\",\n                                buttons: [\"Save\", \"Don't Save\", \"Cancel\"],\n                                defaultId: 0,\n                                title: \"edit - Unsaved File\",\n                                message: \"You have unsaved file, do you want to save them?\"\n                            }).then((response) => {\n                                if (response.response == 0) {\n                                    require(\"electron\").remote.dialog.showSaveDialog(null, {title: \"Save File\", buttonLabel: \"Save file\", defaultPath: \"default.txt\"}).then((fileNames) => {\n                                        if (!fileNames.canceled) {\n                                            require(\"fs\").writeFile(fileNames.filePath, document.getElementById(\"editor_input\").value, (error) => {\n                                                if (error) {\n                                                    //alert(\"An error ocurred writing the file:\", error.message)\n                                                } else {\n                                                    cachedText = document.getElementById(\"editor_input\").value\n                                                    require(\"electron\").remote.dialog.showOpenDialog(null, {title: \"Open File\", buttonLabel: \"Load file\"}).then((fileNames) => {\n                                                        // fileNames is an array that contains all the selected\n                                                        if(fileNames === undefined){\n                                                            console.log(\"No file selected\");\n                                                        } else {\n                                                            if (!fileNames.canceled) {\n                                                                require(\"fs\").readFile(fileNames.filePaths[0], 'utf-8', (err, data) => {\n                                                                    if(err){\n                                                                        //alert(\"An error ocurred reading the file:\" + err.message);\n                                                                    } else {\n                                                                        document.getElementById(\"editor_input\").value = data\n                                                                        cachedText = data\n                                                                        document.getElementById(\"_file_name\").innerHTML = fileNames.filePaths[0]\n                                                                        document.getElementById(\"current_state\").innerHTML = \"\";\n                                                                    }\n                                                                });\n                                                            }\n                                                        }\n                                                    });\n                                                }\n                                            })\n                                        }\n                                    })\n                                } else if (response.response == 1) {\n                                    require(\"electron\").remote.dialog.showOpenDialog(null, {title: \"Open File\", buttonLabel: \"Load file\"}).then((fileNames) => {\n                                        // fileNames is an array that contains all the selected\n                                        if(fileNames === undefined) {\n                                            console.log(\"No file selected\");\n                                        } else {\n                                            if (!fileNames.canceled) {\n                                                require(\"fs\").readFile(fileNames.filePaths[0], 'utf-8', (err, data) => {\n                                                    if(err){\n                                                        //alert(\"An error ocurred reading the file:\" + err.message);\n                                                    } else {\n                                                        document.getElementById(\"editor_input\").value = data\n                                                        cachedText = document.getElementById(\"editor_input\").value\n                                                        document.getElementById(\"_file_name\").innerHTML = fileNames.filePaths[0]\n                                                        document.getElementById(\"current_state\").innerHTML = \"\";\n                                                    }\n                                                });\n                                            }\n                                        }\n                                    });\n                                }\n                            })\n                        }\n                    ");
    }
  }, {
    label: "Save",
    accelerator: "Ctrl+S",
    click: function click(_menuItem, browserWindow, _event) {
      browserWindow.webContents.executeJavaScript("\n                        require(\"electron\").remote.dialog.showSaveDialog(null, {title: \"Save File\", buttonLabel: \"Save file\", defaultPath: \"default.txt\"}).then((fileNames) => {\n                            if (!fileNames.canceled) {\n                                require(\"fs\").writeFile(fileNames.filePath, document.getElementById(\"editor_input\").value, (error) => {\n                                    if (error) {\n                                        //alert(\"An error ocurred writing the file:\", error.message)\n                                    } else {\n                                        document.getElementById(\"_file_name\").innerHTML = fileNames.filePath\n                                        document.getElementById(\"current_state\").innerHTML = \"\";\n                                        cachedText = document.getElementById(\"editor_input\").value\n                                    }\n                                })\n                            }\n                        })\n                    ");
    }
  }, {
    label: "Close",
    click: function click(_menuItem, browserWindow, _event) {
      browserWindow.webContents.executeJavaScript("\n                        if (cachedText == document.getElementById(\"editor_input\").value) {\n                            require(\"electron\").remote.getCurrentWindow().close()\n                        } else {\n                            require(\"electron\").remote.dialog.showMessageBox(null, {\n                                type: \"question\",\n                                buttons: [\"Save\", \"Don't Save\", \"Cancel\"],\n                                defaultId: 0,\n                                title: \"edit - Unsaved File\",\n                                message: \"You have unsaved file, do you want to save them?\"\n                            }).then((response) => {\n                                if (response.response == 0) {\n                                    require(\"electron\").remote.dialog.showSaveDialog(null, {title: \"Save File\", buttonLabel: \"Save file\", defaultPath: \"default.txt\"}).then((fileNames) => {\n                                        if (!fileNames.canceled) {\n                                            require(\"fs\").writeFile(fileNames.filePath, document.getElementById(\"editor_input\").value, (error) => {\n                                                if (error) {\n                                                    //alert(\"An error ocurred writing the file:\", error.message)\n                                                } else {\n                                                    cachedText = document.getElementById(\"editor_input\").value\n                                                    var a_ = require(\"node-localstorage\").LocalStorage;\n                                                    var localStorage_ = new a_(\"autoRecovery\")\n                                                    localStorage_.removeItem(\"autoRecoveryContent\")\n                                                    require(\"electron\").remote.getCurrentWindow().close()\n                                                }\n                                            })\n                                        }\n                                    })\n                                } else if (response.response == 1) {\n                                    var a_ = require(\"node-localstorage\").LocalStorage;\n                                    var localStorage_ = new a_(\"autoRecovery\")\n                                    localStorage_.removeItem(\"autoRecoveryContent\")\n                                    require(\"electron\").remote.getCurrentWindow().close()\n                                }\n                            })\n                        }\n                    ");
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
}, // {
//     label: "Tool",
//     submenu: [
//         {
//             label: "Convert selected text...",
//             submenu: [
//                 {
//                     label: "From ASCII to Hex",
//                     click(_menuItem, browserWindow, _event) {
//                         browserWindow.webContents.executeJavaScript(`
//                             function ascii_to_hexa(str) {
//                                 var arr1 = [];
//                                 for (var n = 0, l = str.length; n < l; n ++) {
//                                     var hex = Number(str.charCodeAt(n)).toString(16);
//                                     arr1.push(hex);
//                                 }
//                                 return arr1.join('');
//                             }
//                             var textarea = document.getElementById("editor_input");
//                             var len = textarea.value.length;
//                             var start = textarea.selectionStart;
//                             var end = textarea.selectionEnd;
//                             var sel = textarea.value.substring(start, end);
//                             var replace = ascii_to_hexa(textarea.value.substring(textarea.selectionStart,textarea.selectionEnd))
//                             // Here we are replacing the selected text with this one
//                             textarea.value =  textarea.value.substring(0,start) + replace + textarea.value.substring(end,len);
//                         `)
//                     }
//                 },
//                 {
//                     label: "From Hex to ASCII",
//                     click(_menuItem, browserWindow, _event) {
//                         browserWindow.webContents.executeJavaScript(`
//                             function hex_to_ascii(str1) {
//                             var hex  = str1.toString();
//                             var str = '';
//                             for (var n = 0; n < hex.length; n += 2) {
//                                 str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
//                             }
//                             return str;
//                             }
//                             var textarea = document.getElementById("editor_input");
//                             var len = textarea.value.length;
//                             var start = textarea.selectionStart;
//                             var end = textarea.selectionEnd;
//                             var sel = textarea.value.substring(start, end);
//                             var replace = hex_to_ascii(textarea.value.substring(textarea.selectionStart,textarea.selectionEnd))
//                             // Here we are replacing the selected text with this one
//                             textarea.value =  textarea.value.substring(0,start) + replace + textarea.value.substring(end,len);
//                         `)
//                     }
//                 },
//                 {
//                     label: "From ASCII to Binary",
//                     click(_menuItem, browserWindow, _event) {
//                         browserWindow.webContents.executeJavaScript(`
//                             function ascii_to_binary(input) {
//                                 var result = "";
//                                 for (var i = 0; i < input.length; i++) {
//                                     var bin = input[i].charCodeAt().toString(2);
//                                     result += Array(8 - bin.length + 1).join("0") + bin;
//                                 }
//                                 return result;
//                             }
//                             var textarea = document.getElementById("editor_input");
//                             var len = textarea.value.length;
//                             var start = textarea.selectionStart;
//                             var end = textarea.selectionEnd;
//                             var sel = textarea.value.substring(start, end);
//                             var replace = ascii_to_binary(textarea.value.substring(textarea.selectionStart,textarea.selectionEnd))
//                             // Here we are replacing the selected text with this one
//                             textarea.value =  textarea.value.substring(0,start) + replace + textarea.value.substring(end,len);
//                         `)
//                     }
//                 },
//                 {
//                     label: "From Binary to ASCII",
//                     click(_menuItem, browserWindow, _event) {
//                         browserWindow.webContents.executeJavaScript(`
//                             function binary_to_ascii(input) {
//                                 var result = "";
//                                 var arr = input.match(/.{1,8}/g);
//                                 for (var i = 0; i < arr.length; i++) {
//                                     result += String.fromCharCode(parseInt(arr[i], 2).toString(10));
//                                 }
//                                 return result;
//                             }
//                             var textarea = document.getElementById("editor_input");
//                             var len = textarea.value.length;
//                             var start = textarea.selectionStart;
//                             var end = textarea.selectionEnd;
//                             var sel = textarea.value.substring(start, end);
//                             var replace = binary_to_ascii(textarea.value.substring(textarea.selectionStart,textarea.selectionEnd))
//                             // Here we are replacing the selected text with this one
//                             textarea.value =  textarea.value.substring(0,start) + replace + textarea.value.substring(end,len);
//                         `)
//                     }
//                 }
//             ]
//         }
//     ]
// },
{
  label: "Help",
  submenu: [{
    label: "About",
    click: function click() {
      require("electron").dialog.showMessageBox(null, {
        type: "info",
        buttons: ["Ok"],
        title: "Info about edit",
        message: "edit (Native Edition)\nVersion: ".concat(require("electron").app.getVersion(), "\nOS: ").concat(require("os").version(), " (").concat(require("os").type(), ") ").concat(require("os").arch(), " ").concat(require("os").release(), "\nNode: v12.18.3\nElectron: v11.1.1\nChromium: v87.0.4280.8\nV8: v8.7.220.29-electron.0\nRelease Date: Monday, 4th 2021\nFirst release (For web version): Wednesday, 9th 2020\nCopyright (C) 2020 Quan_MCPC\nSource code are free to copy, modify and publish. Just remember to include my Copyright")
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
      var _require2 = require("electron"),
          BrowserWindow = _require2.BrowserWindow;

      var isWindows = process.platform === "win32";
      var settings = new BrowserWindow({
        modal: true,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        parent: browserWindow,
        frame: isWindows ? false : true,
        resizable: false,
        minimizable: false,
        width: 500,
        height: 370,
        webPreferences: {
          nodeIntegration: true,
          preload: require("path").join(__dirname, "preload.js"),
          enableRemoteModule: true,
          nativeWindowOpen: true
        }
      });
      settings.loadFile("settings_page.html");
    }
  }, {
    label: "Check for update",
    click: function click(menuItem, browserWindow, event) {
      console.log([browserWindow.webContents]); //require("electron").ipcRenderer.send("checkUpdate", document)
      //browserWindow.webContents.executeJavaScript(``)
    }
  }]
}]);
Menu.setApplicationMenu(menu);
module.exports = {
  menu: menu
};