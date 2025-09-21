import { setCookie } from "../utils/cookieUtils"
import type Upgrade from "./resources/upgrade.svelte"
import SaveObject, { Passives } from "./saveObject.svelte"

export const gameSave = $state({
    save: new SaveObject()
})

export function saveGame(s: SaveObject = gameSave.save) {
  const saveString = encodeSave(s)
  setCookie("save", saveString, 365)
}



/**
 * Translates the string from a series of ints and '|' to something that is implementable by the game.
 * As the creator is too lazy to properly implement a base-32 string, the '|' acts as a splitter for the various fields.
 * @param {*} stringToDecode The save string retrieved from the cookie 
 */
export function decodeSave(stringToDecode: string) {
  const newSave = JSON.parse(atob(stringToDecode))
  gameSave.save = newSave
}

/**
 * Translates a variety of game features into a save string that will likely grow over time.
 */
export function encodeSave(s: any) {
  var encString = JSON.stringify(s);
  var ret = btoa(encString);
  return ret;
}

export const getPassive = (name: string) => {
    const passive = gameSave.save.passives.find(p => p.name == name)
    if (!passive) {
        return null
    }
    return passive
}

export const getPassiveValue = (name: string) => {
    const passive = gameSave.save.passives.find(p => p.name == name)
    if (!passive) {
        return null
    }
    return passive.toggled
}

export const equipOrTogglePassive = (passive: Upgrade) => {
    const pass = getPassive(passive.name)
    if (pass == null) {
        const p = new Passives(passive.name, true)
        p.bought = true
        gameSave.save.passives.push(p)
        saveGame()
    } else {
        pass.toggled = !pass.toggled
        const idx = gameSave.save.passives.findIndex(p => p.name === passive.name)
        gameSave.save.passives[idx] = $state.snapshot(pass)
        saveGame()
    }
    passive.add(0)
}

export const getFlagComplete = (name: string) : boolean => {
    const currentFlags = gameSave.save.storyFlags
    if (!currentFlags || !(name in currentFlags)) {
        return false
    }
    const flag = currentFlags[name]
    return flag.entered && flag.storyShown
}

export const highestZone = () => {
    return gameSave.save.highestArea
}