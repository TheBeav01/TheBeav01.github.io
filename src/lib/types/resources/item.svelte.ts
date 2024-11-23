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
    public equip(entity: LivingEntity) : LivingEntity {
        entity.attack += this.attack
        entity.defense += this.defense
        entity.attackSpeed += this.attackSpeed
        entity.critRate += this.critRate
        entity.maxHp += this.maxHp
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
        return thisItem
    }
}