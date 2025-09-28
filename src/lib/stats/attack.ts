import { log } from "../stores/messageList.svelte";
import { playerStore } from "../stores/playerStore.svelte";
import { getPassive } from "../types/gameSave.svelte";
import type LivingEntity from "../types/livingEntity.svelte";
import { AttackUtils } from "../utils/attackUtils";
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
        const defenderIsUs = defendingEntity.entityType != "Foe"
        
        // If ded, it isn't our turn yet, or our stats aren't up to snuff
        if (attackingEntity.isDead() || defendingEntity.isDead() || !attackingEntity.shouldAttack(val.manual)) {
            return null
        }
        let originalDamage = AttackUtils.calculateDamage(attackingEntity, defendingEntity)
        if (val.manual && originalDamage < 1) {
            originalDamage = 1
        }
        // Swoop/Rescue
        if (defenderIsUs && originalDamage >= defendingEntity.hpStat.value) {
            const swoop = getPassive("Swoop")
            const rescue = getPassive("Rescue")
            const swoopToggled = swoop && swoop.bought && swoop.toggled
            const rescueToggled = rescue && rescue.bought && rescue.toggled
            // if (swoopToggled && rescueToggled) {
            //     // Attacker goes to the creature with a higher defense and HP
            //     const player = playerStore.get("player")!
            //     const partner = playerStore.get("partner")!
            //     if (player.defenseStat >= partner.defenseStat) {
            //         defendingEntity = player
            //         log("You defend [[partnername]]")
            //     } else {
            //         defendingEntity = partner
            //         log("[[partnername]] defends you")
            //     }
            // }
            if (swoop && swoop.bought && swoop.toggled && defendingEntity.entityType == "Player") {
                defendingEntity = playerStore.get("partner")!
                log("[[partnername]] defends you")
            }
            else if (rescue && rescue.bought && rescue.toggled && defendingEntity.entityType == "Partner") {
                defendingEntity = playerStore.get("player")!
                log("You defend [[partnername]]")
            }
        }
        let recalculated = AttackUtils.calculateDamage(attackingEntity, defendingEntity)
        defendingEntity.hpStat.applyTo(attackingEntity, defendingEntity, recalculated)
        return defendingEntity
    };
    
}