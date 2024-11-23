import { gameSave } from "../types/gameSave.svelte";
import LivingEntity from "../types/livingEntity.svelte";
import Player from "../types/player";
import type SaveObject from "../types/saveObject.svelte";
import { saveGame } from "./gameSave.svelte";
import { getPartner, getPlayer, playerStore } from "./playerStore.svelte";

export interface Encounter {
    player: Player,
    partner: Player,
    foe: LivingEntity,
    remaining: number
}
export let encounterState : {
    state: Encounter
} = $state({
    state: {
        player: new Player(),
        partner: new Player(true),
        foe: new LivingEntity(0),
        remaining: 0
    }
})
export function setEncounter(newFoe: LivingEntity, player = getPlayer(), partner = getPartner()) {
    encounterState.state = {
        player, partner, foe: newFoe, remaining: encounterState.state.remaining
    }
}

export function onTurnFinish(player: Player, partner: Player, newFoe: LivingEntity) {
    setEncounter(newFoe, player, partner)
    playerStore.set("partner", partner)
    playerStore.set("player", player)
    gameSave.save.encounter = cloneEncounter(encounterState.state)
    saveGame()
}

export function attackManually() {
    const p = encounterState.state.player
    const f = p?.attackEntity(encounterState.state.foe, true)
    setEncounter(f)
    gameSave.save.encounter = encounterState.state
    saveGame()
    return f
}

export function simulateDamage(p: Player, onFoe: LivingEntity) {
    return p.getBaseDamage(onFoe)
}

export function tick(num?: number) {
    const remaining = num === undefined ? encounterState.state.remaining - 1 : num
    encounterState.state = {
        foe: encounterState.state.foe, player: encounterState.state.player, partner: encounterState.state.partner, remaining: remaining
    }
}

export function setupEncounter(save: SaveObject) {
    if (!save.encounter) {
        return
    }
    const enc = cloneEncounter(save.encounter)
    const p = Player.from(enc.player)
    const part = Player.fromPartner(enc.partner)
    const foe = LivingEntity.from(enc.foe)
    foe.resetAttackTime()
    onTurnFinish(p, part, foe)
}

export function cloneEncounter(encounter: Encounter) : Encounter {
    return {foe: encounter.foe, player: encounter.player, partner: encounter.partner, remaining: encounter.remaining}
}