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

export const tick = (resource: Resource) => {
    resourceStore.set(resource.name, resource)
}