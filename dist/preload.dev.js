"use strict";

var _require = require("electron"),
    remote = _require.remote;

var _require2 = require("./menu-function"),
    getCurrentWindow = _require2.getCurrentWindow,
    openMenu = _require2.openMenu,
    minimizeWindow = _require2.minimizeWindow,
    unmaximizeWindow = _require2.unmaximizeWindow,
    maxUnmaxWindow = _require2.maxUnmaxWindow,
    isWindowMaximized = _require2.isWindowMaximized,
    closeWindow = _require2.closeWindow;
/*const {
    editor_about,
    editor_about_close,
    editor_cancel_find,
    editor_cancel_gotoline,
    editor_cancel_load,
    editor_cancel_replace,
    editor_cancel_save,
    editor_copy_text,
    editor_cut_text,
    editor_exit,
    editor_find,
    editor_find1,
    editor_find2,
    editor_find3,
    editor_goto,
    editor_gotoline,
    editor_load1,
    editor_new,
    editor_open,
    editor_paste_text,
    editor_redo_text,
    editor_replace,
    editor_replace1,
    editor_replace2,
    editor_replace_find_replace,
    editor_save,
    editor_save1,
    editor_search_with_google,
    editor_selectall_text,
    editor_td_text,
    editor_undo_text,
    exit_edit
} = require("./main")*/


window.addEventListener("DOMContentLoaded", function () {
  window.getCurrentWindow = getCurrentWindow;
  window.openMenu = openMenu;
  window.minimizeWindow = minimizeWindow;
  window.unmaximizeWindow = unmaximizeWindow;
  window.maxUnmaxWindow = maxUnmaxWindow;
  window.isWindowMaximized = isWindowMaximized;
  window.closeWindow = closeWindow;
  /*window.editor_about = editor_about;
  window.editor_about_close = editor_about_close;
  window.editor_cancel_find = editor_cancel_find;
  window.editor_cancel_gotoline = editor_cancel_gotoline;
  window.editor_cancel_load = editor_cancel_load;
  window.editor_cancel_replace = editor_cancel_replace;
  window.editor_cancel_save = editor_cancel_save;
  window.editor_copy_text = editor_copy_text;
  window.editor_cut_text = editor_cut_text;
  window.editor_exit = editor_exit;
  window.editor_find = editor_find;
  window.editor_find1 = editor_find1;
  window.editor_find2 = editor_find2;
  window.editor_find3 = editor_find3;
  window.editor_goto = editor_goto;
  window.editor_gotoline = editor_gotoline;
  window.editor_load1 = editor_load1;
  window.editor_new = editor_new;
  window.editor_open = editor_open;
  window.editor_paste_text = editor_paste_text;
  window.editor_redo_text = editor_redo_text;
  window.editor_replace = editor_replace;
  window.editor_replace1 = editor_replace1;
  window.editor_replace2 = editor_replace2;
  window.editor_replace_find_replace = editor_replace_find_replace;
  window.editor_save = editor_save;
  window.editor_save1 = editor_save1;
  window.editor_search_with_google = editor_search_with_google;
  window.editor_selectall_text = editor_selectall_text;
  window.editor_td_text = editor_td_text;
  window.editor_undo_text = editor_undo_text;
  window.exit_edit = exit_edit;*/
});