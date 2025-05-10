import type LivingEntity from "../types/livingEntity.svelte";
import type BaseStat from "./base/baseStat";

export default class HealthStat implements BaseStat<number> {
    private FLOOR = 0

    // Set current and max HP
    constructor(currentHp: number, maxHp: number = currentHp) {
        const newCurrentHp = Math.max(this.FLOOR, currentHp)
        let newMaxHp = maxHp
        if (newMaxHp < currentHp) {
            newMaxHp = currentHp
        } else if (newMaxHp < this.FLOOR) {
            newMaxHp = this.FLOOR
        }
        this.value = newCurrentHp
        this.maxValue = newMaxHp
    }
    name = "HP";
    description = "Represents how much damage you can take before you fall";
    value = 0;
    maxValue = 0
    // Subtract damage value
    applyTo = (_attackingEntity: LivingEntity, defendingEntity: LivingEntity, val?: number) => {
        if (val == null || val < 0) {
            val = 0
        }
        // TODO: HP val - HP to defender
        return defendingEntity
    };
    
    

}