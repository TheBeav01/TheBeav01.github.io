import Player from "../types/player"
import type SaveObject from "../types/saveObject.svelte"

const buildMap = () => {
    const map = new Map()
    map.set("player", new Player())
    map.set("partner", new Player(true))
    return map
}

export const createPlayersFromSave = (save: SaveObject) => {
    const player = new Player()
    save.playerInv.forEach(i => {
        player.awardItem(i)
    })

    const partner = new Player(true)
    save.partnerInv.forEach(i => {
        partner.awardItem(i)
    })
    const map = new Map()
    map.set("player", player)
    map.set("partner", partner)
    return map

}
export const playerStore : Map<"player" | "partner", Player> = $state(buildMap())

export const PARTNER_NAME = playerStore.get("partner")?.name