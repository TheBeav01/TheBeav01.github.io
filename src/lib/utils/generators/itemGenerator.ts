import { CHEST_BONE } from "../../constants/constants"
import { genRateMap } from "../../resource/resourceManager.svelte"
import { Item } from "../../types/resources/item.svelte"
import { pickItemFromWeightedList, type Spawnable } from "./sharedGenerator"

interface BaseItem extends Spawnable {
    name: string
    description: string
    multiplier?: number
    baseAmount?: number
}


const ITEM_POOL_1 : BaseItem[] = [{
    name: CHEST_BONE,
    description: "The chest bone of an animal. Better than nothing."
}]

const ITEM_POOL_2 : BaseItem[] = [{
    name: CHEST_BONE,
    description: "The chest bone of an animal. Better than nothing.",
    baseAmount: 2
}, {
    name: "Leg Bone",
    description: "The leg of an animal",
    multiplier: 1.2
}]
export const generateItems = (zone: number) => {
    const item = new Item()
    item.consumable = false
    item.attackStat.value = 0
    item.defenseStat.value = 0
    item.attackSpeedStat.value = 0
    item.critRateStat.value = 0
    let gennedItem = null
    if (zone > 0 && zone <= 8) {
        gennedItem = pickItemFromWeightedList(ITEM_POOL_1)
    }
    else if (zone > 8 && zone <= 12) {
        gennedItem = pickItemFromWeightedList(ITEM_POOL_2)
    }
    else {
        gennedItem = pickItemFromWeightedList(ITEM_POOL_1)
    }
    item.name = gennedItem.name
    item.description = gennedItem.description
    const base = gennedItem.baseAmount ?? 1
    const mult = gennedItem.multiplier ?? 1
    item.amt = base
    item._amt = base
    item.genRatePerSecond = genRateMap.get(item.name) ?? 0.0
    
    return [item]
}