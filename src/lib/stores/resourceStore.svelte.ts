import type { Resource } from "../types/resources/resource.svelte";
import Mana from "../types/resources/mana.svelte";
import Soul from "../types/resources/souls.svelte";
import type SaveObject from "../types/saveObject.svelte";
import { gameSave } from "../types/gameSave.svelte";

const createDefaultMap = () => {
    const map: Map<string, Resource> = new Map()
    map.set("Mana", new Mana())
    map.set("Soul", new Soul())
    return map
}

export const createResourcesFromSave = (save: SaveObject) => {
    const map: Map<string, Resource> = new Map()
    save.resources.forEach(r => {
        if (!resourceStore.has(r.name)) {
            console.error("Unable to find resource. This shouldn't happen")
            return
        }
        const res = resourceStore.get(r.name)!
        res.add(r._amt)
        resourceStore.set(r.name, res)
    })
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

export const addResource = (resource: Resource) => {
    if (resource.isItem) {
        return
    }
    if (!resourceStore.has(resource.name)) {
        resourceStore.set(resource.name, resource)
        writeResourcesToSave()
        return
    }
    if (resourceStore.has(resource.name)) {
        const res = resourceStore.get(resource.name)!
        res.add(resource._amt)
        resourceStore.set(res.name, res)
    }
    writeResourcesToSave()
}
export let resources : Map<string, Resource> = createDefaultMap()
export let resourceStore = $state(resources)
