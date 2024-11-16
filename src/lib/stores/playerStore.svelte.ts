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
    save.playerInv.forEach(i => {
        player.awardItem(i)
    })
    player.name = save.playerName
    player.currentHp = save.playerHp === undefined ? player.maxHp : save.playerHp
    const partner = new Player(true)
    save.partnerInv.forEach(i => {
        partner.awardItem(i)
    })
    partner.name = save.partnerName
    partner.currentHp = save.partnerHp === undefined ? partner.maxHp : save.partnerHp
    playerStore.set("player", player)
    playerStore.set("partner", partner)
    return playerStore

}

export const PARTNER_NAME = playerStore.get("partner")?.name