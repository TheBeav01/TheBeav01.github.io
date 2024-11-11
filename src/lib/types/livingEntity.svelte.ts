import { playerStore } from "../stores/playerStore.svelte";
import type BaseEntity from "./baseEntity";
import type { Resource } from "./resources/resource.svelte";

export default class LivingEntity implements BaseEntity {
    name: string = "";
    attack: number = $state(0);
    defense: number = $state(0);
    attackSpeed: number = $state(0);
    critRate: number = $state(0.0);
    maxHp: number = $state(0);
    currentHp: number = $state(0)
    inventory: Resource[] = $state([])
    isDead = () => {
        return this.currentHp < 0
    }

    onKill = () => {
        const player = playerStore.get("player")
        this.inventory.forEach(i => player?.awardItem(i))
    }

    attackEntity = (other: LivingEntity) => {
        // Big pos diff = small attack. Small diff = attack does ~ x hp. Big neg diff = more damage
        const attackDefenseDifferential = (this.attack / other.defense).toFixed(2)

        let finalAttack = this.attack * Number.parseFloat(attackDefenseDifferential)

        if (finalAttack < 1) {
            finalAttack = 1
        }

        const rounded = Math.round(finalAttack)

        if (other.currentHp < rounded) {

        }


    }
    
}