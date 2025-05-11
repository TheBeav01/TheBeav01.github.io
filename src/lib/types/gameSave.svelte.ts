import { saveGame } from "../stores/gameSave.svelte"
import type Upgrade from "./resources/upgrade.svelte"
import SaveObject, { Passives } from "./saveObject.svelte"

export const gameSave = $state({
    save: new SaveObject()
})

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
        saveGame()
    }
    passive.add(0)
}