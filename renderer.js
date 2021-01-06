window.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menu-btn");
    const minimizeButton = document.getElementById("minimize-btn");
    const maxUnmaxButton = document.getElementById("max-unmax-btn");
    const closeButton = document.getElementById("close-btn");
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
        if (window.isWindowMaximized()) {
            document.getElementById("max-unmax-btn").firstElementChild.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M3 5v9h9V5H3zm8 8H4V6h7v7z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h1V4h7v7h-1v1h2V3H5v2z"/></svg>`;
        } else {
            document.getElementById("max-unmax-btn").firstElementChild.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M3 3v10h10V3H3zm9 9H4V4h8v8z"/></svg>`;
        }
    });
    closeButton.addEventListener("click", e => {
        window.closeWindow();
    });
});