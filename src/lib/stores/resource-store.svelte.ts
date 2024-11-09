import { writable } from "svelte/store";
import type { Resource } from "../types/resources/resource.svelte";
import { Gold } from "../types/resources/gold.svelte";

const createDefaultMap = () => {
    const map: Map<string, Resource> = new Map()
    map.set("Gold", new Gold())
    return map
}
export let resources : Map<string, Resource> = createDefaultMap()
export let resourceStore = $state(resources)
