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
}