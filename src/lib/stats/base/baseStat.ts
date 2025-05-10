import type LivingEntity from "../../types/livingEntity.svelte";

export default interface BaseStat<T> {
    name: string,
    description: string,
    value: T
    applyTo: (attackingEntity: LivingEntity, defendingEntity: LivingEntity, other?: any) => any
}