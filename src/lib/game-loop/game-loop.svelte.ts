import SaveObject from "../beans/save-object";
import { getCookieByKey, setCookie } from "../utils/cookie-utils";
import { saveGame, save } from "../save/gameSave.svelte";
import { decodeSave } from "../utils/save-utils.svelte";
let canAscend = false
export function load() {
  const saveString = getCookieByKey("save")
  if(saveString != "") {
    // Log("Save file exists");
    decodeSave(saveString);

    initGame();
    initResources();
    gameLoop(0)
    return

  }
  // TODO: Save
  saveGame();
  gameLoop(0);
}

let frameID = 0

/**
* The loop of this game. This runs via requestAnimationFrame(), 
* and a tick counter is kept for timekeeping purposes. It should run at 60 ticks per second
* @param {*} timeStamp Is the time that the frame was requested (in ms.)
*/
function gameLoop(timeStamp) {
  frameID = requestAnimationFrame(gameLoop);
  console.log(frameID)
}

/**
 * Initializes the game
 */
function initGame() { 
  var date = new Date();
  if(save.resourcesOwned[index].amt === undefined) {
    gold = 0;
    save.resourcesOwned[index].amt = 0;
  }
  adjustLabel("ManualGoldButton",save.resourcesOwned[index].amt);
  gold = save.resourcesOwned[index].amt;
  pushResourcesToLive();
  workers = getResourceAmt("Worker");
  // resourceList.push(save.resourcesOwned);
  // adjustLabel("TS2", "Current Time: " + getDate());
  // adjustLabel("UL1_label", "Workers: " + getResourceAmt("Worker"));
  // adjustUpgradeTooltips();
  unlockHandler();
}

/**
 * Handles unlocks at load or update.
 */
function unlockHandler() {
  var worker_button = document.getElementById("UL1");
  handleStoryMessagesAndUnlocks();
  handleOneTimeUnlocks();
  if((gold >= 25) && save.upgradesPos == 0)  {
      workers = 0;
      UL1 = true;
      Log("Unlocking workers");
  }
  else if((gold >= 25) && worker_button.style.visibility != "visible") {
      unlockWorker(save);
  }
}

function handleStoryMessagesAndUnlocks() {

  if(save.storyPos >= 8 && !canAscend) {
    canAscend = true;
}
}