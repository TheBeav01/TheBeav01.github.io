var save = {
    gold : gold,
    gameVersion : "0.01",
}
var saveString;
var isImporting;
function getSave() {
    return save;
}

function decodeSave(stringToDecode) {
    var loadString = stringToDecode;
    save.gold = stringToDecode.substring(0,3);
    console.log("LS: " + loadString);
    gold = Number.parseInt(save.gold);
    return loadString;
  }

function encodeSave() {
    var g = gold
    console.log(g);
    return g;
  }

function SaveGame() {
    saveString = encodeSave();
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
  