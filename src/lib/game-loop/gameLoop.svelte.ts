import { getCookieByKey } from "../utils/cookieUtils";
import { saveGame, decodeSave } from "../stores/gameSave.svelte";
import { createResourcesFromSave, resourceStore } from "../stores/resourceStore.svelte";
import { writable } from "svelte/store";
import StoryUtils from "../utils/storyUtils.svelte";
import { createPlayersFromSave, playerStore } from "../stores/playerStore.svelte";
import { gameSave } from "../types/gameSave.svelte";
import { ResourceLoop } from "./resource-loop.svelte";
import { CombatLoop } from "./combat-loop.svelte";
import { setupEncounter } from "../stores/encounter.svelte";
import type SaveObject from "../types/saveObject.svelte";
import { GameStats } from "../types/saveObject.svelte";
import Upgrade from "../types/resources/upgrade.svelte";
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
  diff = Date.now()-date
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
  createPlayersFromSave(gameSave.save)
  if (gameSave.save.highestArea == -1) {
    gameSave.save.highestArea = playerStore.get("player")!.coordinates.zone
  }
  createResourcesFromSave(gameSave.save)
  createPassivesFromSave(gameSave.save)
  handleMigration(gameSave.save)
  setupEncounter(gameSave.save)
  saveGame()
}

function createPassivesFromSave(save: SaveObject) {
  save.passives.forEach(p => {
    const pass = StoryUtils.allUpgrades.find(u => u.name === p.name)
    if (!pass) {
      return
    }
    const upgrade = new Upgrade(pass)
    upgrade.isPassive = true
    upgrade.upgradeToggled = p.toggled
    upgrade.togglable = pass.togglable
    if (p.bought) {
      upgrade.add(0)
    }
    resourceStore.set(upgrade.name, upgrade)
  })
}

function handleMigration(save: SaveObject) {
  if (!save.passives) {
    save.passives = []
  }
  if (!save.stats) {
    save.stats = new GameStats()
    save.stats.deaths = 0
    save.stats.partnerDeaths = 0
  }

  if (save.difficultyFactor == null) {
    save.difficultyFactor = 0
    if (save.highestArea > 5) {
      save.difficultyFactor = 1
    }
    console.log("DIFF: " + save.difficultyFactor)
  }

  StoryUtils.setStoryFlags(save)

}