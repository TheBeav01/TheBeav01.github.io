var save = {
    gold : gold,
}
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
    var saveString = encodeSave();
    setCookie("save",saveString,365);
  }
  