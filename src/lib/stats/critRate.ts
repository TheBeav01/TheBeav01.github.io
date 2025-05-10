import type LivingEntity from "../types/livingEntity.svelte";
import type BaseStat from "./base/baseStat";

export default class CritRate implements BaseStat<number> {
    private FLOOR = 0
    private CEIL = 1000
    constructor(num: number) {
        this.value = num
    }
    name = "Critical Rate";
    description = "Represents how often you critically strike";
    value = 0;
    // TODO: Crit rate calculation here
    applyTo = (attackingEntity: LivingEntity, defendingEntity: LivingEntity) => {
        return defendingEntity
    };
    
    

}