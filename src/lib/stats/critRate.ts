import type LivingEntity from "../types/livingEntity.svelte";
import type BaseStat from "./base/baseStat";

export default class CritRateStat implements BaseStat<number> {
    private FLOOR = 0
    private CEIL = 10
    constructor(num: number = 0.0) {
        let newCrit = num
        if (num < this.FLOOR) {
            newCrit = this.FLOOR
        }
        else if (num > this.CEIL) {
            newCrit = this.CEIL
        }
        this.value = newCrit
    }
    name = "Critical Rate";
    description = "Represents how often you critically strike";
    value = 0;
    // TODO: Crit rate calculation here
    applyTo = (attackingEntity: LivingEntity, defendingEntity: LivingEntity) => {
        return defendingEntity
    };
    
    

}