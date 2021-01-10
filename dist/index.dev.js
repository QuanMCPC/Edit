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

app.whenReady().then(function () {
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
    icon: "./icon.ico"
  });
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
  var startUpdate = false,
      version = 0;

  var fetch = require("electron-fetch")["default"];

  myWindow.webContents.session.on('will-download', function (event, item, webContents) {
    // Set the save path, making Electron not to prompt a save dialog.
    item.setSavePath(__dirname + "/update.zip");
    var progressBar = new ProgressBar({
      indeterminate: false,
      text: 'Downloading the latest version of edit...'
    });
    item.on('updated', function (event, state) {
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
        text: 'Extracting data...'
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
          fetch("https://api.github.com/repos/QuanMCPC/Edit/releases").then(function (data) {
            return data.json();
          }).then(function (data_) {
            versionNumber = data_[0].tag_name.replace("v", "");

            require("fs-extra").move("./edit-".concat(os, "-").concat(versionNumber), "./", {
              overwrite: true
            }).then(function () {
              console.log("File moved!");

              require("fs-extra").remove("./edit-".concat(os, "-").concat(versionNumber)).then(function () {
                console.log("File deleted!");

                require("fs-extra").remove("./update.zip").then(function () {
                  console.log("Yay!");

                  require("electron").dialog.showMessageBox(new BrowserWindow({
                    show: false,
                    alwaysOnTop: true
                  }), {
                    noLink: true,
                    type: "info",
                    title: "edit - Update finished",
                    message: "The update installed successfuully! The program will stop now"
                  }).then(function () {
                    setTimeout(function () {
                      require("electron").app.quit();
                    }, 2000);
                  });
                })["catch"](function (err) {
                  console.log("What happened: ", err);
                });
              });
            })["catch"](function (err) {
              require("electron").dialog.showMessageBox(null, {
                message: err
              });

              console.log(err);
            });
          });
        });
        unzip.on("progress", function (fileIndex, fileCount) {
          progressBar1.value = (fileIndex + 1) / fileCount * 100;
          progressBar1.detail = "Extracted file ".concat(fileIndex + 1, " of ").concat(fileCount);
          console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
        });
        unzip.extract({
          path: __dirname
        });
      } else {
        console.log("Download failed: ".concat(state));
      }
    });
  });

  function checkForUpdate(userAsked) {
    console.log("Checking for update");
    fetch("https://api.github.com/repos/QuanMCPC/Edit/releases").then(function (data) {
      return data.json();
    }).then(function (data_) {
      if (!data_[0].prerelease) {
        if (require("electron").app.getVersion().split(".").splice(0, 2).join(".") !== data_[0].tag_name.replace("v", "")) {
          require("electron").dialog.showMessageBox(null, {
            noLink: true,
            type: "question",
            buttons: ["Yes", "Later"],
            defaultId: 0,
            title: "edit - Update",
            message: "Update is avaliable! Would you like to install it now?"
          }).then(function (response) {
            if (response.response == 0) {
              if (process.platform == "win32") {
                version = 1;
              }

              if (process.platform == "linux") {
                version = 0;
              }

              myWindow.webContents.downloadURL(data_[0].assets[version].browser_download_url);
            }
          });
        } else {
          if (userAsked) {
            require("electron").dialog.showMessageBox(null, {
              type: "info",
              message: "There is currently no update avaliable",
              title: "edit - Update"
            });
          }
        }
      } else {
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

    });
  }

  checkForUpdate(false);
  ipcMain.on("checkUpdate", function (_data) {
    console.log("A");
  });
});