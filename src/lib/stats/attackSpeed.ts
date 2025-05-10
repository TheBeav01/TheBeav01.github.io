import type LivingEntity from "../types/livingEntity.svelte";
import type BaseStat from "./base/baseStat";

export default class AttackSpeedStat implements BaseStat<number> {
    private CAP = 5
    private FLOOR = 0.1
    constructor(num: number) {
        let newNum = num
        if (num > this.CAP) {
            newNum = this.CAP
        }
        else if (num < this.FLOOR) {
            newNum = this.FLOOR
        }
        this.value = newNum
    }
    name = "Attack Speed";
    description = "Represents the speed you attack at in attacks/second";
    value = 1
    // Doesn't need to do anything
    applyTo = (attackingEntity: LivingEntity, _defendingEntity: LivingEntity) => {
        return attackingEntity
    };
    
    

}