import { Resource } from "./resource.svelte";

export default class Metal extends Resource {
    public name: string = "Metal";
    public description: string = "It looks far too shiny and smooth to be real. It calls to your use.";
    public removeOnAscent: boolean = true;
    public consumable: boolean = true;
    public isKey: boolean = false;
    public isItem: boolean = false;
    
}