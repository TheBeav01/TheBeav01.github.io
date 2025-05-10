import type LivingEntity from "../types/livingEntity.svelte";
import type BaseStat from "./base/baseStat";

export default class AttackStat implements BaseStat<number> {
    constructor(num: number) {
        this.value = num
    }
    name = "Attack";
    description = "Represents the power of your attacks";
    value = 0;
    // Top level: An attack is mitigated by the following in order: Immunities, resistance, then defense. An attack is increased by it's crit on the damage step.
    applyTo = (attackingEntity: LivingEntity, defendingEntity: LivingEntity) => {
        return defendingEntity
    };
    
    

}