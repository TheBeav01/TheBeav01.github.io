import { getPartnerName } from "../../stores/playerStore.svelte";
import { Resource } from "./resource.svelte"

export default class Soul extends Resource {
    public removeOnAscent: boolean = true;
    public consumable: boolean = true;
    public isKey: boolean = false;
    public isItem: boolean = false;
    public name: string = "Soul";
    public description: string = `An etheral essence all creatures possess. ${getPartnerName()} reacts strongly to it.`;
    public from(_res: Resource): Resource {
        const soul = new Soul()
        soul.add(1)
        return soul
    }
}