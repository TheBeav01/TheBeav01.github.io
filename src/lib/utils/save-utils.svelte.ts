import { save, saveGame } from "../save/gameSave.svelte";

/**
 * Translates the string from a series of ints and '|' to something that is implementable by the game.
 * As the creator is too lazy to properly implement a base-32 string, the '|' acts as a splitter for the various fields.
 * @param {*} stringToDecode The save string retrieved from the cookie 
 */
export function decodeSave(stringToDecode: string) {
    saveGame(JSON.parse(atob(stringToDecode)))
    return stringToDecode;
  }

  /**
   * Translates a variety of game features into a save string that will likely grow over time.
   */
function encodeSave() {
    var encString = JSON.stringify(save);
    var ret = btoa(encString);
    return ret;
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
    }
  }

  function printSS() {
    encodeSave();
  }

  function cleanSave() {
    if(save.worldNum == 0) {
      save.maxWorkers = 0;
      save.availableWorkers = 10;
      save.workersRecieved = 0;
      save.workersInField = 0;
      save.workersRecruiting = 0;
    }
    save.upgradesPos = 0;
    setResource("Gold",0);
    save.resourcesOwned = resourceList;
    UL1 = false;
  }