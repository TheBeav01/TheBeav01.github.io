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
    player.currentHp = save.playerHp === undefined ? player.maxHp : save.playerHp
    applyPlayerUpgrades(save, player)
    const partner = new Player(true)
    partner.name = save.partnerName
    partner.currentHp = save.partnerHp === undefined ? partner.maxHp : save.partnerHp
    applyPartnerUpgrades(save, partner)
    playerStore.set("player", player)
    playerStore.set("partner", partner)
    return playerStore

}

const applyPlayerUpgrades = (save: SaveObject, player: Player) => {
    player.attack = 1
    player.defense = 5
    player.maxHp = 5
    player.attackSpeed = 0
    player.critRate = 0
    save.playerInv.forEach(i => {
        player.awardItem(i)
    })

}
const applyPartnerUpgrades = (save: SaveObject, partner: Player) => {
    partner.attack = 0
    partner.defense = 5
    partner.maxHp = 5
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

export const PARTNER_NAME = playerStore.get("partner")?.name