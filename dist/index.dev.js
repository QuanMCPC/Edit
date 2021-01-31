"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = require("electron"),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow,
    ipcMain = _require.ipcMain;

var path = require("path");

var fs = require("fs");

var _require2 = require("./menu"),
    menu = _require2.menu;

var isWindows = process.platform === "win32";

var DZip = require("decompress-zip");

var ProgressBar = require('electron-progressbar');

var del = require("del");

var contextMenu = require('electron-context-menu');

var updateFinished = false,
    global_data_,
    updateOnStartup = true;
app.whenReady().then(function () {
  var a_ = require("node-localstorage").LocalStorage;

  var localStorage_ = new a_("autoRecovery");
  var settings;

  require("fs").readFile(require("path").join(__dirname, "settings.json"), {
    encoding: "utf-8"
  }, function (_error, data) {
    settings = JSON.parse(data); //console.log(settings)

    update_Phrase_2();
  });

  function update_Phrase_2() {
    if (fs.existsSync(path.normalize(process.execPath + "/.." + "/continue-update.edit_file"))) {
      console.log("If you can see this message, please change the directory to somewhere else if the current one is in the old version's folder");
      fs.readFile(path.normalize(process.execPath + "/.." + "/continue-update.edit_file"), {
        encoding: "utf-8"
      }, function (_err, data) {
        del(path.normalize(process.execPath + "/.." + "/../edit-".concat(process.platform, "-").concat(data, "/")).replace(/\\/g, "/"), {
          force: true
        }).then(function () {
          //fs.rmdirSync(path.normalize(process.execPath + "/.." + `/../edit-${process.platform}-${data}`), { recursive: true })
          del(path.normalize(process.execPath + "/../continue-update.edit_file").replace(/\\/g, "/")).then(function () {
            //fs.unlinkSync(path.normalize(process.execPath + "/../continue-update.edit_file"))
            require("electron").dialog.showMessageBox(null, {
              noLink: true,
              type: "info",
              title: "edit - Update finished",
              message: "The update installed sucessfully!"
            }).then(function () {
              updateFinished = true;
              main();
            });
          });
        })["catch"](function (err) {
          require("electron").dialog.showMessageBox(null, {
            noLink: true,
            type: "info",
            title: "edit - Update paused",
            message: "edit was unable to complete the update.\n Details are in below\n" + err,
            buttons: ["Try again", "Cancel"]
          }).then(function (response) {
            if (response.response == 0) {
              update_Phrase_2();
            } else {
              require("electron").dialog.showMessageBox(null, {
                noLink: true,
                type: "info",
                title: "edit - Update canceled",
                message: "You have canceled update, edit will now always try to complete the update on every startup"
              }).then(function () {
                updateFinished = true;
                main();
              });
            }
          });
        });
      });
    } else {
      main();
    }
  }

  function main() {
    var myWindow = new BrowserWindow({
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
      myWindow.setAlwaysOnTop(false);
      myWindow.show();
      updateFinished = false;
    }

    contextMenu({
      prepend: function prepend(defaultActions, contextMenu, myWindow) {
        return [{
          label: "Undo",
          role: "undo"
        }, {
          label: "Redo",
          role: "redo"
        }];
      },
      window: myWindow,
      labels: {
        searchWithGoogle: "Serach Google for \"{selection}\""
      }
    });

    function loadSettings() {
      console.log(JSON.stringify(settings));

      if (settings.unResizable) {
        myWindow.setResizable(false);
      } else {
        myWindow.setResizable(true);
      }

      if (settings.noUpdateOnStartup) {
        updateOnStartup = false; //console.log(updateOnStartup)

        myWindow.show();
        myWindow.setAlwaysOnTop(false);
      }

      myWindow.setMinimumSize(settings.minWidth, settings.minHeight);

      if (settings.width < myWindow.getMinimumSize()[0]) {
        myWindow.setMinimumSize(settings.minWidth, myWindow.getMinimumSize()[1]);
      }

      if (settings.height < myWindow.getMinimumSize()[1]) {
        myWindow.setMinimumSize(myWindow.getMinimumSize()[0], settings.minHeight);
      }

      myWindow.setSize(settings.width, settings.height);
      myWindow.webContents.executeJavaScript("\n                document.getElementById(\"editor_input\").style.color = \"".concat(settings.textColor, "\"\n                document.getElementById(\"editor_input\").style.backgroundColor = \"").concat(settings.backgroundTextColor, "\"\n            "));
    }

    require("electron").ipcMain.on("reload_settings", function () {
      require("fs").readFile(require("path").join(__dirname, "settings.json"), {
        encoding: "utf-8"
      }, function (_error, data) {
        settings = JSON.parse(data);
        loadSettings();
        myWindow.webContents.send("reload_settings_1");
      });
    });

    myWindow.loadFile("index.html").then(function () {
      loadSettings();
      myWindow.webContents.executeJavaScript("var cachedText = \"\"");
      myWindow.center();

      if (updateOnStartup) {
        checkForUpdate(false);
      } else {
        test_autoRecovery();
        updateOnStartup = true;
      }
    });

    function test_autoRecovery() {
      if (!!localStorage_.getItem("autoRecoveryContent")) {
        require("electron").dialog.showMessageBox(myWindow, {
          type: "question",
          title: "edit - AutoRecovery",
          message: "It look like the program has closed and the document haven't been saved. Would you like to saved it?",
          buttons: ["Yes", "No"]
        }).then(function (response) {
          if (response.response == 0) {
            myWindow.webContents.executeJavaScript("\n                        var a_ = require(\"node-localstorage\").LocalStorage;\n                        var localStorage_ = new a_(\"autoRecovery\")\n                        document.getElementById(\"editor_input\").value = localStorage_.getItem(\"autoRecoveryContent\")\n                        require(\"electron\").remote.dialog.showSaveDialog(null, {title: \"Save File\", buttonLabel: \"Save file\", defaultPath: \"default.txt\"}).then((fileNames) => {\n                            if (!fileNames.canceled) {\n                                require(\"fs\").writeFile(fileNames.filePath, document.getElementById(\"editor_input\").value, (error) => {\n                                    if (error) {\n                                        //alert(\"An error ocurred writing the file:\", error.message)\n                                    } else {\n                                        document.getElementById(\"_file_name\").innerHTML = fileNames.filePath\n                                        document.getElementById(\"current_state\").innerHTML = \"\";\n                                        cachedText = document.getElementById(\"editor_input\").value\n                                        localStorage_.removeItem(\"autoRecoveryContent\")\n                                    }\n                                })\n                            }\n                        })\n                    ");
          } else {
            localStorage_.removeItem("autoRecoveryContent");
          }
        });
      }
    }

    ipcMain.on("display-app-menu", function (_e, args) {
      if (isWindows && myWindow) {
        menu.items[3].submenu.items[3].click = function () {
          checkForUpdate(true);
        };

        menu.popup({
          window: myWindow,
          x: args.x,
          y: args.y
        });
      }
    }); //console.log(value)

    if (app.commandLine.hasSwitch("file") || app.commandLine.hasSwitch("f")) {
      if (app.commandLine.hasSwitch("version") || app.commandLine.hasSwitch("v")) {
        console.log("Warning: --version or --v is not allow with other switches");
      } else if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
        console.log("Warning: --help or --h is not allowed with other switches");
      } else {
        require("fs").readFile(app.commandLine.getSwitchValue("file") ? app.commandLine.getSwitchValue("file") : app.commandLine.getSwitchValue("f"), {
          encoding: "utf-8"
        }, function (error, data) {
          //console.log(data)
          if (error) {
            console.log("Warning: Cannot find file ".concat(value[1], " to load, edit will continue loading with no file loaded.\nDetail are in below:\n").concat(error));
          } else {
            myWindow.webContents.executeJavaScript("\n                            document.getElementById(\"editor_input\").value = \"".concat(data, "\"\n                            cachedText = document.getElementById(\"editor_input\").value\n                            document.getElementById(\"_file_name\").innerHTML = \"").concat(path.resolve(path.normalize(app.commandLine.getSwitchValue("file") ? app.commandLine.getSwitchValue("file") : app.commandLine.getSwitchValue("f"))).replace(/\\/g, "\\\\"), "\"\n                            document.getElementById(\"current_state\").innerHTML = \"\";\n                        "));
          }
        });
      }
    }

    if (app.commandLine.hasSwitch("no-update-on-startup") || app.commandLine.hasSwitch("n")) {
      if (app.commandLine.hasSwitch("version") || app.commandLine.hasSwitch("v")) {
        console.log("Warning: --version or --v is not allow with other switches");
      } else if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
        console.log("Warning: --help or --h is not allowed with other switches");
      } else {
        updateOnStartup = false;
        myWindow.show();
        myWindow.setAlwaysOnTop(false);
      }
    }

    if (app.commandLine.hasSwitch("unresizable") || app.commandLine.hasSwitch("u")) {
      if (app.commandLine.hasSwitch("version") || app.commandLine.hasSwitch("v")) {
        console.log("Warning: --version or --v is not allow with other switches");
      } else if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
        console.log("Warning: --help or --h is not allowed with other switches");
      } else {
        myWindow.setResizable(false);
      }
    }

    if (app.commandLine.hasSwitch("size") || app.commandLine.hasSwitch("s")) {
      if (app.commandLine.hasSwitch("version") || app.commandLine.hasSwitch("v")) {
        console.log("Warning: --version or --v is not allow with other switches");
      } else if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
        console.log("Warning: --help or --h is not allowed with other switches");
      } else {
        var width = (app.commandLine.getSwitchValue("size") ? app.commandLine.getSwitchValue("size") : app.commandLine.getSwitchValue("s")).split(",")[0];
        var height = (app.commandLine.getSwitchValue("size") ? app.commandLine.getSwitchValue("size") : app.commandLine.getSwitchValue("s")).split(",")[1];
        console.log(width, height, _typeof(width), _typeof(height));

        if (isNaN(Number(width)) || isNaN(Number(height))) {
          console.log("Warning: Width or height is not a number, edit will continue loading at the default size");
        } else {
          if (Number(width) < myWindow.getMinimumSize()[0]) {
            myWindow.setMinimumSize(Number(width), myWindow.getMinimumSize()[1]);
          }

          if (Number(height) < myWindow.getMinimumSize()[1]) {
            myWindow.setMinimumSize(myWindow.getMinimumSize()[0], Number(height));
          }

          myWindow.setSize(Number(width), Number(height));
        }
      }
    }

    if (app.commandLine.hasSwitch("version") || app.commandLine.hasSwitch("v")) {
      console.log("Version: ".concat(app.getVersion()));
      process.exit();
    }

    if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
      console.log("==================================\nedit version ".concat(app.getVersion(), " - Help page\n------------------------------\nUsage: edit <switch>\n--file=<directory_of_file> or --f=<directory_of_file>: Load the file into edit\n--no-update-on-startup or --n: Prevent edit from checking update on startup, require user to manually check for update\n--unresizable or --u: Make the edit window unresizable\n--size=<width>,<height> or --s=<width>,<height>: Load edit with the specify width and height.\nIf the width or height is smaller then the minimal width (320) or minimal height (240), the minimal width/height will be set to the width/height you specify\n--version or --v: Display the version of edit\n--help or --h: Display the help page\n--ghostTyping=\"<message>\",<speed> or --g=\"<message>\",<speed>: Ghost-typing a text into edit. Replace the <message> with the message you want ghost typing and <speed> with the delay between each character\n=================================="));
      process.exit();
    }

    if (app.commandLine.hasSwitch("ghostTyping") || app.commandLine.hasSwitch("g")) {
      if (app.commandLine.hasSwitch("version") || app.commandLine.hasSwitch("v")) {
        console.log("Warning: --version or --v is not allow with other switches");
      } else if (app.commandLine.hasSwitch("help") || app.commandLine.hasSwitch("h")) {
        console.log("Warning: --help or --h is not allowed with other switches");
      } else {
        var message_gT = app.commandLine.getSwitchValue("ghostTyping").split(",")[0] ? app.commandLine.getSwitchValue("ghostTyping").split(",")[0] : app.commandLine.getSwitchValue("g").split(",")[0];
        var speed_gT = app.commandLine.getSwitchValue("ghostTyping").split(",")[1] ? app.commandLine.getSwitchValue("ghostTyping").split(",")[1] : app.commandLine.getSwitchValue("g").split(",")[1];
        console.log(message_gT, speed_gT);
        myWindow.webContents.executeJavaScript("\n                    function ghost_typing(input = \"\", id = \"\", delay = 1000) {\n                        var start = 0;\n                        var input = [...input]\n                        console.log(input)\n                        var inter = setInterval(() => {\n                            document.getElementById(id).value += input[start]\n                            start++\n                            if (start >= input.length) {\n                                clearInterval(inter)\n                            }\n                        }, delay)\n                    }\n                    ghost_typing(\"".concat(message_gT, "\", \"editor_input\", ").concat(speed_gT, ")\n                "));
      }
    } //myWindow.webContents.executeJavaScript(`console.log("${path.normalize(process.execPath + "/..")}")`)


    var version = 0;

    var fetch = require("electron-fetch")["default"];

    myWindow.webContents.session.on('will-download', function (event, item, webContents) {
      item.setSavePath(path.normalize(process.execPath + "/.." + "/update.zip"));
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
      item.on('updated', function (_event, state) {
        if (state === 'interrupted') {
          //console.log('Download is interrupted but can be resumed')
          item.resume();
        } else if (state === 'progressing') {
          if (item.isPaused()) {//console.log('Download is paused')
          } else {
            progressBar.value = Math.floor(item.getReceivedBytes() / item.getTotalBytes() * 100);
            progressBar.detail = "Received bytes: ".concat(item.getReceivedBytes(), " bytes / ").concat(item.getTotalBytes(), " bytes"); //console.log(`Received bytes: ${item.getReceivedBytes()} / ${item.getTotalBytes()}`)
          }
        }
      });
      item.once('done', function (event, state) {
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
            }
          }
        });

        if (state === 'completed') {
          var unzip = new DZip(item.getSavePath());
          unzip.on("error", function (error) {//console.log(error)
          });
          unzip.on("extract", function (log) {
            //console.log("Finish:", log)
            var os = version ? "win32" : "linux";
            var versionNumber = "";
            var data_ = global_data_;
            versionNumber = data_[0].tag_name.replace("v", "");
            del(item.getSavePath().replace(/\\/g, "/")).then(function () {
              if (os == "win32") {
                var path1 = path.normalize(process.execPath + "/.." + "/../edit-".concat(os, "-").concat(versionNumber, "/edit.exe"));
                var path2 = path.normalize(process.execPath + "/.." + "/../edit-".concat(os, "-").concat(versionNumber, "/continue-update.edit_file"));
                console.log(path1, path2);
                setTimeout(function () {
                  require("electron").shell.openPath("".concat(path1)).then(function (error) {
                    if (error) {
                      console.error(error);
                    }

                    require("fs").writeFile("".concat(path2), "".concat(require("electron").app.getVersion().split(".").splice(0, 2).join(".")), function () {
                      process.exit();
                    });
                  });
                }, 1000);
              } else {
                var path3 = path.normalize(process.execPath + "/.." + "/../edit-".concat(os, "-").concat(versionNumber, "/edit"));
                var path4 = path.normalize(process.execPath + "/.." + "/../edit-".concat(os, "-").concat(versionNumber, "/continue-update.edit_file"));
                console.log(path3, path4);
                setTimeout(function () {
                  require("electron").shell.openPath("".concat(path3)).then(function (error) {
                    if (error) {
                      console.error(error);
                    }

                    require("fs").writeFile("".concat(path4), "".concat(require("electron").app.getVersion().split(".").splice(0, 2).join(".")), function () {
                      process.exit();
                    });
                  });
                }, 1000);
              }
            }); // require("fs").unlink(item.getSavePath().replace(/\\/g, "/"), (err) => {
            //     if (err) {
            //         //myWindow.webContents.executeJavaScript(`console.log("${err}")`)
            //     }
            // })
            // myWindow.webContents.executeJavaScript(`console.log("${app.getAppPath()}", "${path.normalize(process.execPath + "/..")}")`)
            //myWindow.focus()
          });
          unzip.on("progress", function (fileIndex, fileCount) {
            progressBar1.value = (fileIndex + 1) / fileCount * 100;
            progressBar1.detail = "Extracted file ".concat(fileIndex + 1, " of ").concat(fileCount); //console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
          });
          unzip.extract({
            path: path.normalize(process.execPath + "/.." + "/..")
          });
        } else {//console.log(`Download failed: ${state}`)
        }
      });
    });

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
          }
        }
      }); //console.log("Checking for update")

      fetch("https://api.github.com/repos/QuanMCPC/Edit/releases?no-cache=".concat(Math.round(Math.random() * 1000000))).then(function (data) {
        return data.json();
      }).then(function (data_) {
        global_data_ = data_; //console.log(data_)

        checkForUpdateProgressBar.setCompleted();

        if (settings.allowBetaUpdate || !data_[0].prerelease && !settings.allowBetaUpdate) {
          if (require("electron").app.getVersion().split(".").splice(0, 2).join(".") !== data_[0].tag_name.replace("v", "")) {
            require("electron").dialog.showMessageBox(myWindow, {
              noLink: true,
              type: "question",
              buttons: ["Yes", "Later"],
              defaultId: 0,
              title: "edit - Update",
              message: "Update is avaliable! Would you like to install it now?\nCurrent version: v".concat(require("electron").app.getVersion(), "\nNew verion: ").concat(data_[0].tag_name, " (Created at: ").concat(data_[0].created_at, ", Published at: ").concat(data_[0].published_at, ")")
            }).then(function (response) {
              //console.log(response)
              if (response.response == 0) {
                myWindow.webContents.executeJavaScript("\n                                        if (cachedText == document.getElementById(\"editor_input\").value) {\n                                            require('electron').ipcRenderer.send(\"file_done\")\n                                        } else {\n                                            require(\"electron\").remote.dialog.showMessageBox(null, {\n                                                type: \"question\",\n                                                buttons: [\"Save\", \"Don't Save\", \"Cancel\"],\n                                                defaultId: 0,\n                                                title: \"edit - Unsaved File\",\n                                                message: \"You have unsaved file, do you want to save them?\"\n                                            }).then((response) => {\n                                                if (response.response == 0) {\n                                                    require(\"electron\").remote.dialog.showSaveDialog(null, {title: \"Save File\", buttonLabel: \"Save file\", defaultPath: \"default.txt\"}).then((fileName) => {\n                                                        require(\"fs\").writeFile(fileName.filePath, document.getElementById(\"editor_input\").value, (error) => {\n                                                            if (error) {\n                                                                //alert(\"An error ocurred writing the file:\", error.message)\n                                                            } else {\n                                                                cachedText = document.getElementById(\"editor_input\").value\n                                                                require('electron').ipcRenderer.send(\"file_done\")\n                                                            }\n                                                        })\n                                                    })\n                                                } else if (response.response == 1) {\n                                                    require('electron').ipcRenderer.send(\"file_done\")\n                                                } else if (response.response == 2) {}\n                                            })\n                                        }\n                                    ");

                require("electron").ipcMain.on("file_done", function () {
                  myWindow.hide();
                  myWindow.setAlwaysOnTop(true);

                  if (process.platform == "win32") {
                    version = 1;
                  }

                  if (process.platform == "linux") {
                    version = 0;
                  }

                  myWindow.webContents.downloadURL(data_[0].assets[version].browser_download_url);
                });
              } else if (response.response == 1) {
                myWindow.show();
                myWindow.setAlwaysOnTop(false);
                test_autoRecovery();
              }
            });
          } else {
            myWindow.show();
            myWindow.setAlwaysOnTop(false);
            test_autoRecovery();

            if (userAsked) {
              require("electron").dialog.showMessageBox(myWindow, {
                type: "info",
                message: "There is currently no update avaliable",
                title: "edit - Update"
              });
            } else {
              myWindow.show();
              myWindow.setAlwaysOnTop(false);
            }
          }
        } else {
          myWindow.show();
          myWindow.setAlwaysOnTop(false);
          test_autoRecovery();

          if (userAsked) {
            require("electron").dialog.showMessageBox(myWindow, {
              type: "info",
              message: "There is currently no update avaliable",
              title: "edit - Update"
            });
          } else {
            myWindow.show();
            myWindow.setAlwaysOnTop(false);
          }
        }
        /*if (process.platform == "win32") { version = 1 }
        if (process.platform == "linux") { version = 0 }
        myWindow.webContents.downloadURL(data_[0].assets[version].browser_download_url)*/
        //-- For testing only

      })["catch"](function (err) {
        checkForUpdateProgressBar.setCompleted();

        require("electron").dialog.showMessageBox(myWindow, {
          title: "edit - Unable to check for update",
          message: "edit was unable to check for update, detail:\n".concat(err),
          buttons: ["Try again", "Cancel"],
          noLink: true
        }).then(function (response) {
          if (response.response == 0) {
            checkForUpdate(false);
          } else {
            myWindow.show();
            myWindow.setAlwaysOnTop(false);
          }
        });
      });
    }
  }
});