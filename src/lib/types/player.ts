import type Resource from "../components/resource.svelte";
import { onDeath } from "../stores/gameState.svelte";
import LivingEntity from "./living-entity.svelte";

export default class Player extends LivingEntity {
    constructor(isPartner: boolean = false) {
        super()
        this.isPartner = isPartner
    }
    isPartner: boolean
    onKill = () => {
        if (this.isPartner) {
            onDeath.value = {...onDeath, partnerDead: true}
            return
        }
        onDeath.value = {...onDeath, playerDead: true}
        return
    };

    awardItem = (item: Resource) => {
        this.inventory.push(item)
    }
}