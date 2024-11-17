import LivingEntity from "../types/livingEntity.svelte";
import Player from "../types/player";

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
export function setEncounter(player: Player, partner: Player, newFoe: LivingEntity) {
    encounterState.state = {
        player: player, partner: partner, foe: newFoe
    }
}