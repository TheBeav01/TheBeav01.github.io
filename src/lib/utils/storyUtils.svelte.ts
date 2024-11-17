import { STORY_MESSAGE_2, STORY_MESSAGE_3, STORY_MESSAGE_DEFAULT, STORY_MESSAGE_INITIAL } from "../constants/constants"
import { saveGame } from "../stores/gameSave.svelte"
import { PARTNER_NAME } from "../stores/playerStore.svelte"
import { gameSave } from "../types/gameSave.svelte"
import type LivingEntity from "../types/livingEntity.svelte"
import type SaveObject from "../types/saveObject.svelte"
import { generateRandomNumber } from "./gameUtils.svelte"
import Box from "./stateBox.svelte"

interface StoryHandler {
    text: StoryText[]
    onNext?: () => void
    onNextText?: string
}

interface StoryText {
    text: string
}
export const INITIAL_STORY = 0
export const INITIAL_SCAN_POS = 1
export const DRONE_POS = 3
export default class StoryUtils {
    private static partnerNames = ["Zephyr", "Aluca", "Ruby", "Zircon", "Topaz", "Orion", "Zatha", "Ba'kan", "Azl'ka", "Xa'ahn"]
    static generatePartnerName() {
        let idx = generateRandomNumber(this.partnerNames.length, 0, false)
        idx = Math.min(idx, this.partnerNames.length - 1)
        return this.partnerNames[idx]
    }
    
    private static saveWrapper = (cbk: () => void) =>  {
        cbk()
        saveGame()
    }
    
    public static setStoryPosition(pos: number) {
        gameSave.save = {...gameSave.save, storyPos: pos}
    }
    
    public static getStoryState(s: SaveObject) : StoryHandler {
        switch (s.storyPos) {
            case 0:
                return {
                    text: STORY_MESSAGE_INITIAL,
                    onNext: () => this.saveWrapper(() => this.setStoryPosition(1)),
                    onNextText: "Scan?"
                }
            case 1:
                return {
                    text: STORY_MESSAGE_2
                }
            case 2:
                return {
                    text: STORY_MESSAGE_3
                }
            default:
                return {
                    text: STORY_MESSAGE_DEFAULT
                }
            }
        }
}
