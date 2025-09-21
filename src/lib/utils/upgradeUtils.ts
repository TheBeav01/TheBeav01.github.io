import { CHEST_BONE } from "../constants/constants"
import { gameSave, getFlagComplete, getPassive } from "../types/gameSave.svelte"
import { Resource } from "../types/resources/resource.svelte"
import Upgrade from "../types/resources/upgrade.svelte"
export default class UpgradeUtils {
    static cached : Upgrade[] = []
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
            this.createPassive("Deconstruction", "Deconstruct drops with the power of your mind", 0, "Mana", this.hasUnlockedDecon, false)
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
            if (!u.unlocked) {
                const unlocked = u.checkUnlocked()
                // console.debug(`Checking unlock for ${u.name}: ${unlocked}`)
                return unlocked
            }
            else if (mana.amt >= u.currentCost / 2) {
                return true
            }
            return false
        }).map(u => resourceStore.get(u.name) as Upgrade ?? u)
        newList.forEach(l => console.debug(l.name, ": ", l.amt))
        return newList
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
}