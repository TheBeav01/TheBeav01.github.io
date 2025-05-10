import { AttackUtils } from "../stats/attack";
import { encounterState, onTurnFinish } from "../stores/encounter.svelte";
import type LivingEntity from "../types/livingEntity.svelte";
import type Player from "../types/player";
import { generateRandomNumber } from "../utils/gameUtils.svelte";

export class CombatLoop {
    static tick(diff: number) {
        //Subtract all time to attacks. Partner -> Enemies
        const currentFoe = encounterState.state.foe
        const partner = encounterState.state.partner
        const player = encounterState.state.player
        if (!currentFoe.name || currentFoe.dead || partner.dead || player.dead) {
            return
        }
        const partnerUpdate = partner.tick(diff)
        const foeUpdate = currentFoe.tick(diff)
        if (partnerUpdate) {
            //If expired, select target and attack
            partner.attackEntity(currentFoe)
        }
        if (foeUpdate) {
            const willAttackPlayer = this.willAttack(player, currentFoe)
            if (willAttackPlayer) {
                currentFoe.attackEntity(player)
            } else {
                // Random for now
                const random = generateRandomNumber(100, 1)
                if (random < 50) {
                    currentFoe.attackEntity(player)
                } else {
                    currentFoe.attackEntity(partner)
                }
            }
        }
        if (partnerUpdate || foeUpdate) {
            onTurnFinish(player, partner, currentFoe)
        }
    }

    private static willAttack (player: Player, currentFoe: LivingEntity) {
        return AttackUtils.calculateDamage(currentFoe, player) >= player.hpStat.value
    }
}