import type LivingEntity from "../types/livingEntity.svelte"

export class AttackUtils {
    static calculateDamage(attackingEntity: LivingEntity, defendingEntity: LivingEntity, includeFractional = false) {
        const defense = defendingEntity.defenseStat.value ?? 1
        const attack = attackingEntity.attackStat.value
        // Big pos diff = small attack. Small diff = attack does ~ x hp. Big neg diff = more damage
        const attackDefenseDifferential = (attack / defense).toFixed(2)
        let finalAttack = attackingEntity.baseAttack * Number.parseFloat(attackDefenseDifferential)
        console.log(`${attack}/${defense} --> ${attackDefenseDifferential} to ${finalAttack}`)
        // Apply fractional
        const rand = Math.random()
        const fractional = Number((finalAttack - Math.trunc(finalAttack)).toFixed(5))
        if (includeFractional) {
            return finalAttack
        }
        if (rand < fractional) {
            return Math.trunc(finalAttack) + 1
        }
        return Math.floor(finalAttack)
    }
}