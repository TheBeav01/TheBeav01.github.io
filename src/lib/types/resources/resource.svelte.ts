import { removeResource, tick } from "../../resource/resourceManager.svelte"

export abstract class Resource {
    
    /**
     * The name of the resource
     */
    public abstract name : string

    /**
     * The description of the resource
     */
    public abstract description : string
    /**
     * The amount of the resource
     */
    public amt = $state(0)

    /**
     * How many we get per second
     */
    public genRatePerSecond = $state(0.0)
    /**
     * True to remove the resource on ascencion
     */
    public abstract removeOnAscent : boolean
    /**
     * true if this resource can be consumed
     */
    public abstract consumable : boolean
    /**
     * True if this resource is a key one
     */
    public abstract isKey : boolean

    public abstract isItem : boolean

    public removeFromStore = () => {
        removeResource(this.name)
    }

    public add(amt: number) {
        let amtToAdd = amt ?? 0
        amtToAdd = amtToAdd < 0 ? 0 : amtToAdd
        this.amt += amtToAdd
    }

    public remove(amt: number) {
        let amtToRemove = amt ?? 0
        amtToRemove = amtToRemove > 0 ? 0 : amtToRemove
        this.amt -= Math.max(this.amt - amtToRemove, 0)
    }
}