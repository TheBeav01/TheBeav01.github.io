import * as Constants from "../constants/constants"
import { saveGame } from "../stores/gameSave.svelte"
import { log } from "../stores/messageList.svelte"
import { gameSave, getPassive } from "../types/gameSave.svelte"
import type { Resource } from "../types/resources/resource.svelte"
import Upgrade from "../types/resources/upgrade.svelte"
import type SaveObject from "../types/saveObject.svelte"
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
export const PRE_EQUIPMENT_ERA = 4
export const EQUIPMENT_ERA = 5
export const POST_EQUIPMENT_ERA = 6
export const DRONE_POS = 7
export default class StoryUtils {
    private static partnerNames = ["Zephyr", "Aluca", "Ruby", "Zircon", "Topaz", "Orion", "Zatha", "Ba'kan", "Azl'ka", "Xa'ahn"]
    static allUpgrades = [
        this.createAttackItem("Reinforce Bone", 1, 0.25, 1.08, CHEST_BONE),
        this.createAttackItem("Sharpen Dagger", 10, 0.25, 1.08),
        this.createAttackItem("+1 Dagger",25, 1, 1.25),
        this.createDefenseItem("Improve Boots", 10, 0.5, 1.10),
        this.createDefenseItem("Improve Gloves", 15, 0.5, 1.10),
        this.createDefenseItem("Improve Cloak Fibers",40, 2, 1.25),
        this.createPassive("Swoop", "[[partnername]] takes the hit when an attack would down you", 25, CHEST_BONE, this.hasUnlockedSwoop)
    ]
    static cached : Upgrade[] = []
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
                    onNext: () => this.setStoryPosition(PRE_EQUIPMENT_ERA),
                    onNextText: "-->"
                }
            case PRE_EQUIPMENT_ERA:
                return {
                    text: Constants.STORY_MESSAGE_5,
                    onNext: () => this.setStoryPosition(POST_EQUIPMENT_ERA),
                    onNextText: "-->"
                }
            default:
                return {
                    text: Constants.STORY_MESSAGE_DEFAULT
                }
            }
    }

    private static hasUnlockedSwoop() {
        if (getPassive("Swoop") != null) {
            return true
        }
        return gameSave.save.stats.deaths > 0
    }
    
    public static getAvailablePlayerUpgrades(resourceStore: Map<string, Resource>) {
        const highestCall = this.cached
        const mana = resourceStore.get("Mana")!
        const newList = this.allUpgrades.filter((u, idx) => {
            if (u.isUnlocked()) {
                return true
            }
            if (idx == 0) {
                return true
            }
            const hasResource = resourceStore.get(u.name)
            if (hasResource) {
                return true
            }
            if (mana.amt >= u.currentCost / 2) {
                return true
            }
            return false
        }).map(u => resourceStore.get(u.name) as Upgrade ?? u)
        if (newList.length > highestCall.length) {
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

    private static createPassive(name: string, desc: string, cost: number, resourceUsed = "Mana", unlocked: () => boolean) {
        const passive = new Upgrade()
        passive.isPassive = true
        passive.name = name
        passive.description = desc
        passive.resourceUsed = resourceUsed
        passive.upgradeToggled = false
        passive.baseCost = cost
        passive.scalingFactor = 0.0
        passive.isUnlocked = unlocked
        return passive
    }
}
