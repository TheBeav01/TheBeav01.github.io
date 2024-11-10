import Player from "../types/player"

const buildMap = () => {
    const map = new Map()
    map.set("player", new Player())
    map.set("partner", new Player(true))
    return map
}
export const playerStore : Map<string, Player> = $state(buildMap())
