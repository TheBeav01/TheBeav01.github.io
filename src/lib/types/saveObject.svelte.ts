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
     * Player inventory. Deconstructable resources
     */
    playerInv: Resource[] = []

    /**
     * Partner name
    */
   
   partnerName = ""
   
   /**
    * Partner upgrades
    */

   partnerInv: Resource[] = []

    /**
     * The story position
     */
    storyPos = $state(0)

    /**
     * The location of the player
     */
    coordinates = new Coordinates()

    /**
     * Owned global resources
     */
    resources: Resource[] = []
}

/**
 * Coordinates represent the location of the player in a given world
 */
class Coordinates {
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
}