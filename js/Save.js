//Represents a save someone might have.
var save = {
    gameVersion : "0.01",
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
var encSave = {
    version : "",
    gold : 0,
    workers : 0,
    maxWorkers : 0,
    availableWorkers : 0,
    workersRecieved : 0,
    workersInField : 0,
    workersRecruiting : 0,
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
    var saveArr = loadString.split("|");
    var decProp = Object.keys(save);
    for(var i = 0; i < saveArr.length-1; i++) {
        var propToLoad = decProp[i];
        save[propToLoad] = saveArr[i];
        Log(propToLoad + " ---> " + saveArr[i]);
    }
    Log(save.availableWorkers + " Available workers (after iteration)");
    if(save.workers > 0) {
        unlockWorker(1);
        
    }
    GPS = Number.parseInt(save.workers);
    if(saveArr[1] === "NaN") {
        // Log("Boop");
        window.alert("Your save is compromised, sadly. Resetting gold to zero...");
        save.gold = 0;
        gold = 0;
    }
    if(saveArr[4] < 0) {
        save.availableWorkers = Math.abs(saveArr[4]);
    }
    adjustLabel("T1_1", "Town info: " + save.availableWorkers + " available workers (Max: " + save.maxWorkers + ")")
    return loadString;
  }

  /**
   * Translates a variety of game features into a save string that will likely grow over time.
   */
function encodeSave() {
    var encString = "";
    if(gold === NaN) {
        Log("NaN detected");
    }
    var prop = Object.keys(encSave);
    save.gold = Number.parseInt(save.gold);
    save.version = version;
    for(var i = 0; i < prop.length; i++) {
        var encProp = prop[i];
        Log((save[encProp] === encSave[encProp]) + " Save: " + save[encProp] + " Enc save: " + encSave[encProp]);
        encSave[encProp] = save[encProp];
        var encString = encString + encSave[encProp] + "|";
    }
    if(encSave.workers === undefined) {
        encSave.workers = 0;
    }
    
    return encString;
  }
/**
 * Saves the game
 */
function SaveGame() {
    saveString = encodeSave();
    Log("SS: " + saveString);
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
      Log(save);
    }
  }