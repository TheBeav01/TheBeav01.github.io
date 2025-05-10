import type LivingEntity from "../types/livingEntity.svelte";
import type BaseStat from "./base/baseStat";

export default class DefenseStat implements BaseStat<number> {
    constructor(num: number) {
        this.value = num
    }
    name = "Attack";
    description = "Represents the power of your defense against attacks";
    value = 0;
    // Here, the attack went through all mitigation.
    // TODO: Do the damage step here
    applyTo = (attackingEntity: LivingEntity, defendingEntity: LivingEntity) => {
        return defendingEntity
    };

}