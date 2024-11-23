import * as Constants from "../constants/constants"
import { saveGame } from "../stores/gameSave.svelte"
import { log } from "../stores/messageList.svelte"
import { gameSave } from "../types/gameSave.svelte"
import type SaveObject from "../types/saveObject.svelte"
import { generateRandomNumber } from "./gameUtils.svelte"

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
export const INITIAL_NAVIGATION_POS = 2
export const AFTER_INITIAL_COMBAT = 3
export const PRE_EQUIPMENT_ERA = 4
export const EQUIPMENT_ERA = 5
export const DRONE_POS = 7
export default class StoryUtils {
    private static partnerNames = ["Zephyr", "Aluca", "Ruby", "Zircon", "Topaz", "Orion", "Zatha", "Ba'kan", "Azl'ka", "Xa'ahn"]
    static generatePartnerName() {
        let idx = generateRandomNumber(this.partnerNames.length, 0, false)
        idx = Math.min(idx, this.partnerNames.length - 1)
        return this.partnerNames[idx]
    }
    
    public static setStoryPosition(pos: number) {
        gameSave.save = {...gameSave.save, storyPos: pos}
        saveGame()
        log("Saved!")
    }
    
    public static getStoryState(s: SaveObject) : StoryHandler {
        switch (s.storyPos) {
            case INITIAL_STORY:
                return {
                    text: Constants.STORY_MESSAGE_INITIAL,
                    onNext: () => this.setStoryPosition(1),
                    onNextText: "Scan?"
                }
            case INITIAL_SCAN_POS:
                return {
                    text: Constants.STORY_MESSAGE_2
                }
            case INITIAL_NAVIGATION_POS:
                return {
                    text: Constants.STORY_MESSAGE_3
                }
            case AFTER_INITIAL_COMBAT:
                return {
                    text: Constants.STORY_MESSAGE_4,
                    onNext: () => this.setStoryPosition(AFTER_INITIAL_COMBAT + 1),
                    onNextText: "-->"
                }
            default:
                return {
                    text: Constants.STORY_MESSAGE_DEFAULT
                }
            }
        }
}
