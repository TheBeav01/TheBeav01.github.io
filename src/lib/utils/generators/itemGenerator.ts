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
export const generateItems = (zone: number) => {
    const item = new Item()
    item.consumable = false
    item.attackStat.value = 0
    item.defenseStat.value = 0
    item.attackSpeedStat.value = 0
    item.critRateStat.value = 0
    let gennedItem = null
    gennedItem = pickItemFromWeightedList(ITEM_POOL_1)
    // TODO: Upgrade-based item pools
    item.name = gennedItem.name
    item.description = gennedItem.description
    const base = gennedItem.baseAmount ?? 1
    const mult = gennedItem.multiplier ?? 1
    item.amt = base
    item._amt = base
    item.genRatePerSecond = genRateMap.get(item.name) ?? 0.0
    
    return [item]
}