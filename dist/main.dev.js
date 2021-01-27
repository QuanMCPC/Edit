"use strict";

var start_1 = 0;
window.count_1 = 0;
var start_2 = 0;
window.count_2 = 0;
var start_3 = 0;
var v3 = 1;
window.console_output = true;
var open_window = false;
var save_window = false;

function editor_replace_find_replace() {
  window.start_1 = 0;
  window.start_2 = 0;
  window.start_3 = 0;
  window.count_1 = 0;
  window.count_2 = 0;
}

function editor_cancel_gotoline() {
  var close = document.querySelector("#editor_gotoline");
  close.style.display = "none";
  document.querySelector("#editor_overlay").style.display = "none";
}

function editor_close_settings() {
  var close = document.getElementById("editor_settings");
  close.style.display = "none";
  document.querySelector("#editor_overlay").style.display = "none";
}

function editor_goto() {
  var a = document.getElementById("editor_input");
  var b = document.getElementById("editor_goto_input").value;
  selectTextareaLine3(a, b);
}

function editor_about() {
  var open = document.querySelector("#editor_about");
  open.style.display = "block";
  document.querySelector("#editor_overlay").style.display = "block";
}

function editor_about_close() {
  var close = document.querySelector("#editor_about");
  close.style.display = "none";
  document.querySelector("#editor_overlay").style.display = "none";
}

function editor_new() {
  var check = document.getElementById("editor_input").value;

  if (check == '') {
    document.getElementById("editor_input").value = '';
    v3++;
    document.getElementById("editor_filename").innerHTML = "UNTITLED " + v3;
  } else {
    var confirm1 = confirm("There is some text in the editor. If you already downloaded the document, press Ok to create new document, if not, press Cancel, download the document then press Ok to create new document");

    if (confirm1) {
      document.getElementById("editor_input").value = '';
      v3++;
      document.getElementById("editor_filename").innerHTML = "UNTITLED " + v3;
    } else {
      throw new Error("This is not an error");
    }
  }
}

function editor_cancel_replace() {
  var close = document.querySelector("#editor_replace");
  close.style.display = "none";
  document.querySelector("#editor_overlay").style.display = "none";
  window.start_1 = 0;
  window.start_2 = 0;
  window.start_3 = 0;
  window.count_1 = 0;
  window.count_2 = 0;
}

function editor_replace2() {
  if (document.getElementById("editor_find_replace_name").value !== "") {
    var a = confirm("Are you sure that you want to replace ALL OCCURRENCES?");

    if (a) {
      var search = document.getElementById("editor_find_replace_name").value;
      var replace_with = document.getElementById("editor_replace_find_name").value;
      var input = document.getElementById("editor_input").value;
      var output = input.split(search).join(replace_with);
      document.getElementById("editor_input").value = output;
    } else {
      throw new Error("This is not an error");
    }
  } else {
    alert("Do not leave the search box empty!");
    throw new Error("This is not an error");
  }
}

function editor_replace1() {
  if (document.getElementById("editor_find_replace_name").value !== "") {
    editor_find3();
    var el = document.getElementById("editor_input");
    var el_1 = document.getElementById("editor_replace_find_name").value;
    replaceSelectedText(el, el_1);
  } else {
    alert("Do not leave the search box empty!");
    throw new Error("This is not an error");
  }
}

function getInputSelection(el) {
  var start = 0,
      end = 0,
      normalizedValue,
      range,
      textInputRange,
      len,
      endRange;

  if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    range = document.selection.createRange();

    if (range && range.parentElement() == el) {
      len = el.value.length;
      normalizedValue = el.value.replace(/\r\n/g, "\n"); // Create a working TextRange that lives only in the input

      textInputRange = el.createTextRange();
      textInputRange.moveToBookmark(range.getBookmark()); // Check if the start and end of the selection are at the very end
      // of the input, since moveStart/moveEnd doesn't return what we want
      // in those cases

      endRange = el.createTextRange();
      endRange.collapse(false);

      if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
        start = end = len;
      } else {
        start = -textInputRange.moveStart("character", -len);
        start += normalizedValue.slice(0, start).split("\n").length - 1;

        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
          end = len;
        } else {
          end = -textInputRange.moveEnd("character", -len);
          end += normalizedValue.slice(0, end).split("\n").length - 1;
        }
      }
    }
  }

  return {
    start: start,
    end: end
  };
}

function replaceSelectedText(el, text) {
  var sel = getInputSelection(el),
      val = el.value;
  el.value = val.slice(0, sel.start) + text + val.slice(sel.end);
}

function editor_find1() {
  if (document.getElementById("editor_find_name").value !== "") {
    var sel = document.getElementById('editor_find_name');
    var tarea = document.getElementById('editor_input');
    selectTextareaLine(tarea, sel.value);
  } else {
    alert("Do not leave the search box empty!");
    throw new Error("This is not an error");
  }
}

function editor_find2() {
  if (document.getElementById("editor_find_replace_name").value !== "") {
    var sel = document.getElementById('editor_find_replace_name');
    var tarea = document.getElementById('editor_input');
    selectTextareaLine1(tarea, sel.value);
  } else {
    alert("Do not leave the search box empty!");
    throw new Error("This is not an error");
  }
}

function editor_find3() {
  var sel = document.getElementById('editor_find_replace_name');
  var tarea = document.getElementById('editor_input');
  selectTextareaLine2(tarea, sel.value);
}

function selectTextareaLine3(tarea, lineNum) {
  lineNum--; // array starts at 0

  if (lineNum > -1) {
    var lines = tarea.value.split("\n"); // calculate start/end

    var startPos = 0,
        endPos = tarea.value.length;

    for (var x = 0; x < lines.length; x++) {
      if (x == lineNum) {
        break;
      }

      startPos += lines[x].length + 1;
    }

    var endPos = lines[lineNum].length + startPos; // do selection
    // Chrome / Firefox

    if (typeof tarea.selectionStart != "undefined") {
      tarea.focus();
      tarea.selectionStart = startPos;
      tarea.selectionEnd = endPos;
      var textLines = tarea.value.substr(0, tarea.selectionStart).split("\n");
      var currentLineNumber = textLines.length;

      if (currentLineNumber >= 29) {
        var calc = (currentLineNumber - 29) * 15 + 30;
        tarea.scrollTop = calc;
      } else {
        tarea.scrollTop = 0;
      }

      return true;
    } // IE


    if (document.selection && document.selection.createRange) {
      tarea.focus();
      tarea.select();
      var range = document.selection.createRange();
      range.collapse(true);
      range.moveEnd("character", endPos);
      range.moveStart("character", startPos);
      range.select();
      return true;
    }

    return false;
  } else {
    alert("A line number can't be a negative number");
    return false;
  }
}

function selectTextareaLine2(tarea, word_1) {
  if (tarea.value.indexOf(word_1, window.start_3) > -1) {
    var words_1 = tarea.value.split(" "); // calculate start/end

    var _startPos_ = tarea.value.indexOf(word_1, window.start_3),
        _endPos_ = _startPos_ + word_1.length;

    if (typeof tarea.selectionStart != "undefined") {
      tarea.focus();
      tarea.selectionStart = _startPos_;
      tarea.selectionEnd = _endPos_;
      count_1++;
      window.start_3 = tarea.value.indexOf(word_1, window.start_3) + 1;
      var textLines = tarea.value.substr(0, tarea.selectionStart).split("\n");
      var currentLineNumber = textLines.length;

      if (currentLineNumber >= 29) {
        var calc = (currentLineNumber - 29) * 15 + 30;
        tarea.scrollTop = calc;
      } else {
        tarea.scrollTop = 0;
      }

      return true;
    }
  } else {
    alert("End of line reached!");
    throw new Error("Do not panic! This is not a error");
  } // IE


  if (document.selection && document.selection.createRange) {
    tarea.focus();
    tarea.select();
    var range = document.selection.createRange();
    range.collapse(true);
    range.moveEnd("character", endPos_1);
    range.moveStart("character", startPos_1);
    range.select();
    return true;
  }

  return false;
}

function selectTextareaLine(tarea, word_1) {
  if (tarea.value.indexOf(word_1, window.start_1) > -1) {
    var words_1 = tarea.value.split(" "); // calculate start/end

    var _startPos_2 = tarea.value.indexOf(word_1, window.start_1),
        _endPos_2 = _startPos_2 + word_1.length;

    if (typeof tarea.selectionStart != "undefined") {
      tarea.focus();
      tarea.selectionStart = _startPos_2;
      tarea.selectionEnd = _endPos_2;
      count_1++;
      window.start_1 = tarea.value.indexOf(word_1, window.start_1) + 1;
      var textLines = tarea.value.substr(0, tarea.selectionStart).split("\n");
      var currentLineNumber = textLines.length;

      if (currentLineNumber >= 29) {
        var calc = (currentLineNumber - 29) * 15 + 30;
        tarea.scrollTop = calc;
      } else {
        tarea.scrollTop = 0;
      }

      return true;
    }
  } else {
    if (document.getElementById("editor_wrap_around").checked) {
      window.start_1 = 0;
    } else {
      alert("End of line reached!");
      throw new Error("Do not panic! This is not a error");
    }
  } // IE


  if (document.selection && document.selection.createRange) {
    tarea.focus();
    tarea.select();
    var range = document.selection.createRange();
    range.collapse(true);
    range.moveEnd("character", endPos_1);
    range.moveStart("character", startPos_1);
    range.select();
    return true;
  }

  return false;
}

function selectTextareaLine1(tarea, word_2) {
  if (tarea.value.indexOf(word_2, window.start_2) > -1) {
    var words_2 = tarea.value.split(" "); // calculate start/end

    var _startPos_3 = tarea.value.indexOf(word_2, window.start_2),
        _endPos_3 = _startPos_3 + word_2.length;

    if (typeof tarea.selectionStart != "undefined") {
      tarea.focus();
      tarea.selectionStart = _startPos_3;
      tarea.selectionEnd = _endPos_3;
      count_2++;
      window.start_2 = tarea.value.indexOf(word_2, window.start_2) + 1;
      var textLines = tarea.value.substr(0, tarea.selectionStart).split("\n");
      var currentLineNumber = textLines.length;

      if (currentLineNumber >= 29) {
        var calc = (currentLineNumber - 29) * 15 + 30;
        tarea.scrollTop = calc;
      } else {
        tarea.scrollTop = 0;
      }

      return true;
    }
  } else {
    if (document.getElementById("editor_wrap_around1").checked) {
      window.start_2 = 0;
    } else {
      alert("End of line reached!");
      throw new Error("Do not panic! This is not a error");
    }
  } // IE


  if (document.selection && document.selection.createRange) {
    tarea.focus();
    tarea.select();
    var range = document.selection.createRange();
    range.collapse(true);
    range.moveEnd("character", endPos_2);
    range.moveStart("character", startPos_2);
    range.select();
    return true;
  }

  return false;
}

function editor_cancel_find() {
  var close = document.querySelector("#editor_find");
  close.style.display = "none";
  document.querySelector("#editor_overlay").style.display = "none";
  window.start_1 = 0;
  window.start_2 = 0;
  window.start_3 = 0;
  window.count_1 = 0;
  window.count_2 = 0;
}

function editor_load1() {
  var fileToLoad = document.getElementById("editor_open_name").files[0];
  var fileReader = new FileReader();

  fileReader.onload = function (fileLoadedEvent) {
    var textFromFileLoaded = fileLoadedEvent.target.result;
    document.getElementById("editor_input").value = textFromFileLoaded;
  };

  fileReader.readAsText(fileToLoad, "UTF-8");
  var cancel = document.querySelector("#editor_open");
  cancel.style.display = "none";
  document.querySelector("#editor_overlay").style.display = "none"; //document.getElementById("editor_filename").innerHTML = "File: " + document.getElementById("editor_open_name").value.replace(/fakepath/, '');

  var fullPath = document.getElementById('editor_open_name').value;

  if (fullPath) {
    var startIndex = fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/');
    var filename = fullPath.substring(startIndex);

    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
      filename = filename.substring(1);
    }

    document.getElementById("editor_filename").innerHTML = "File: " + filename;
  }
}

function editor_save1() {
  var textToSave = document.getElementById("editor_input").value;
  var textToSaveAsBlob = new Blob([textToSave], {
    type: "text/plain"
  });
  var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

  if (document.getElementById("editor_save_name").value == "") {
    var fileNameToSaveAs = "DEFAULT";
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  } else {
    var fileNameToSaveAs = document.getElementById("editor_save_name").value;
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  var cancel1 = document.querySelector("#editor_save");
  cancel1.style.display = "none";
  document.getElementById("editor_filename").innerHTML = "File: " + document.getElementById("editor_save_name").value;
  document.querySelector("#editor_overlay").style.display = "none";
}

function destroyClickedElement(event) {
  document.body.removeChild(event.target);
}