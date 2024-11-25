import { playerStore } from "../../stores/playerStore.svelte";
import { resourceStore } from "../../stores/resourceStore.svelte";
import type BaseEntity from "../baseEntity";
import type Player from "../player";
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
    private maxDeconstructionTimer = 10 * 1000
    private deconstructTimer = this.maxDeconstructionTimer
    private deconstructAmount = 1
    public add(amt: number): void {
        super.add(amt)
        this.currentCost = this.calculateNextCost()
    }
    private _scalingFactor = 1
    get scalingFactor() : number {
        return this._scalingFactor
    }

    set scalingFactor(factor: number) {
        this._scalingFactor = factor
        this.currentCost = this.calculateNextCost()
    }
    private _baseCost = 0
    get baseCost() : number {
        return this._baseCost
    }
    set baseCost(cost: number) {
        this._baseCost = cost
        this.currentCost = this.calculateNextCost()
    }
    currentCost = $state(0)
    public equip(entity: Player) : Player {
        entity.attack += this.attack
        entity.defense += this.defense
        entity.attackSpeed += this.attackSpeed
        entity.critRate += this.critRate
        entity.maxHp += this.maxHp
        entity.awardItem(this, 1)
        console.log(entity.inventory)
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
        if (mana?._amt >= this.currentCost / 2) {
            return true
        }
        return false
    }

    public addDeconstructJob(amountToDeconstruct = 1) {
        this.deconstructAmount = amountToDeconstruct < 0 ? 1 : amountToDeconstruct
        this.deconstructTimer = this.maxDeconstructionTimer
    }

    public deconstructTick(delta: number) {
        this.deconstructTimer -= delta
        const amountToRemove = (delta / this.maxDeconstructionTimer) * this.deconstructAmount
        this.remove(amountToRemove)
    }
}