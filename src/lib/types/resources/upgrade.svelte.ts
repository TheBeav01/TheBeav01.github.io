import { Item } from "./item.svelte";

export default class Upgrade extends Item {
    public isUpgrade: boolean = true;
    public readonly isItem = false
    public resourceUsed = "Mana"
    constructor() {
        super()
    }
}