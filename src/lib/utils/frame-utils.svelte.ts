import { frameID } from "../game-loop/game-loop.svelte";
export default function onFrameCooldown(everyXFrames: number, callback: () => void) {
    frameID.subscribe(x => {
        if (x % everyXFrames === 0) {
            callback()
        }
    })
}