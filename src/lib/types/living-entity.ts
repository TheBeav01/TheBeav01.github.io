import type Resource from "../components/resource.svelte";
import type BaseEntity from "./base-entity";

export default class LivingEntity implements BaseEntity {
    name: string = "";
    attack: number = 0;
    defense: number = 0;
    attackSpeed: number = 0;
    critRate: number = 0;
    maxHp: number = 0
    currentHp: number = 0
    inventory: Resource[] = []
    isDead = () => {
        return this.currentHp < 0
    }

    onKill = () => {
        
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