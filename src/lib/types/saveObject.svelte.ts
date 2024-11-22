import type { Item } from "./resources/item.svelte"
import type { Resource } from "./resources/resource.svelte"

export default class SaveObject {
    /**
     * The game version
     */
    gameVersion = "0.3.0"

    /**
     * Player name
     */
    playerName = ""

    /**
     * Player health
     */
    playerHp = -1

    /**
     * Player inventory. Deconstructable resources
     */
    playerInv: Resource[] = []

    /**
     * Partner name
    */
   
   partnerName = ""
   
   /**
    * Partner health
    */
   partnerHp = -1
   /**
    * Partner upgrades
    */

   partnerInv: Resource[] = []

    /**
     * The story position
     */
    storyPos = 0

    /**
     * The location of the player
     */
    coordinates = new Coordinates(0, 0, 0)

    /**
     * Owned global resources
     */
    resources: Resource[] = []
}

/**
 * Coordinates represent the location of the player in a given world
 */
export class Coordinates {
    constructor(zone: number, sidepath: -1 | 0 | 1, world: number) {
        this.zone = zone
        this.sidePathPosition = sidepath
        this.world = zone
    }
    
    /**
     * The zone. The higher the zone, the stronger the enemy and the higher amount of rewards
     */
    zone = 0
    /**
     * The side path. Negative = Left, zero = not selected, 1 = Right
     */
    sidePathPosition: -1 | 0 | 1 = 0

    /**
     * The world ID
     */
    world = 0



    coordsMatch(other: Coordinates) {
        if (other == null && this == null) {
            return true
        }
        if (other.world != this.world) {
            return false;
        }
        if (other.sidePathPosition != this.sidePathPosition) {
            return false
        }
        if (other.zone != this.zone) {
            return false
        }
        return true
    }
}