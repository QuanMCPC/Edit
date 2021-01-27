window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("close-btn").addEventListener("click", () => {
        window.close_settings()
    })
})
var settings;
require("fs").readFile(require("path").join(__dirname, "settings.json"), { encoding: "utf-8" }, (_err, data) => {
    settings = JSON.parse(data)
    document.getElementById("width").value = settings.width
    document.getElementById("height").value = settings.height
    document.getElementById("minWidth").value = settings.minWidth
    document.getElementById("minHeight").value = settings.minHeight
    document.getElementById("noUpdateOnStartup").checked = settings.noUpdateOnStartup
    document.getElementById("unresizable").checked = settings.unResizable
    document.getElementById("backgroundTextColor").value = settings.backgroundTextColor
    document.getElementById("textColor").value = settings.textColor
    document.getElementById("autoRecovery").checked = settings.autoRecovery
    document.getElementById("autoRecoveryInterval").value = settings.autoRecoveryInterval
    document.getElementById("showInfoBar").checked = settings.showInfoBar
    document.getElementById("apply").addEventListener("click", () => {
        settings.width = Number(document.getElementById("width").value)
        settings.height = Number(document.getElementById("height").value)
        settings.minWidth = Number(document.getElementById("minWidth").value)
        settings.minHeight = Number(document.getElementById("minHeight").value)
        settings.noUpdateOnStartup = document.getElementById("noUpdateOnStartup").checked
        settings.unResizable = document.getElementById("unresizable").checked
        settings.backgroundTextColor = document.getElementById("backgroundTextColor").value
        settings.textColor = document.getElementById("textColor").value
        settings.autoRecovery = document.getElementById("autoRecovery").checked
        settings.autoRecoveryInterval = Number(document.getElementById("autoRecoveryInterval").value)
        settings.showInfoBar = document.getElementById("showInfoBar").checked
        console.log(JSON.stringify(settings))
        require("fs").writeFile(require("path").join(__dirname, "settings.json"), JSON.stringify(settings), () => {
            require("electron").ipcRenderer.send("reload_settings")
        })
    })
})