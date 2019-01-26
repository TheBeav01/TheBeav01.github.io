//Represents a save someone might have.
var save = {
    gameVersion : "0.01.01",
    gold : gold,
    workers : workers,
    maxWorkers : workers,
    availableWorkers : 0,
    workersRecieved : 0,
    workersInField : 0,
    workersRecruiting : 0,


    //Encoding ends here
    workersUnlocked : false,
    genChance : 0.5*workers,

}
var saveString = "";
var isImporting = false;
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
    Log(atob(stringToDecode));
    save = JSON.parse(atob(stringToDecode));
    Log(save.availableWorkers + " Available workers (after iteration)");
    if(save.workers > 0) {
        unlockWorker(1);
        
    }
    GPS = Number.parseInt(save.workers);
    adjustLabel("T1_1", "Town info: " + save.availableWorkers + " available workers (Max: " + save.maxWorkers + ")")
    return loadString;
  }

  /**
   * Translates a variety of game features into a save string that will likely grow over time.
   */
function encodeSave() {
    console.log(JSON.stringify(save));
    save.gold = Number.parseInt(gold);
    var encString = JSON.stringify(save);
    var ret = btoa(encString);
    Log("Test: " + ret);
    return ret;
  }
/**
 * Saves the game
 */
function SaveGame() {
    saveString = encodeSave();
    Log("SS: " + saveString);
    save.gold = gold;
    setCookie("save",saveString,365);
    LayoutCloseOverflowDropdown();
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
    LayoutCloseOverflowDropdown();
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
      LayoutCloseOverflowDropdown();
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
      Log(save);
    }
  }