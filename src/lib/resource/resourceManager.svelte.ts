import type { Resource } from "../types/resources/resource.svelte";
import { resources, resourceStore } from "../stores/resourceStore.svelte";

const setGenRates = () => {
    const map = new Map()
    map.set("Chest Bone", -0.5)
    return map
}
export const genRateMap = setGenRates()
export const getResource = (name: string) : Resource | undefined => {
    return resources.get(name)
}
export const addResource = (newResource: Resource) => {
    resources.set(newResource.name, newResource)
}

export const removeResource = (name: string) => {
    resources.delete(name)
}

export const tick = (resource: Resource, tick: number = 0) => {
    let amountToAdd = 0
    if (resource.isUpgrade || resource.name == "Mana") {
        return amountToAdd
    }
    if (tick && resource.tickEnabled) {
        const seconds = tick / 1000
        amountToAdd = seconds * resource.genRatePerSecond
        if (amountToAdd < 0) {
            resource.remove(amountToAdd)
        } else {
            resource.add(amountToAdd)
        }
    }
    resourceStore.set(resource.name, resource)
    return Math.abs(amountToAdd)
}