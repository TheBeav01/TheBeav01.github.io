import { Resource } from "./resource.svelte";

export default class Mana extends Resource {
    public name: string = "Mana";
    public description: string = "Its energy calls to you for your use."
    public consumable: boolean = true
    public isKey: boolean = false
    public isItem: boolean = false
    public removeOnAscent: boolean = true
    public from(res: Resource): Resource {
        if (!(res instanceof Mana)) {
            return res
        }
        const mana = new Mana()
        mana.fromBase(res)
        return mana
    }
}