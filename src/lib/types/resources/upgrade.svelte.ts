import { Item } from "./item.svelte";

export default class Upgrade extends Item {
    public isUpgrade: boolean = true;
    public readonly isItem = false
    public resourceUsed = "Mana"
    constructor(from?: Upgrade) {
        super(from as Item)
        if (!from) {
            return
        }
        this.resourceUsed = from.resourceUsed
    }

    public add(amt: number): void {
        super.add(amt)
    }
}