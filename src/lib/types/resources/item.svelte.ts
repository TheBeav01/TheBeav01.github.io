import AttackStat from "../../stats/attack";
import AttackSpeedStat from "../../stats/attackSpeed";
import CritRateStat from "../../stats/critRate";
import DefenseStat from "../../stats/defense";
import HealthStat from "../../stats/health";
import type BaseEntity from "../baseEntity";
import type Player from "../player";
import { Resource } from "./resource.svelte";

export class Item extends Resource implements BaseEntity {
    constructor(from?: Item) {
        super(from as Resource)
        if (!from) {
            return
        }
        this.attackStat = from.attackStat
        this.attackSpeedStat = from.attackSpeedStat
        this.consumable = from.consumable
        this.critRateStat = from.critRateStat
        this.defenseStat = from.defenseStat
        this.description = from.description
        this.genRatePerSecond = from.genRatePerSecond
        this.isKey = from.isKey
        this.hpStat = from.hpStat
        this.name = from.name
        this.removeOnAscent = from.removeOnAscent
        this.scalingFactor = from.scalingFactor
        this.baseCost = from.baseCost
        this.add(from._amt)

    }
    public name: string = "";
    public description: string = "";
    public removeOnAscent: boolean = true;
    public consumable: boolean = false;
    public isKey: boolean = false;
    public readonly isItem: boolean = true;
    attackStat = new AttackStat(0);
    readonly attack = this.attackStat.value
    defenseStat = new DefenseStat(0);
    readonly defense = this.defenseStat.value
    attackSpeedStat = new AttackSpeedStat(0);
    readonly attackSpeed = this.attackSpeedStat.value
    critRateStat = new CritRateStat(0);
    readonly critRate = this.critRateStat.value
    readonly maxHp = 0
    hpStat = new HealthStat(0)
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
    public equip(entity: Player, amt?: number) : Player {
        if (amt != null) {
            return ItemUtils.equipBulk(this, entity)
        }
        return ItemUtils.equipItem(this, entity)
    }

    public calculateNextCost() {
        const exponent = Math.pow(this.scalingFactor, this.amt ?? 1)
        return this.baseCost * exponent
    }

    public getUpgradeText() {
        if (this.defenseStat.value > 0) {
            return `+${this.defenseStat.value} Defense`
        }
        return `+${this.attackStat.value} Attack`
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

export class ItemUtils {
    static equipItem(item: Item, ontoEntity: Player) : Player {
        ontoEntity.attackStat.value += item.attackStat.value
        ontoEntity.defenseStat.value += item.defenseStat.value
        ontoEntity.attackSpeedStat.value += item.attackSpeedStat.value
        ontoEntity.critRateStat.value += item.critRateStat.value
        ontoEntity.hpStat.maxValue += item.maxHp
        ontoEntity.awardItem(item, 1)
        console.log(ontoEntity.inventory)
        return ontoEntity
    }

    static equipBulk(item: Item, ontoEntity: Player) : Player {
        ontoEntity.attackStat.value += item.attackStat.value * item._amt
        ontoEntity.defenseStat.value += item.defenseStat.value * item._amt
        ontoEntity.attackSpeedStat.value += item.attackSpeedStat.value * item._amt
        ontoEntity.critRateStat.value += item.critRateStat.value * item._amt
        ontoEntity.hpStat.maxValue += item.maxHp * item._amt
        ontoEntity.inventory.push(item)
        console.log(ontoEntity.inventory)
        return ontoEntity
    }
}