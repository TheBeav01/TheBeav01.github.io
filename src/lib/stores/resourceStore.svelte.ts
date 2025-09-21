import type { Resource } from "../types/resources/resource.svelte";
import Mana from "../types/resources/mana.svelte";
import Soul from "../types/resources/souls.svelte";
import { gameSave } from "../types/gameSave.svelte";
import { SvelteMap } from "svelte/reactivity";

const createDefaultMap = () => {
    const map: SvelteMap<string, Resource> = new SvelteMap()
    map.set("Mana", new Mana())
    map.set("Soul", new Soul())
    return map
}

function writeResourcesToSave() : void {
    resourceStore.forEach((v, k) => {
        const resIdx = gameSave.save.resources.findIndex(item => item.name === k)
        if (resIdx < 0) {
            gameSave.save.resources.push(v)
        } else {
            gameSave.save.resources[resIdx] = v
        }
    })

}

export const addResource = (resource: Resource, amountToAdd = resource._amt) => {
    if (!resourceStore.has(resource.name)) {
        if (resource.isUpgrade && resource.amt == 0) {
            resource.add(amountToAdd)
        }
        resourceStore.set(resource.name, resource)
        
        writeResourcesToSave()
        return
    }
    const res = resourceStore.get(resource.name)!
    res.add(amountToAdd)
    resourceStore.set(res.name, res)
    writeResourcesToSave()
}

export const addXToResource = (resource: string, amt: number) => {
    if (!resourceStore.has(resource)) {
        return
    }
    const res = resourceStore.get(resource)!
    res.add(amt)
    resourceStore.set(res.name, res)
    writeResourcesToSave()
}
export let resources : SvelteMap<string, Resource> = createDefaultMap()
export let resourceStore = $state(resources)
