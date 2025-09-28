import { CHEST_BONE, UNLOCKED_EQUIPMENT_PURCHASING } from "../constants/constants"
import { gameSave, getFlagComplete, getPassive, highestZone } from "../types/gameSave.svelte"
import { Resource } from "../types/resources/resource.svelte"
import Upgrade from "../types/resources/upgrade.svelte"
export default class UpgradeUtils {
    static cached : Upgrade[] = []
    static allUpgrades = [
            this.createAttackItem("Reinforce Bone", 1, 0.5, 1.08, CHEST_BONE),
            // TODO: Bring these back
            // this.createAttackItem("Sharpen Dagger", 10, 0.25, 1.08),
            // this.createAttackItem("+1 Dagger",25, 1, 1.25),
            this.createDefenseItem("Improve Boots", 2, 0.5, 1.08, "Mana", this.hasUnlockedEquipment),
            this.createDefenseItem("Improve Gloves", 4, 1, 1.15, "Mana", this.hasUnlockedEquipment),
            this.createDefenseItem("Improve Cloak Fibers",8, 2, 1.25, "Mana", this.hasUnlockedEquipment),
            this.createPassive("Swoop", "[[partnername]] takes the hit when an attack would down you", 5, "Soul", this.hasUnlockedSwoop),
            this.createPassive("Rescue", "You take the hit when an attack would down [[partnername]]", 5, "Soul", this.hasUnlockedRescue),
            this.createPassive("Deconstruction", "Deconstruct drops with the power of your mind", 0, "Mana", this.hasUnlockedDecon, false),
            this.createPassive("Enemy Simulation", "Reconstruct enemies with the power of a magical ward", 0, "Mana", () => highestZone() == 7, false) 
        ]
    public static getAvailablePlayerUpgrades(resourceStore: Map<string, Resource>, cached = true) {
        const mana = resourceStore.get("Mana")!
        const newList = this.allUpgrades.filter((u, idx) => {
            const hasResource = resourceStore.get(u.name)
            if (idx == 0) {
                return true
            }
            else if (hasResource) {
                return true
            }
            if (u.unlocked) {
                return true
            }
            if (!u.unlocked && u._isUnlocked) {
                const unlocked = u.checkUnlocked()
                return unlocked
            }
            else if (mana.amt >= u.currentCost / 4) {
                return true
            }
            return false
        }).map(u => resourceStore.get(u.name) as Upgrade ?? u)
        return [...newList]
    }

    private static createAttackItem(name: string, baseCost: number, attack: number, scalingFactor: number, resourceUsed = "Mana", unlocked = () => true) {
        const item = new Upgrade()
        item.resourceUsed = resourceUsed
        item.name = name
        item.attackStat.value = attack
        item.baseCost = baseCost
        item.scalingFactor = scalingFactor
        item._isUnlocked = unlocked
        return item
    }

    private static createDefenseItem(name: string, baseCost: number, defense: number, scalingFactor: number, resourceUsed = "Mana", unlocked = () => true) {
        const item = new Upgrade()
        item.resourceUsed = resourceUsed
        item.name = name
        item.defenseStat.value = defense
        item.baseCost = baseCost
        item.scalingFactor = scalingFactor
        item._isUnlocked = unlocked
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
        passive._isUnlocked = unlocked
        return passive
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

    private static hasUnlockedDecon() {
        if (getPassive("Deconstruction") != null) {
            return true
        }
        return getFlagComplete("deconstructionUnlocked")
    }

    private static hasUnlockedEquipment() {
        return getFlagComplete(UNLOCKED_EQUIPMENT_PURCHASING)
    }
}