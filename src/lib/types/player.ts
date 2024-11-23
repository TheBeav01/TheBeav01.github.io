import { onDeath } from "../stores/gameState.svelte";
import LivingEntity from "./livingEntity.svelte";
import type { Item } from "./resources/item.svelte";
import type { Resource } from "./resources/resource.svelte";

export default class Player extends LivingEntity {
    constructor(isPartner: boolean = false) {
        super(0)
        this.isPartner = isPartner
    }
    isPartner: boolean
    onKill() {
        if (this.isPartner) {
            onDeath.value = {...onDeath.value, partnerDead: true}
            return
        }
        onDeath.value = {...onDeath.value, playerDead: true}
        return
    };
    
    awardItem(item: Resource) {
        const found = this.inventory.findIndex(x => x.name === item.name)
        if (found < 0) {
            this.inventory.push(item)
        } else {
            this.inventory[found].add(item.amt)
        }
        if (item.isItem) {
            (item as Item).equip(this)
            return
        }
    }
    static fromPartner(partner: Player) {
        const p = new Player(true)
        p.fromBase(partner)
        return p
    }
    static from(player: Player) {
        const p = new Player()
        p.fromBase(player)
        return p
    }
}