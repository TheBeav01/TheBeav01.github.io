import { frameID } from "../game-loop/gameLoop.svelte";
import { gameSave } from "../types/gameSave.svelte";
export function onFrameCooldown(everyXFrames: number, callback: () => void) {
    frameID.subscribe(x => {
        if (x % everyXFrames === 0) {
            callback()
        }
    })
}

export function generateRandomNumber(max: number, min: number = 0, exclusive = false) {
    const newMax = exclusive ? Math.floor(max) : Math.floor(max) + 1
    const newMin = Math.ceil(min)
    return Math.floor(Math.random() * (newMax - newMin) + newMin)
}

export function getEnemiesPerZone(zone = gameSave.save.coordinates.zone) {
    return Math.min(
        zone == 0 ? 1 : zone,
        5,
    )
}