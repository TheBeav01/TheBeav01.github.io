import { Resource } from "./resource.svelte";

export default class Mana extends Resource {
    public name: string = "Mana";
    public description: string = "Its energy calls to you for your use."
    public consumable: boolean = true
    public isKey: boolean = false
    public isItem: boolean = false
    public removeOnAscent: boolean = true
}