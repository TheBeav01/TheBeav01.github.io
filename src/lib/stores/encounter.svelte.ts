import LivingEntity from "../types/livingEntity.svelte";
import Player from "../types/player";
import { getPartner, getPlayer, playerStore } from "./playerStore.svelte";

interface Encounter {
    player: Player,
    partner: Player,
    foe: LivingEntity
}
export let encounterState : {
    state: Encounter
} = $state({
    state: {
        player: new Player(),
        partner: new Player(true),
        foe: new LivingEntity(0)
    }
})
export function setEncounter(newFoe: LivingEntity, player = getPlayer(), partner = getPartner()) {
    encounterState.state = {
        player, partner, foe: newFoe
    }
}

export function onTurnFinish(player: Player, partner: Player, newFoe: LivingEntity) {
    setEncounter(newFoe, player, partner)
    playerStore.set("partner", partner)
    playerStore.set("player", player)
}

// export function afterManualAttack(foe: LivingEntity) {
//     setEncounter(foe)
// }

export function attackManually() {
    console.log("A")
    const p = encounterState.state.player
    const f = p?.attackEntity(encounterState.state.foe, true)
    setEncounter(f)
    return f
}

export function simulateDamage(p: Player, onFoe: LivingEntity) {
    return p.getBaseDamage(onFoe)
}