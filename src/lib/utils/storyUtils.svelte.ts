import * as Constants from "../constants/constants"
import { CombatLoop } from "../stores/encounter.svelte"
import { log } from "../stores/messageList.svelte"
import { resourceStore } from "../stores/resourceStore.svelte"
import { gameSave, getFlagComplete, getPassive, saveGame } from "../types/gameSave.svelte"
import type SaveObject from "../types/saveObject.svelte"
import { Passives } from "../types/saveObject.svelte"
import { generateRandomNumber } from "./gameUtils.svelte"
import UpgradeUtils from "./upgradeUtils"

interface StoryHandler {
    text: StoryText[]
    onNext?: () => void
    onNextText?: string
    progressOnNext?: boolean
}

interface StoryText {
    text: string
}
export let storyflags : StoryFlags = $state({})
export default class StoryUtils {
    private static shownStory: keyof StoryFlags
    private static partnerNames = ["Zephyr", "Aluca", "Ruby", "Zircon", "Topaz", "Orion", "Zatha", "Ba'kan", "Azl'ka", "Xa'ahn"]
    private static storyList = new Map()


    static buildStoryList() {
        const map = new Map<string, StoryHandler>()
        map.set(Constants.UNLOCKED_NAVIGATION,{
            text: Constants.STORY_MESSAGE_INITIAL,
            onNextText: "Scan?",
            onNext: () => StoryUtils.setFlag(Constants.UNLOCKED_COMBAT)
        })
        map.set(Constants.UNLOCKED_COMBAT,{
            text: Constants.STORY_MESSAGE_2
        })
        map.set(Constants.FIRST_ENEMY_ENCOUNTER,{
            text: Constants.STORY_MESSAGE_3,
            onNext: () => CombatLoop.unpause()
        })
        map.set(Constants.UNLOCKED_FIRST_WEAPON,{
            text: Constants.STORY_MESSAGE_4
        })
        map.set(Constants.UNLOCKED_EQUIPMENT_PURCHASING,{
            text: Constants.STORY_MESSAGE_PRE_DECONSTRUCTION
        })
        map.set(Constants.UNLOCKED_RESOURCE_DECONSTRUCTION,{
            text: Constants.STORY_MESSAGE_DECONSTRUCTION
        })
        map.set(Constants.UNLOCKED_PARTNER_COMBAT,{
            text: Constants.STORY_MESSAGE_INITIAL
        })
        this.storyList = map
        
    }
    static setStoryFlags(save: SaveObject) {
        this.buildStoryList()
        if (!save.storyFlags || Object.keys(save.storyFlags).length == 0) {
            this.migrateSave(save)
            this.copyFlags(save)
            console.log(save.storyFlags)
            return
        }
        this.copyFlags(save)
        console.log(storyflags)
    }

    private static copyFlags(save: SaveObject) {
        Object.entries(save.storyFlags).forEach(e => {
            storyflags[e[0]] = e[1]
        })
    }

    private static migrateSave(save: SaveObject) {
        const defaultValue = {
            entered: true,
            storyShown: true
        }
        switch(save.storyPos) {
            case Constants.DRONE_POS:
                storyflags.passiveCombatUnlocked = defaultValue
            case Constants.DECONSTRUCTION_UNLOCKED:
                storyflags.deconstructionUnlocked = defaultValue
            case Constants.PIDGEON_ONE_DOWN:
            case Constants.EQUIPMENT_ERA:
                storyflags.equipmentUnlocked = defaultValue
            case Constants.AFTER_INITIAL_COMBAT:
                storyflags.unlockedFirstWeapon = defaultValue
            case Constants.INITIAL_NAVIGATION_POS:
                storyflags.unlockedCombat = defaultValue
            case Constants.INITIAL_SCAN_POS:
                storyflags.unlockedNavigation = defaultValue
                break
            case Constants.INITIAL_STORY:
                this.setFlag(Constants.UNLOCKED_NAVIGATION)
                break
        }
    }
    static generatePartnerName() {
        let idx = generateRandomNumber(this.partnerNames.length, 0, false)
        idx = Math.min(idx, this.partnerNames.length - 1)
        return this.partnerNames[idx]
    }
    
    public static setStoryPosition(pos: number) {
        gameSave.save = {...gameSave.save, storyPos: pos}
        saveGame()
        log("Saved!")
        console.log("Set story position to " + pos)
    }

    private static updatePassiveStory(name: string, value: "Pre" | "Post") {
        const swoop = getPassive(name)
        const idx = gameSave.save.passives.findIndex(p => p.name === name)
        const updateBoth = value == "Post"
        if (!swoop) {
            const np = new Passives(name, false)
            np.preStoryShown = true
            if (updateBoth) {
                np.storyShown = true
            }
            gameSave.save.passives.push(np)
            return
        }
        swoop.storyShown = true
        if (updateBoth) {
            swoop.storyShown = true
        }
        gameSave.save.passives[idx] = swoop
    }
    
    /**
     * Gets the story state after the game is saved
     * @param s The new save object
     * @returns An array of story objects
     */
    public static getStoryState(s: SaveObject) : StoryHandler {
        const ready: {key: keyof StoryFlags, value: StoryHandler}[] = Object.keys(s.storyFlags).filter((s) => this.isStoryReady(s)).map(x => {return {key: x, value: this.storyList.get(x)}})
        if (ready.length > 0) {
            StoryUtils.shownStory = ready[0].key
            return ready[0].value
        }
        // switch (s.storyPos) {
        //     case INITIAL_STORY:
        //         return {
        //             text: Constants.STORY_MESSAGE_INITIAL,
        //             onNext: () => this.setStoryPosition(1),
        //             onNextText: "Scan?"
        //         }
        //     case INITIAL_SCAN_POS:
        //         return {
        //             text: Constants.STORY_MESSAGE_2
        //         }
        //     case INITIAL_NAVIGATION_POS:
        //         return {
        //             text: Constants.STORY_MESSAGE_3
        //         }
        //     case AFTER_INITIAL_COMBAT:
        //         return {
        //             text: Constants.STORY_MESSAGE_4,
        //             onNext: () => this.setStoryPosition(EQUIPMENT_ERA),
        //             onNextText: "-->"
        //         }
        //     case PIDGEON_ONE_DOWN:
        //         return {
        //             text: Constants.STORY_MESSAGE_DECONSTRUCTION,
        //             onNext: () => this.setStoryPosition(DECONSTRUCTION_UNLOCKED)
        //         }
        //     default:
        //         break
        // }
        let ulk = this.showPassiveUnlockStory("Swoop", "[[partnername]] looks more confident now that you're getting a hold of yourself", "[[partnername]] looks at you worriedly.")
        if (ulk) {
            return ulk
        }
        ulk = this.showPassiveUnlockStory("Rescue", "You sigh and twiddle your weaponry.", "You look at [[partnername]] worriedly.")
        if (ulk) {
            return ulk
        }
        return {
            text: Constants.STORY_MESSAGE_DEFAULT
        }
    }

    private static isStoryReady(name: keyof StoryFlags) {
        return storyflags[name].entered && !storyflags[name].storyShown
    }

    private static showPassiveUnlockStory(passiveName: string, postText: string, preText: string) {
        const item = UpgradeUtils.getAvailablePlayerUpgrades(resourceStore, false).find(p => p.name === passiveName)
        const swoop = getPassive(passiveName)
        if (item && !swoop) {
            return {
                text: [
                    {
                        text: preText,
                    }
                ],
                onNext: () => {
                    item.preStoryShown = true
                    resourceStore.set(item.name, item)
                    this.updatePassiveStory(passiveName, "Pre")
                }
            }
        }
        if (item && item._amt > 0 && (swoop && !swoop.storyShown)) {
            return {
                text: [
                    {
                        text: postText,
                    }
                ],
                onNext: () => this.updatePassiveStory(passiveName, "Post")
            }
        }
    }

    public static setFlag(name: string) {
        const obj = {
            storyShown: false,
            entered: true
        }
        storyflags[name] = obj
        StoryUtils.shownStory = name
        gameSave.save.storyFlags = storyflags
        saveGame()
    }

    public static setFlagAsRead() {
        if (!StoryUtils.shownStory || StoryUtils.shownStory == "") {
            return
        }
        const obj = {
            storyShown: true,
            entered: true
        }
        storyflags[StoryUtils.shownStory] = obj
        gameSave.save.storyFlags = storyflags
        StoryUtils.shownStory = ""
        saveGame()
    }

    public static getFlags() {
        return Object.freeze(storyflags)
    }

    public static displayStoryMessage() {

    }


}

export type StoryFlags = {
    [key: string]: {
        entered: boolean
        storyShown: boolean
    }
}
