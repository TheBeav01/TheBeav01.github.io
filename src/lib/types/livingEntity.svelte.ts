import { playerStore } from "../stores/playerStore.svelte";
import type BaseEntity from "./baseEntity";
import type { Resource } from "./resources/resource.svelte";

export default class LivingEntity implements BaseEntity {
    constructor(maxHp = 0) {
        this.maxHp = maxHp
        this.currentHp = this.currentHp
    }
    name: string = "";
    attack: number = 0;
    defense: number = 0;
    attackSpeed: number = 0;
    critRate: number = 0.0;
    maxHp: number = 0;
    currentHp: number = 0
    inventory: Resource[] = []
    timeToAttack: number = 0
    isDead = () => {
        return this.currentHp < 0
    }

    onKill = () => {
        const player = playerStore.get("player")
        this.inventory.forEach(i => player?.awardItem(i))
    }

    getBaseDamage = (other: LivingEntity) => {
        // Big pos diff = small attack. Small diff = attack does ~ x hp. Big neg diff = more damage
        const attackDefenseDifferential = (this.attack / other.defense).toFixed(2)

        let finalAttack = this.attack * Number.parseFloat(attackDefenseDifferential)

        if (finalAttack < 1) {
            finalAttack = 1
        }

        return Math.round(finalAttack)
    }

    attackEntity = (other: LivingEntity) => {
        const rounded = this.getBaseDamage(other)

        if (other.currentHp < rounded) {
            other.currentHp = 0
            other.onKill()
            this.resetAttackTime()
            return
        }
        other.currentHp -= rounded
        this.resetAttackTime()
    }

    resetAttackTime = () => {
        this.timeToAttack = this.attackSpeed * 1000
    }

    tick = (diff: number) => {
        this.timeToAttack -= diff
    }
    
}