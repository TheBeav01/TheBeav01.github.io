import { gameSave, getPassiveValue } from "../gameSave.svelte";
import { Item } from "./item.svelte";

export default class Upgrade extends Item {
    public isUpgrade = true;
    public readonly isItem = false
    public readonly upgradeFlag = ""
    public isPassive = false
    public upgradeToggled = $state(false)
    public isUnlocked : () => boolean = () => false 
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

    public add(amt: number): void {
        if (this.isPassive) {
            this.upgradeToggled = getPassiveValue(this.name) ?? false
            return
        }
        super.add(amt)
    }
}