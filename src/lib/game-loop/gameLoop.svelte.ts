import { getCookieByKey } from "../utils/cookieUtils";
import { saveGame, decodeSave } from "../stores/gameSave.svelte";
import { createResourcesFromSave } from "../stores/resourceStore.svelte";
import { writable } from "svelte/store";
import StoryUtils from "../utils/storyUtils.svelte";
import { createPlayersFromSave } from "../stores/playerStore.svelte";
import { log } from "../stores/messageList.svelte";
import { gameSave } from "../types/gameSave.svelte";
import { ResourceLoop } from "./resource-loop.svelte";
import { CombatLoop } from "./combat-loop.svelte";
let canAscend = false
export function load() {
  const saveString = getCookieByKey("save")
  if(saveString != "") {
    decodeSave(saveString);
    initGame();
    gameLoop()
    return true

  }
  initGame();
  saveGame();
  gameLoop();
  return true
}

export let frameID = writable(0)
let date = Date.now()
let diff = 0
/**
* The loop of this game. This runs via requestAnimationFrame(), 
* and a tick counter is kept for timekeeping purposes. It should run at 60 ticks per second
* @param {*} timeStamp Is the time that the frame was requested (in ms.)
*/
function gameLoop() {
  diff += Date.now()-date
  frameID.set(requestAnimationFrame(gameLoop))

  ResourceLoop.tick(diff)
  CombatLoop.tick(diff)
  date = Date.now()
}

/**
 * Initializes the game
 */
function initGame() {
  if (gameSave.save.partnerName == "") {
    const name = StoryUtils.generatePartnerName()
    gameSave.save.partnerName = name
  }
  if (gameSave.save.playerName == "") {
    const name = "You"
    gameSave.save.playerName = name
  }
  log(`Welcome ${gameSave.save.playerName} and ${gameSave.save.partnerName}`)
  createPlayersFromSave(gameSave.save)
  createResourcesFromSave(gameSave.save)
  saveGame()
}

/**
 * Handles unlocks at load or update.
 */
function unlockHandler() {
  var worker_button = document.getElementById("UL1");
  handleStoryMessagesAndUnlocks();
}

function handleStoryMessagesAndUnlocks() {

  if(gameSave.save.storyPos >= 8 && !canAscend) {
    canAscend = true;
}
}