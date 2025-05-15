import * as Constants from "../constants/constants"
import { saveGame } from "../stores/gameSave.svelte"
import { log } from "../stores/messageList.svelte"
import { resourceStore } from "../stores/resourceStore.svelte"
import { gameSave, getPassive } from "../types/gameSave.svelte"
import type { Resource } from "../types/resources/resource.svelte"
import Upgrade from "../types/resources/upgrade.svelte"
import type SaveObject from "../types/saveObject.svelte"
import { Passives } from "../types/saveObject.svelte"
import { generateRandomNumber } from "./gameUtils.svelte"
import { CHEST_BONE } from "./generators/itemGenerator"

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
export const EQUIPMENT_ERA = 4
export const PIDGEON_ONE_DOWN = 5
export const DECONSTRUCTION_UNLOCKED = 6
export const DRONE_POS = 7
export default class StoryUtils {
    private static storyflags : StoryFlags = {}
    private static shownStory: keyof StoryFlags
    private static partnerNames = ["Zephyr", "Aluca", "Ruby", "Zircon", "Topaz", "Orion", "Zatha", "Ba'kan", "Azl'ka", "Xa'ahn"]
    private static storyList = new Map()
    static allUpgrades = [
        this.createAttackItem("Reinforce Bone", 1, 0.5, 1.08, CHEST_BONE),
        // TODO: Bring these back
        // this.createAttackItem("Sharpen Dagger", 10, 0.25, 1.08),
        // this.createAttackItem("+1 Dagger",25, 1, 1.25),
        this.createDefenseItem("Improve Boots", 10, 0.5, 1.08),
        this.createDefenseItem("Improve Gloves", 15, 1, 1.08),
        this.createDefenseItem("Improve Cloak Fibers",40, 2, 1.25),
        this.createPassive("Swoop", "[[partnername]] takes the hit when an attack would down you", 25, CHEST_BONE, this.hasUnlockedSwoop),
        this.createPassive("Rescue", "You take the hit when an attack would down [[partnername]]", 25, CHEST_BONE, this.hasUnlockedRescue),
        this.createPassive("Deconstruction", "Deconstruct drops with the power of your mind", 0, "Mana", () => gameSave.save.storyPos >= DECONSTRUCTION_UNLOCKED, false)
    ]
    static cached : Upgrade[] = []

    static buildStoryList() {
        const map = new Map<string, StoryHandler>()
        map.set("unlockedNavigation",{
            text: Constants.STORY_MESSAGE_INITIAL,
            onNextText: "Scan?"
        })
        map.set("unlockedCombat",{
            text: Constants.STORY_MESSAGE_2
        })
        map.set("unlockedFirstWeapon",{
            text: Constants.STORY_MESSAGE_3
        })
        map.set("equipmentUnlocked",{
            text: Constants.STORY_MESSAGE_4
        })
        map.set("deconstructionUnlocked",{
            text: Constants.STORY_MESSAGE_DECONSTRUCTION
        })
        map.set("passiveCombatUnlocked",{
            text: Constants.STORY_MESSAGE_INITIAL
        })
        this.storyList = map
        
    }
    static setStoryFlags(save: SaveObject) {
        this.buildStoryList()
        if (!save.storyFlags || Object.keys(save.storyFlags).length == 0) {
            this.migrateSave(save)
            save.storyFlags = StoryUtils.storyflags
            console.log(save.storyFlags)
            return
        }
        StoryUtils.storyflags = save.storyFlags
        console.log(StoryUtils.storyflags)
    }

    private static migrateSave(save: SaveObject) {
        const defaultValue = {
            entered: true,
            storyShown: true
        }
        switch(save.storyPos) {
            case DRONE_POS:
                this.storyflags.passiveCombatUnlocked = defaultValue
            case DECONSTRUCTION_UNLOCKED:
                this.storyflags.deconstructionUnlocked = defaultValue
            case PIDGEON_ONE_DOWN:
            case EQUIPMENT_ERA:
                this.storyflags.equipmentUnlocked = defaultValue
            case AFTER_INITIAL_COMBAT:
                this.storyflags.unlockedFirstWeapon = defaultValue
            case INITIAL_NAVIGATION_POS:
                this.storyflags.unlockedCombat = defaultValue
            case INITIAL_SCAN_POS:
                this.storyflags.unlockedNavigation = defaultValue
                break
            case INITIAL_STORY:
                this.setFlag("unlockedNavigation")
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
        console.log("READY: " + ready)
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
        return this.storyflags[name].entered && !this.storyflags[name].storyShown
    }

    private static showPassiveUnlockStory(passiveName: string, postText: string, preText: string) {
        const item = StoryUtils.getAvailablePlayerUpgrades(resourceStore, false).find(p => p.name === passiveName)
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

    private static hasUnlockedSwoop() {
        if (getPassive("Swoop") != null) {
            return true
        }
        return gameSave.save.stats.deaths > 0
    }

    private static hasUnlockedRescue() {
        if (getPassive("Rescue") != null) {
            return true
        }
        return gameSave.save.stats.partnerDeaths > 0
    }
    
    public static getAvailablePlayerUpgrades(resourceStore: Map<string, Resource>, cached = true) {
        const highestCall = this.cached
        const mana = resourceStore.get("Mana")!
        const newList = this.allUpgrades.filter((u, idx) => {
            const hasResource = resourceStore.get(u.name)
            if (idx == 0) {
                return true
            }
            else if (hasResource) {
                return true
            }
            else if (u.isUnlocked != null) {
                return u.isUnlocked()
            }
            else if (mana.amt >= u.currentCost / 2) {
                return true
            }
            return false
        }).map(u => resourceStore.get(u.name) as Upgrade ?? u)
        if (newList.length > highestCall.length || !cached) {
            this.cached = newList
            return newList
        }
        return this.cached
    }

    private static createAttackItem(name: string, baseCost: number, attack: number, scalingFactor: number, resourceUsed = "Mana") {
        const item = new Upgrade()
        item.resourceUsed = resourceUsed
        item.name = name
        item.attackStat.value = attack
        item.baseCost = baseCost
        item.scalingFactor = scalingFactor
        return item
    }

    private static createDefenseItem(name: string, baseCost: number, defense: number, scalingFactor: number, resourceUsed = "Mana") {
        const item = new Upgrade()
        item.resourceUsed = resourceUsed
        item.name = name
        item.defenseStat.value = defense
        item.baseCost = baseCost
        item.scalingFactor = scalingFactor
        return item
    }

    private static createPassive(name: string, desc: string, cost: number, resourceUsed = "Mana", unlocked: () => boolean, togglable = true) {
        const passive = new Upgrade()
        passive.isPassive = true
        passive.name = name
        passive.description = desc
        passive.resourceUsed = resourceUsed
        passive.upgradeToggled = false
        passive.baseCost = cost
        passive.scalingFactor = 0.0
        if (!togglable) {
            passive.togglable = false
        }
        passive.isUnlocked = unlocked
        return passive
    }

    public static setFlag(name: string) {
        StoryUtils.storyflags[name] = {
            storyShown: false,
            entered: true
        }
        StoryUtils.shownStory = name
        gameSave.save.storyFlags = StoryUtils.storyflags
        saveGame()
    }

    public static setFlagAsRead() {
        if (!StoryUtils.shownStory || StoryUtils.shownStory == "") {
            return
        }
        StoryUtils.storyflags[StoryUtils.shownStory] = {
            storyShown: true,
            entered: true
        }
        gameSave.save.storyFlags = StoryUtils.storyflags
        StoryUtils.shownStory = ""
        saveGame()
    }

    public static getFlags() {
        return Object.freeze(StoryUtils.storyflags)
    }

    public static getFlagComplete(name: string) {
        const currentFlags = StoryUtils.storyflags[name]
        if (!currentFlags) {
            return false
        }
        return currentFlags.entered && currentFlags.storyShown
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
