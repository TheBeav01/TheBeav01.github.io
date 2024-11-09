import SaveObject from "../types/save-object";
import { getCookieByKey, setCookie } from "../utils/cookie-utils";
import { saveGame, save, decodeSave } from "../stores/gameSave.svelte";
import { resources, resourceStore } from "../stores/resource-store.svelte";
import { tick } from "../resource/resource-manager.svelte";
let canAscend = false
export function load() {
  const saveString = getCookieByKey("save")
  if(saveString != "") {
    decodeSave(saveString);

    initGame();
    // initResources();
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
  updateAllResources()
}

function updateAllResources() {
  for (const res of resources) {
    tick(res[1])
  }
}

/**
 * Initializes the game
 */
function initGame() { 
  var date = new Date();
  
}

/**
 * Handles unlocks at load or update.
 */
function unlockHandler() {
  var worker_button = document.getElementById("UL1");
  handleStoryMessagesAndUnlocks();
}

function handleStoryMessagesAndUnlocks() {

  if(save.storyPos >= 8 && !canAscend) {
    canAscend = true;
}
}