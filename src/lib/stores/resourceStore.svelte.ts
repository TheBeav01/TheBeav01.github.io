import type { Resource } from "../types/resources/resource.svelte";
import Mana from "../types/resources/mana.svelte";
import Soul from "../types/resources/souls.svelte";
import type SaveObject from "../types/saveObject.svelte";
import { gameSave } from "../types/gameSave.svelte";
import { Item } from "../types/resources/item.svelte";
import Upgrade from "../types/resources/upgrade.svelte";
import StoryUtils from "../utils/storyUtils.svelte";
import { genRateMap } from "../resource/resourceManager.svelte";
import { SvelteMap } from "svelte/reactivity";

const createDefaultMap = () => {
    const map: SvelteMap<string, Resource> = new SvelteMap()
    map.set("Mana", new Mana())
    map.set("Soul", new Soul())
    return map
}

export const createResourcesFromSave = (save: SaveObject) => {
    const map: Map<string, Resource> = new Map()
    save.resources.forEach(r => {
        if (!resourceStore.has(r.name)) {
            let res = null
            if (r.isUpgrade) {
                const rau = r as Upgrade
                res = new Upgrade(rau)
                res.isPassive = rau.isPassive
                res.upgradeToggled = rau.upgradeToggled
                res.togglable = rau.togglable
                const upgrade = StoryUtils.allUpgrades.find(u => u.name === r.name)
                if (upgrade) {
                    res.scalingFactor = upgrade.scalingFactor
                    res.baseCost = upgrade.baseCost
                    res.resourceUsed = upgrade.resourceUsed
                    res.attackStat = upgrade.attackStat
                    res.defenseStat = upgrade.defenseStat
                }
            }
            else if (r.isItem) {
                res = new Item(r as Item)
            }
            if (!res) {
                return
            }
            res.genRatePerSecond = genRateMap.get(res.name) ?? 0.0
            resourceStore.set(res.name, res)
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

export const addResource = (resource: Resource, amountToAdd = resource._amt) => {
    if (!resourceStore.has(resource.name)) {
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
