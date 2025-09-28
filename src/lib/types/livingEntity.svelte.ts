import AttackStat from "../stats/attack";
import AttackSpeedStat from "../stats/attackSpeed";
import CritRateStat from "../stats/critRate";
import DefenseStat from "../stats/defense";
import HealthStat from "../stats/health";
import { log } from "../stores/messageList.svelte";
import { playerStore } from "../stores/playerStore.svelte";
import { resourceStore } from "../stores/resourceStore.svelte";
import { AttackUtils } from "../utils/attackUtils";
import UpgradeUtils from "../utils/upgradeUtils";
import type BaseEntity from "./baseEntity";
import { Item } from "./resources/item.svelte";
import Mana from "./resources/mana.svelte";
import { Resource } from "./resources/resource.svelte";
import Soul from "./resources/souls.svelte";
import { Coordinates } from "./saveObject.svelte";

export default class LivingEntity implements BaseEntity {
    constructor(maxHp = 0) {
        this.hpStat = new HealthStat(maxHp)
    }
    name: string = "";
    baseAttack = 1
    attackStat = new AttackStat();
    defenseStat = new DefenseStat();
    // Attacks / s
    attackSpeedStat = new AttackSpeedStat();
    critRateStat = new CritRateStat();
    hpStat = new HealthStat(0, 0)
    readonly currentHp: number = this.hpStat.value
    inventory: Resource[] = []
    timeToAttack: number = $state(0)
    dead = false
    coordinates: Coordinates = new Coordinates(0, 0, 0)
    entityType : "Player" | 'Partner' | 'Foe' = "Foe"
    applyStats(hp: number | null,attack: number, def: number, speed: number, crit: number) {
        if (hp) {
            this.hpStat = new HealthStat(hp)
        }
        this.attackSpeedStat = new AttackSpeedStat(speed)
        this.defenseStat = new DefenseStat(def)
        this.attackStat = new AttackStat(attack)
        this.critRateStat = new CritRateStat(crit)
        return this
    }
    isDead() {
        return this.hpStat.isEmpty()
    }
    onKill() {
        this.onDefaultKill()
    }
    onDefaultKill() {
        const player = playerStore.get("player")
        const soul = new Soul()
        soul.add(1)
        this.inventory.push(soul)
        this.inventory.forEach(i => player?.awardItem(i))
    }
    
    getBaseDamage (other: LivingEntity) {
        return AttackUtils.calculateDamage(this, other)
    }
    
    canAttack() {
        return this.attackSpeedStat.value !== 0 && this.attackStat.value !== 0
    }

    shouldAttack(isManualAttack: boolean) {
        if (isManualAttack) {
            return true
        }
        if (!this.canAttack()) {
            return false
        }
        if (this.timeToAttack > 0) {
            return false;
        }
        return true
    }
    
    attackEntity(other: LivingEntity, manual = false) {
        const attackResult = this.attackStat.applyTo(this, other, {
            manual
        })
        if (!attackResult) {
            return other
        }
        other = attackResult
        const rounded = this.getBaseDamage(other)
        log(`${this.name} attacks ${other.name} for ${rounded} damage`)
        
        if (other.hpStat.value <= 0) {
            other.dead = true
            other.onKill()
            log(`${this.name} kills ${other.name}`)
            UpgradeUtils.getAvailablePlayerUpgrades(resourceStore)
            this.resetAttackTime()
            return other
        }
        if(manual) {
            return other
        }
        this.resetAttackTime()
        return other
    }
    
    resetAttackTime(){
        this.timeToAttack = 1000 / (this.attackSpeedStat.value ?? 1)
    }
    
    tick(diff: number){
        if (!this.canAttack()) {
            return false
        }
        this.timeToAttack -= diff
        return this.timeToAttack <= 0
    }

    fromBase(being: LivingEntity) {
        this.attackStat.value = being.attackStat.value
        this.name = being.name
        this.attackSpeedStat.value = being.attackSpeedStat.value
        const c = being.coordinates
        this.coordinates = new Coordinates(c.zone, c.sidePathPosition, c.world)
        this.critRateStat = being.critRateStat
        this.hpStat = new HealthStat(being.hpStat.value, being.hpStat.maxValue)
        this.dead = being.dead
        this.defenseStat = being.defenseStat
        this.inventory = being.inventory.map(i => {
            if (i instanceof Soul) {
                return new Soul().from(i)
            }
            else if (i instanceof Mana) {
                return new Mana().from(i)
            }
            else {
                return new Item(i as Item)
            }
        })
    }
    static from(foe: LivingEntity) {
        const f = new LivingEntity()
        f.fromBase(foe)
        return f
    }

    increaseBaseAttack(by: number) {
        this.baseAttack += Math.max(0,by)
    }
}