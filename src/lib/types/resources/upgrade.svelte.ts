import { gameSave, getPassiveValue } from "../gameSave.svelte";
import { Item } from "./item.svelte";

export default class Upgrade extends Item {
    public isUpgrade = true;
    public readonly isItem = false
    public readonly upgradeFlag = ""
    public isPassive = false
    public togglable = true
    public unlocked = false
    public upgradeToggled = $state(false)
    public _isUnlocked : () => boolean = () => false
    public preStoryShown = false
    constructor(from?: Upgrade) {
        super(from as Item)
        if (!from) {
            return
        }
        if (from.isPassive) {
            from.upgradeToggled = getPassiveValue(this.name) ?? false
        }
        this.resourceUsed = from.resourceUsed
    }

    public checkUnlocked = () => {
        if (this.unlocked) {
            return true
        }
        if (this._isUnlocked) {
            this.unlocked = this._isUnlocked()
            return this.unlocked
        }
    }

    public add(amt: number): void {
        if (this.isPassive) {
            this.upgradeToggled = getPassiveValue(this.name) ?? false
            if (this._amt != 1) {
                this.amt = 1
                this._amt = 1
                const idx = gameSave.save.passives.findIndex(p => p.name === this.name)
                const s = gameSave.save.passives[idx]
                s.bought = true
                gameSave.save.passives[idx] = s
            }
            return
        }
        super.add(amt)
    }
}