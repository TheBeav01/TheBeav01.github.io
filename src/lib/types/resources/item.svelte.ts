import { playerStore } from "../../stores/playerStore.svelte";
import { resourceStore } from "../../stores/resourceStore.svelte";
import type BaseEntity from "../baseEntity";
import type LivingEntity from "../livingEntity.svelte";
import { Resource } from "./resource.svelte";

export class Item extends Resource implements BaseEntity {
    public name: string = "";
    public description: string = "";
    public removeOnAscent: boolean = true;
    public consumable: boolean = false;
    public isKey: boolean = false;
    public isItem: boolean = true;
    attack: number = 0;
    defense: number = 0;
    attackSpeed: number = 0;
    critRate: number = 0;
    maxHp = 0
    scalingFactor = 1
    baseCost = 0
    public equip<T extends BaseEntity>(entity: T) : T {
        entity.attack += this.attack
        entity.defense += this.defense
        entity.attackSpeed += this.attackSpeed
        entity.critRate += this.critRate
        entity.maxHp += this.maxHp
        this.add(1)
        return entity
    }
    public from(res: Resource): Resource {
        if (!res.isItem) {
            return res
        }
        const cloneFrom = res as Item
        const thisItem = new Item()
        thisItem.fromBase(cloneFrom)
        thisItem.add(cloneFrom._amt)
        thisItem.attack = cloneFrom.attack
        thisItem.attackSpeed = cloneFrom.attackSpeed
        thisItem.consumable = cloneFrom.consumable
        thisItem.critRate = cloneFrom.critRate
        thisItem.defense = cloneFrom.defense
        thisItem.description = cloneFrom.description
        thisItem.genRatePerSecond = cloneFrom.genRatePerSecond
        thisItem.isItem = true
        thisItem.isKey = cloneFrom.isKey
        thisItem.maxHp = cloneFrom.maxHp
        thisItem.name = cloneFrom.name
        thisItem.removeOnAscent = cloneFrom.removeOnAscent
        thisItem.scalingFactor = cloneFrom.scalingFactor
        thisItem.baseCost = cloneFrom.baseCost
        return thisItem
    }

    public calculateNextCost() {
        const exponent = Math.pow(this.scalingFactor, this.amt ?? 1)
        return this.baseCost * exponent
    }

    public getUpgradeText() {
        if (this.defense > 0) {
            return `+${this.defense} Defense`
        }
        return `+${this.attack} Attack`
    }

    public displayItem(idx: number) {
        if (idx == 0) {
            return true
        }
        const hasItem = playerStore.get("player")!.inventory.find(i => i.name === this.name) !== undefined
        const partnerHasItem = playerStore.get("partner")!.inventory.find(i => i.name === this.name) !== undefined
        console.log(hasItem, partnerHasItem)
        if (hasItem || partnerHasItem) {
            return true
        }
        const mana = resourceStore.get("Mana")!
        console.log(this.amt)
        if (mana?._amt >= (this.calculateNextCost()) / 2) {
            return true
        }
        return false
    }
}