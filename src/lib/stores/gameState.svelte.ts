/**
 * Contains various states for global signals 
 */

import Box from "../utils/stateBox.svelte";
import { saveStore } from "./gameSave.svelte";

export const onDeath = new Box({
    playerDead: false,
    partnerDead: false
})

export const onStoryStateChange = new Box(saveStore.value)