import { onDeath } from "../stores/gameState.svelte";
import { addResource } from "../stores/resourceStore.svelte";
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
    
    awardItem(item: Resource, amount?: number) {
        if (!item.isItem) {
            addResource(item)
            return
        }
        const found = this.inventory.findIndex(x => x.name === item.name)
        const amountToAdd = amount === undefined ? item._amt : amount
        if (found < 0) {
            item.add(amountToAdd)
            this.inventory.push(item)
        } else {
            this.inventory[found].add(amountToAdd)
        }
    }
    static fromPartner(partner: Player) {
        const p = new Player(true)
        p.fromBase(partner)
        p.resetAttackTime()
        return p
    }
    static from(player: Player) {
        const p = new Player()
        p.fromBase(player)
        return p
    }
}