import { STORY_MESSAGE_2, STORY_MESSAGE_INITIAL } from "../constants"
import { save, saveGame, savePos, saveStore } from "../stores/gameSave.svelte"
import { generateRandomNumber } from "./gameUtils.svelte"
import Box from "./stateBox.svelte"

interface StoryHandler {
    text: string
    onNext?: () => void
    onNextText?: string
}
export default class StoryUtils {
    private static partnerNames = ["Zephyr", "Aluca", "Ruby", "Zircon", "Topaz", "Orion", "Zatha", "Ba'kan", "Azl'ka", "Xa'ahn"]

    static generatePartnerName() {
        let idx = generateRandomNumber(this.partnerNames.length, 0, false)
        idx = Math.min(idx, this.partnerNames.length - 1)
        return this.partnerNames[idx]
    }

    static saveWrapper(cbk: () => void) {
        cbk()
        saveGame()
        currentStory.value = this.getCurrentStoryMessage()
    }

    static getCurrentStoryMessage(): StoryHandler {
        console.log(savePos.value, save.storyPos, saveStore.value.storyPos)
        switch (save.storyPos) {
            case 0:
                return {
                    text: STORY_MESSAGE_INITIAL,
                    onNext: () => StoryUtils.saveWrapper(() => save.storyPos = 1),
                    onNextText: "Scan?"
                }
            case 2:
                return {
                    text: STORY_MESSAGE_2,
                    onNext: () => StoryUtils.saveWrapper(() => save.storyPos = 3)
                }
            default:
                return {
                    text: ""
                }
        }
    }
}
export let currentStory = new Box(StoryUtils.getCurrentStoryMessage())
