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
    // Attacks / s
    attackSpeed: number = 1;
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
        const defense = other.defense ?? 1
        // Big pos diff = small attack. Small diff = attack does ~ x hp. Big neg diff = more damage
        const attackDefenseDifferential = (this.attack / defense).toFixed(2)

        let finalAttack = this.attack * Number.parseFloat(attackDefenseDifferential)

        if (finalAttack < 1) {
            finalAttack = 1
        }

        return Math.round(finalAttack)
    }

    canAttack = () => {
        return this.attackSpeed !== 0 && this.attack !== 0
    }

    attackEntity = (other: LivingEntity) => {
        if (this.timeToAttack > 0 || !this.canAttack()) {
            return
        }
        const rounded = this.getBaseDamage(other)
        console.log(`${this.name} attacks ${other.name} for ${rounded} damage`)

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
        this.timeToAttack = 1000 / (this.attackSpeed ?? 1)
    }

    tick = (diff: number) => {
        if (!this.canAttack()) {
            return false
        }
        this.timeToAttack -= diff
        return this.timeToAttack <= 0
    }
}