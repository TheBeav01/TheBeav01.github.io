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
    player.maxHp = 15
    applyPlayerUpgrades(save, player)
    player.currentHp = isUnset(save.playerHp) ? player.maxHp : save.playerHp
    const partner = new Player(true)
    partner.name = save.partnerName
    partner.maxHp = 25
    applyPartnerUpgrades(save, partner)
    partner.currentHp = isUnset(save.partnerHp) ? partner.maxHp : save.partnerHp
    playerStore.set("player", player)
    playerStore.set("partner", partner)
    return playerStore

}

const isUnset = (hp: number | undefined) => {
    return hp === undefined || hp < 0
}

const applyPlayerUpgrades = (save: SaveObject, player: Player) => {
    player.attack = 1
    player.defense = 4
    player.attackSpeed = 0
    player.critRate = 0
    save.playerInv.forEach(i => {
        player.awardItem(i)
    })

}
const applyPartnerUpgrades = (save: SaveObject, partner: Player) => {
    partner.attack = 0
    partner.defense = 8
    partner.attackSpeed = 0
    partner.critRate = 0
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