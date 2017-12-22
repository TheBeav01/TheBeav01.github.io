//Represents a save someone might have.
var save = {
    gold : gold,
    gameVersion : "0.01",
    workers : workers,
    workersUnlocked : false,
    genChance : 0.5*workers,
    maxWorkers : workers,
    availableWorkers : 0,
}
var saveString = "";
var isImporting = false;
var splitter = '|'
/**
 * Simple getter. Gets the save just in case it is needed elsewhere.
 */
function getSave() {
    return save;
}

/**
 * Translates the string from a series of ints and '|' to something that is implementable by the game.
 * As the creator is too lazy to properly implement a base-32 string, the '|' acts as a splitter for the various fields.
 * @param {*} stringToDecode The save string retrieved from the cookie 
 */
function decodeSave(stringToDecode) {
    var loadString = stringToDecode;
    var saveArr = loadString.split("|");
    save.gameVersion = saveArr[0];
    save.gold = saveArr[1];
    save.workers = saveArr[2];
    if(save.workers > 0) {
        unlockWorker();
    }
    GPS = Number.parseInt(save.workers);
    console.log(save.gold + " " + save.workers);
    if(saveArr[1] === "NaN") {
        // console.log("Boop");
        window.alert("Your save is compromised, sadly. Resetting gold to zero...");
        save.gold = 0;
        gold = 0;
    }
    return loadString;
  }

  /**
   * Translates a variety of game features into a save string that will likely grow over time.
   */
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
/**
 * Saves the game
 */
function SaveGame() {
    saveString = encodeSave();
    console.log("SG: " + save.gold + " Gold: " + gold);
    save.gold = gold;
    setCookie("save",saveString,365);
  }
  /**
   * Imports the game. Doesn't do anything of note ATM
   */
  function Import() {
    isImporting = true;
    var export_para = document.getElementById("exP");
    var tb_div = document.getElementById("Export_div");
    adjustLabel("export_field", "");
    tb_div.style.visibility="visible";
    export_para.style.paddingRight = "50px"
    export_para.innerHTML = "Import a save here";
  }
  /**
   * Exports the game into a save string that is copied to the clipboard. Unlike import, this does something
   */
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
  /**
   * Closes the export div so you can keep playing
   */
  function closeExportField() {
    var div = document.getElementById("Export_div");
    var textField = document.getElementById("export_field");
    div.style.visibility = "hidden";
    if(isImporting === true) {
      var save = textField.textContent;
      console.log(save);
    }
  }