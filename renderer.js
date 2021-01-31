const { remote } = require("electron");
window.addEventListener("DOMContentLoaded", () => {
    //console.log(remote.getCurrentWindow(), remote.getCurrentWindow())
    var a_ = require("node-localstorage").LocalStorage;
    var localStorage_ = new a_("autoRecovery")
    var settings
    require("electron").ipcRenderer.on("reload_settings_1", () => {
        loadSettings_(true)
    })
    function loadSettings_(asked) {
        require("fs").readFile(require("path").join(__dirname, "settings.json"), { encoding: "utf-8" }, (_err, data) => {
            settings = JSON.parse(data)
            if (settings.characterLimit > 0) {
                document.getElementById("editor_input").setAttribute("maxlength", settings.characterLimit)
                document.getElementById("letter_count_1").innerHTML = ` / ${settings.characterLimit}`
            } else {
                document.getElementById("editor_input").removeAttribute("maxlength")
                document.getElementById("letter_count_1").innerHTML = ""
            }
            if (settings.autoRecovery) {
                if (settings.autoRecoveryInterval <= 0) {
                    document.getElementById("editor_input").addEventListener("keydown", () => {
                        if (cachedText !== document.getElementById("editor_input").value) {
                            localStorage_.setItem("autoRecoveryContent", document.getElementById("editor_input").value)
                        }
                    })
                } else {
                    setInterval(() => {
                        if (cachedText !== document.getElementById("editor_input").value) {
                            localStorage_.setItem("autoRecoveryContent", document.getElementById("editor_input").value)
                            //console.log(localStorage_.getItem("autoRecoveryContent"))
                        } else {
                            localStorage_.removeItem("autoRecoveryContent")
                        }
                    }, settings.autoRecoveryInterval * 1000)
                }
            }
            //console.log(settings.showInfoBar)
            if (settings.showInfoBar) {
                document.getElementById("editor_info").style.display = "block"
                document.getElementById("editor_input").style.height = "calc(100% - 36px)"
                function removeItemAll(arr, value) {
                    var i = 0;
                    while (i < arr.length) {
                        if (arr[i] === value) {
                            arr.splice(i, 1);
                        } else {
                            ++i;
                        }
                    }
                    return arr;
                }
                document.getElementById("editor_input").addEventListener("input", (event) => {
                    input_input()
                })
                document.getElementById("editor_input").onkeyup = document.getElementById("editor_input").onmouseup = () => {input_keyup()}
                function input_input() {
                    document.getElementById('letter_count').innerHTML = document.getElementById('editor_input').value.length;
                    //removeItemAll(document.getElementById('editor_input').value.replace("\n", " ").trim().split(' '), "").length
                    var start = 0
                    document.getElementById('editor_input').value.split("\n").forEach(element => {
                        start = start + removeItemAll(element.trim().split(' '), "").length
                    });
                    document.getElementById('word_count').innerHTML = start
                    if (cachedText !== document.getElementById("editor_input").value) {
                        document.getElementById("current_state").innerHTML = " (Modified)";
                    } else {
                        document.getElementById("current_state").innerHTML = "";
                    }
                }
                function input_keyup() {
                    var textarea = document.getElementById("editor_input")
                    var textLines = textarea.value.substr(0, textarea.selectionStart).split("\n");
                    var currentLineNumber = textLines.length;
                    var currentColumnIndex = textLines[textLines.length-1].length;
                    //console.log("Current Line Number "+ currentLineNumber+" Current Column Index "+currentColumnIndex );
                    document.getElementById("line_count").innerHTML = currentLineNumber
                    document.getElementById("col_count").innerHTML = currentColumnIndex + 1
                }
                if (asked) { input_input(); input_keyup() }
            } else {
                document.getElementById("editor_info").style.display = "none"
                document.getElementById("editor_input").style.height = "calc(100% - 12px)"
            }
        })
    }
    loadSettings_(false)
    const menuButton = document.getElementById("menu-btn");
    const minimizeButton = document.getElementById("minimize-btn");
    const maxUnmaxButton = document.getElementById("max-unmax-btn");
    const closeButton = document.getElementById("close-btn");
    const title = document.getElementById("title")
    window.onresize = () => {
        window.innerWidth < 310 ? title.style.display = "none" : title.style.display = "block"
    }
    menuButton.addEventListener("mousedown", e => {
        e.preventDefault();
        e.stopPropagation();
        window.openMenu(e.x, e.y);
    });
    minimizeButton.addEventListener("click", e => {
        window.minimizeWindow();
    });
    maxUnmaxButton.addEventListener("click", e => {
        window.maxUnmaxWindow();
        //console.log("D")
    });
    remote.getCurrentWindow().on("maximize", () => {
        document.getElementById("max-unmax-btn").firstElementChild.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M3 5v9h9V5H3zm8 8H4V6h7v7z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h1V4h7v7h-1v1h2V3H5v2z"/></svg>`;
    })
    remote.getCurrentWindow().on("unmaximize", () => {
        document.getElementById("max-unmax-btn").firstElementChild.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M3 3v10h10V3H3zm9 9H4V4h8v8z"/></svg>`;
    })
    closeButton.addEventListener("click", e => {
        window.closeWindow();
    });
});