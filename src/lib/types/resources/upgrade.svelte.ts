import { Item } from "./item.svelte";

export default class Upgrade extends Item {
    public isUpgrade = true;
    public readonly isItem = false
    public resourceUsed = "Mana"
    public readonly upgradeFlag = ""
    public isPassive = false
    public upgradeToggled = false
    public isUnlocked : () => boolean = () => false 
    constructor(from?: Upgrade) {
        super(from as Item)
        if (!from) {
            return
        }
        this.resourceUsed = from.resourceUsed
    }

    public add(amt: number): void {
        if (this.upgradeFlag != "") {
            this.upgradeToggled != this.upgradeToggled
        }
        super.add(amt)
    }
}