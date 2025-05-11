import type { Resource } from "../types/resources/resource.svelte";
import { resources, resourceStore } from "../stores/resourceStore.svelte";

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
    if (resource.isItem || resource.isUpgrade) {
        return
    }
    if (tick) {
        const seconds = tick / 1000
        const amountToAdd = seconds * resource.genRatePerSecond
        if (amountToAdd < 0) {
            resource.remove(amountToAdd)
        } else {
            resource.add(amountToAdd)
        }
    }
    resourceStore.set(resource.name, resource)
}