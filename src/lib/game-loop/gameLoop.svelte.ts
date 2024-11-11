import { getCookieByKey } from "../utils/cookieUtils";
import { saveGame, save, decodeSave } from "../stores/gameSave.svelte";
import { createResourcesFromSave, resources } from "../stores/resourceStore.svelte";
import { tick } from "../resource/resourceManager.svelte";
import { writable } from "svelte/store";
import StoryUtils from "../utils/storyUtils";
import { createPlayersFromSave } from "../stores/playerStore.svelte";
import { log } from "../stores/messageList.svelte";
let canAscend = false
export function load() {
  const saveString = getCookieByKey("save")
  if(saveString != "") {
    decodeSave(saveString);
    initGame();
    gameLoop()
    return

  }
  saveGame();
  gameLoop();
}

export let frameID = writable(0)

/**
* The loop of this game. This runs via requestAnimationFrame(), 
* and a tick counter is kept for timekeeping purposes. It should run at 60 ticks per second
* @param {*} timeStamp Is the time that the frame was requested (in ms.)
*/
function gameLoop() {
  frameID.set(requestAnimationFrame(gameLoop))
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
  if (save.partnerName == "") {
    const name = StoryUtils.generatePartnerName()
    save.partnerName = name
  }
  if (save.playerName == "") {
    const name = "You"
    save.playerName = name
  }
  log(`Welcome back ${save.playerName} and ${save.partnerName}`)
  createPlayersFromSave(save)
  createResourcesFromSave(save)
  saveGame(save)
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