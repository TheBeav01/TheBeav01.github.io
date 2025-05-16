import type LivingEntity from "../types/livingEntity.svelte"

export class AttackUtils {
    static calculateDamage(attackingEntity: LivingEntity, defendingEntity: LivingEntity) {
        const defense = defendingEntity.defenseStat.value ?? 1
        const attack = attackingEntity.attackStat.value
        // Big pos diff = small attack. Small diff = attack does ~ x hp. Big neg diff = more damage
        const attackDefenseDifferential = (attack / defense).toFixed(2)
        
        let finalAttack = Math.max(1, attack * Number.parseFloat(attackDefenseDifferential))
        return Math.round(finalAttack)
    }
}