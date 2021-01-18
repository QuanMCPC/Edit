"use strict";

var _require = require("electron"),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow,
    ipcMain = _require.ipcMain;

var path = require("path");

var _require2 = require("./menu"),
    menu = _require2.menu;

var isWindows = process.platform === "win32";

var DZip = require("decompress-zip");

var ProgressBar = require('electron-progressbar');

var updateFinished = false,
    global_data_;
app.whenReady().then(function () {
  if (require("fs").existsSync(path.normalize(process.execPath + "/.." + "continue-update.edit_file"))) {
    require("fs").readFile(path.normalize(process.execPath + "/.." + "continue-update.edit_file"), function (_err, data) {
      require("fs-extra").remove(path.normalize(process.execPath + "/.." + "/../edit-".concat(process.platform, "-").concat(data))).then(function () {
        require("electron").dialog.showMessageBox(new BrowserWindow({
          show: false,
          alwaysOnTop: true
        }), {
          noLink: true,
          type: "info",
          title: "edit - Update finished",
          message: "The update installed sucessfully!"
        }).then(function () {
          updateFinished = true;
        });
      });
    });
  }

  var myWindow = new BrowserWindow({
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
    myWindow.setAlwaysOnTop(false);
    myWindow.show();
    updateFinished = false;
  }

  myWindow.webContents.executeJavaScript("console.log(\"".concat(path.normalize(process.execPath + "/.."), "\")"));
  myWindow.webContents.executeJavaScript("var cachedText = \"\"");
  myWindow.loadFile("index.html");
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
  });
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
        console.log('Download is interrupted but can be resumed');
        item.resume();
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused');
        } else {
          progressBar.value = Math.floor(item.getReceivedBytes() / item.getTotalBytes() * 100);
          progressBar.detail = "Received bytes: ".concat(item.getReceivedBytes(), " bytes / ").concat(item.getTotalBytes(), " bytes");
          console.log("Received bytes: ".concat(item.getReceivedBytes(), " / ").concat(item.getTotalBytes()));
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
        unzip.on("error", function (error) {
          console.log(error);
        });
        unzip.on("extract", function (log) {
          console.log("Finish:", log);
          var os = version ? "win32" : "linux";
          var versionNumber = "";
          var data_ = global_data_;
          versionNumber = data_[0].tag_name.replace("v", "");

          require("fs").unlink(item.getSavePath().replace(/\\/g, "/"), function (err) {
            if (err) {
              myWindow.webContents.executeJavaScript("console.log(\"".concat(err, "\")"));
            }
          });

          myWindow.webContents.executeJavaScript("console.log(\"".concat(app.getAppPath(), "\", \"").concat(path.normalize(process.execPath + "/.."), "\")")); //myWindow.focus()

          if (os == "win32") {
            var path1 = path.normalize(process.execPath + "/.." + "/../edit-".concat(os, "-").concat(versionNumber, "/edit.exe"));
            var path2 = path.normalize(process.execPath + "/.." + "/../edit-".concat(os, "-").concat(versionNumber, "/continue-update.edit_file"));
            console.log(path1, path2);
            setTimeout(function () {
              require("electron").shell.openExternal("".concat(path1)).then(function () {
                require("fs").writeFile("".concat(path2), "".concat(require("electron").app.getVersion().split(".").splice(0, 2).join(".")), function () {
                  process.exit();
                });
              });
            }, 200);
          } else {
            var path3 = path.normalize(process.execPath + "/.." + "/../edit-".concat(os, "-").concat(versionNumber, "/edit"));
            var path4 = path.normalize(process.execPath + "/.." + "/../edit-".concat(os, "-").concat(versionNumber, "/continue-update.edit_file"));
            console.log(path3, path4);
            setTimeout(function () {
              require("electron").shell.openExternal("".concat(path3)).then(function () {
                require("fs").writeFile("".concat(path4), "".concat(require("electron").app.getVersion().split(".").splice(0, 2).join(".")), function () {
                  process.exit();
                });
              });
            }, 200);
          }
        });
        unzip.on("progress", function (fileIndex, fileCount) {
          progressBar1.value = (fileIndex + 1) / fileCount * 100;
          progressBar1.detail = "Extracted file ".concat(fileIndex + 1, " of ").concat(fileCount);
          console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
        });
        unzip.extract({
          path: path.normalize(process.execPath + "/.." + "/..")
        });
      } else {
        console.log("Download failed: ".concat(state));
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
    });
    console.log("Checking for update");
    fetch("https://api.github.com/repos/QuanMCPC/Edit/releases?no-cache=".concat(Math.round(Math.random() * 1000000))).then(function (data) {
      return data.json();
    }).then(function (data_) {
      global_data_ = data_;
      console.log(data_);
      checkForUpdateProgressBar.setCompleted();

      if (!data_[0].prerelease) {
        if (require("electron").app.getVersion().split(".").splice(0, 2).join(".") !== data_[0].tag_name.replace("v", "")) {
          require("electron").dialog.showMessageBox(myWindow, {
            noLink: true,
            type: "question",
            buttons: ["Yes", "Later"],
            defaultId: 0,
            title: "edit - Update",
            message: "Update is avaliable! Would you like to install it now?"
          }).then(function (response) {
            console.log(response);

            if (response.response == 0) {
              myWindow.webContents.executeJavaScript("\n                                    if (cachedText == document.getElementById(\"editor_input\").value) {\n                                        require('electron').ipcRenderer.send(\"file_done\")\n                                    } else {\n                                        require(\"electron\").remote.dialog.showMessageBox(null, {\n                                            type: \"question\",\n                                            buttons: [\"Save\", \"Don't Save\", \"Cancel\"],\n                                            defaultId: 0,\n                                            title: \"edit - Unsaved File\",\n                                            message: \"You have unsaved file, do you want to save them?\"\n                                        }).then((response) => {\n                                            if (response.response == 0) {\n                                                require(\"electron\").remote.dialog.showSaveDialog(null, {title: \"Save File\", buttonLabel: \"Save file\", defaultPath: \"default.txt\"}).then((fileName) => {\n                                                    require(\"fs\").writeFile(fileName.filePath, document.getElementById(\"editor_input\").value, (error) => {\n                                                        if (error) {\n                                                            //alert(\"An error ocurred writing the file:\", error.message)\n                                                        } else {\n                                                            cachedText = document.getElementById(\"editor_input\").value\n                                                            require('electron').ipcRenderer.send(\"file_done\")\n                                                        }\n                                                    })\n                                                })\n                                            } else if (response.response == 1) {\n                                                require('electron').ipcRenderer.send(\"file_done\")\n                                            } else if (response.response == 2) {}\n                                        })\n                                    }\n                                ");

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
            }
          });
        } else {
          myWindow.show();
          myWindow.setAlwaysOnTop(false);

          if (userAsked) {
            require("electron").dialog.showMessageBox(null, {
              type: "info",
              message: "There is currently no update avaliable",
              title: "edit - Update"
            });
          }
        }
      } else {
        myWindow.show();
        myWindow.setAlwaysOnTop(false);

        if (userAsked) {
          require("electron").dialog.showMessageBox(null, {
            type: "info",
            message: "There is currently no update avaliable",
            title: "edit - Update"
          });
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

  checkForUpdate(false);
});