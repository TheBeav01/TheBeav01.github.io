import type LivingEntity from "../types/livingEntity.svelte";
import type BaseStat from "./base/baseStat";

export default class AttackStat implements BaseStat<number> {
    constructor(num: number = 0) {
        this.value = Math.max(0, num)
    }
    name = "Attack";
    description = "Represents the power of your attacks";
    value = 0;
    // Top level: An attack is mitigated by the following in order: Immunities, resistance, then defense. An attack is increased by it's crit on the damage step.
    applyTo = (attackingEntity: LivingEntity, defendingEntity: LivingEntity, val?: any) : null | LivingEntity => {
        
        // If ded, it isn't our turn yet, or our stats aren't up to snuff
        if (attackingEntity.isDead() || defendingEntity.isDead() || !attackingEntity.shouldAttack(val.manual)) {
            return null
        }
        let damage = AttackUtils.calculateDamage(attackingEntity, defendingEntity)
        if (val.manual && damage < 1) {
            damage = 1
        }
        defendingEntity.hpStat.applyTo(attackingEntity, defendingEntity, damage)
        return defendingEntity
    };
    
}

export class AttackUtils {
    static calculateDamage(attackingEntity: LivingEntity, defendingEntity: LivingEntity) {
        const defense = defendingEntity.defenseStat.value ?? 1
        const attack = attackingEntity.attackStat.value
        // Big pos diff = small attack. Small diff = attack does ~ x hp. Big neg diff = more damage
        const attackDefenseDifferential = (attack / defense).toFixed(2)
        
        let finalAttack = Math.min(1, attack * Number.parseFloat(attackDefenseDifferential))
        return Math.round(finalAttack)
    }
}