var save = {
    gold : gold,
    gameVersion : "0.01",
}
var saveString;
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
    return 0;
  }
  function Export() {
      SaveGame();
      adjustLabel("export_field", saveString);
      var tb_div = document.getElementById("Export_div");
      tb_div.style.visibility="visible";
      document.getElementById("export_field").select();
      document.execCommand("copy");
  }
  