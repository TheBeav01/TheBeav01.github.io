import { writable } from "svelte/store";
import type { Resource } from "../types/resources/resource.svelte";
import Mana from "../types/resources/mana.svelte";
import Soul from "../types/resources/souls.svelte";
import Metal from "../types/resources/metal.svelte";
import type SaveObject from "../types/saveObject.svelte";

const createDefaultMap = () => {
    const map: Map<string, Resource> = new Map()
    map.set("Mana", new Mana())
    map.set("Soul", new Soul())
    map.set("Metal", new Metal())
    return map
}

export const createResourcesFromSave = (save: SaveObject) => {
    const map: Map<string, Resource> = new Map()
    save.resources.forEach(r => {
        map.set(r.name, r)
    })
    return map
}
export let resources : Map<string, Resource> = createDefaultMap()
export let resourceStore = $state(resources)
