var save = {
    gold : gold,
    gameVersion : "0.01",
    workers : workers,
    workersUnlocked : false,
}
var saveString = "";
var isImporting = false;
var version = "0.01";
var splitter = '|'
function getSave() {
    return save;
}

function decodeSave(stringToDecode) {
    var loadString = stringToDecode;
    var saveArr = loadString.split("|");
    save.gameVersion = saveArr[0];
    save.gold = saveArr[1];
    save.workers = saveArr[2];
    GPS = Number.parseInt(save.workers);
    console.log(save.gold + " " + save.workers);
    if(saveArr[1] === "NaN") {
        console.log("Boop");
        window.alert("Your save is compromised, sadly. Resetting gold to zero...");
        save.gold = 0;
        gold = 0;
    }
    return loadString;
  }

function encodeSave() {
    if(g === NaN) {
        console.log("NaN detected");
    }
    var g = Number.parseInt(gold);
    var w = workers;
    if(w === undefined) {
        w = 0;
    }
    console.log("Encoded Save: " + version + "|" + g + "|" + w + "|");
    return version + "|" + g + "|" + w + "|";
  }

function SaveGame() {
    saveString = encodeSave();
    save.gold = gold;
    setCookie("save",saveString,365);
  }
  function Import() {
    isImporting = true;
    var export_para = document.getElementById("exP");
    var tb_div = document.getElementById("Export_div");
    adjustLabel("export_field", "");
    tb_div.style.visibility="visible";
    export_para.style.paddingRight = "50px"
    export_para.innerHTML = "Import a save here";
  }
  function Export() {
      isImporting = false;
      var export_para = document.getElementById("exP");
      export_para.innerHTML = "Your save has been copied to the clipboard. Store this somewhere useful."
      SaveGame();
      adjustLabel("export_field", saveString);
      var tb_div = document.getElementById("Export_div");
      tb_div.style.visibility="visible";
      document.getElementById("export_field").select();
      document.execCommand("copy");
  }
  function closeExportField() {
    var div = document.getElementById("Export_div");
    var textField = document.getElementById("export_field");
    div.style.visibility = "hidden";
    if(isImporting === true) {
      var save = textField.textContent;
      console.log(save);
    }
  }