import AttackStat from "../stats/attack"
import AttackSpeedStat from "../stats/attackSpeed"
import CritRateStat from "../stats/critRate"
import DefenseStat from "../stats/defense"
import HealthStat from "../stats/health"
import Player from "../types/player"
import type SaveObject from "../types/saveObject.svelte"
const buildMap = () => {
    const map = new Map()
    map.set("player", new Player())
    map.set("partner", new Player(true))
    return map
}
export let playerStore : Map<"player" | "partner", Player> = $state(buildMap())

export const createPlayersFromSave = (save: SaveObject) => {
    const player = new Player()
    player.name = save.playerName
    player.hpStat = new HealthStat(15)
    player.hpStat.maxValue = 15
    applyPlayerUpgrades(save, player)
    player.hpStat.value = isUnset(save.playerHp) ? player.hpStat.maxValue : save.playerHp
    const partner = new Player(true)
    partner.name = save.partnerName
    partner.hpStat.maxValue = 25
    applyPartnerUpgrades(save, partner)
    partner.hpStat.value = isUnset(save.partnerHp) ? partner.hpStat.maxValue : save.partnerHp
    playerStore.set("player", player)
    playerStore.set("partner", partner)
    if (save.encounter) {
        save.encounter.partner = partner
        save.encounter.player = player
    }
    return playerStore

}

const isUnset = (hp: number | undefined) => {
    return hp === undefined || hp < 0
}

const applyPlayerUpgrades = (save: SaveObject, player: Player) => {
    player.attackStat = new AttackStat(1)
    player.defenseStat = new DefenseStat(4)
    player.attackSpeedStat = new AttackSpeedStat(0)
    player.critRateStat = new CritRateStat(0)
    save.playerInv.forEach(i => {
        player.awardItem(i)
    })

}
const applyPartnerUpgrades = (save: SaveObject, partner: Player) => {
    partner.attackStat = new AttackStat(0)
    partner.defenseStat = new DefenseStat(8)
    partner.attackSpeedStat = new AttackSpeedStat(0)
    partner.critRateStat = new CritRateStat(0)
    save.playerInv.forEach(i => {
        partner.awardItem(i)
    })

}

export const getPlayer = () => {
    return playerStore.get("player") ?? new Player()
}

export const getPartner = () => {
    return playerStore.get("partner") ?? new Player(true)
}

export const getPartnerName = () => {
    return playerStore.get("partner")?.name
}