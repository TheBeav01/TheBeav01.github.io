import { getCookieByKey } from "../utils/cookieUtils";
import { resourceStore } from "../stores/resourceStore.svelte";
import { writable } from "svelte/store";
import StoryUtils from "../utils/storyUtils.svelte";
import { createPlayersFromSave, playerStore } from "../stores/playerStore.svelte";
import { gameSave, saveGame, decodeSave, getPassiveValue, getPassive } from "../types/gameSave.svelte";
import { ResourceLoop } from "./resource-loop.svelte";
import SaveObject, { GameStats } from "../types/saveObject.svelte";
import { setupEncounter, CombatLoop } from "../stores/encounter.svelte";
import { genRateMap } from "../resource/resourceManager.svelte";
import { Item } from "../types/resources/item.svelte";
import type { Resource } from "../types/resources/resource.svelte";
import Upgrade from "../types/resources/upgrade.svelte";
import UpgradeUtils from "../utils/upgradeUtils";
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
export function onFrameCooldown(everyXFrames: number, callback: () => void) {
    frameID.subscribe(x => {
        if (x % everyXFrames === 0) {
            callback()
        }
    })
}
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

const createResourcesFromSave = (save: SaveObject) => {
    const map: Map<string, Resource> = new Map()
    save.resources.forEach(r => {
        if (!resourceStore.has(r.name)) {
            let res = null
            if (r.isUpgrade) {
                const rau = r as Upgrade
                res = new Upgrade(rau)
                res.isPassive = rau.isPassive
                res.upgradeToggled = rau.upgradeToggled
                res.togglable = rau.togglable
                const upgrade = UpgradeUtils.allUpgrades.find(u => u.name === r.name)
                if (upgrade) {
                    res.scalingFactor = upgrade.scalingFactor
                    res.baseCost = upgrade.baseCost
                    res.resourceUsed = upgrade.resourceUsed
                    res.attackStat = upgrade.attackStat
                    res.defenseStat = upgrade.defenseStat
                }
            }
            else if (r.isItem) {
                res = new Item(r as Item)
            }
            if (!res) {
                return
            }
            res.genRatePerSecond = genRateMap.get(res.name) ?? 0.0
            resourceStore.set(res.name, res)
            return
        }
        const res = resourceStore.get(r.name)!
        res.add(r._amt)
        resourceStore.set(r.name, res)
    })
}

function createPassivesFromSave(save: SaveObject) {
  save.passives.forEach(p => {
    const pass = UpgradeUtils.allUpgrades.find(u => u.name === p.name)
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
  }

  // Left/right path migration
  const pass = getPassive("Enemy Simulation")
  const inSave = UpgradeUtils.allUpgrades.find(u => u.name === "Enemy Simulation")
  if (pass == null) {
    save.coordinates.sidePathPosition = 0
    if (inSave) {
      const upgrade = new Upgrade(inSave)
      upgrade.isPassive = true
      upgrade.upgradeToggled = false
      upgrade.togglable = false
      if (save.highestArea >= 7) {
        upgrade.add(0)
      }
      resourceStore.set(upgrade.name, upgrade)
    }
  }

  StoryUtils.setStoryFlags(save)

}