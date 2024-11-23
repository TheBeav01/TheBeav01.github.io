import { log } from "../stores/messageList.svelte";
import { playerStore } from "../stores/playerStore.svelte";
import type BaseEntity from "./baseEntity";
import { Item } from "./resources/item.svelte";
import Mana from "./resources/mana.svelte";
import { Resource } from "./resources/resource.svelte";
import Soul from "./resources/souls.svelte";
import { Coordinates } from "./saveObject.svelte";

export default class LivingEntity implements BaseEntity {
    constructor(maxHp = 0) {
        this.maxHp = maxHp
        this.currentHp = this.currentHp
    }
    name: string = "";
    attack: number = 0;
    defense: number = 0;
    // Attacks / s
    attackSpeed: number = 1;
    critRate: number = 0.0;
    maxHp: number = 0;
    currentHp: number = 0
    inventory: Resource[] = []
    timeToAttack: number = $state(0)
    dead = false
    coordinates: Coordinates = new Coordinates(0, 0, 0)
    isDead() {
        return this.currentHp <= 0 && this.maxHp > 0
    }
    onKill() {
        this.onDefaultKill()
    }
    onDefaultKill() {
        const player = playerStore.get("player")
        this.inventory.forEach(i => player?.awardItem(i))
    }
    
    getBaseDamage (other: LivingEntity) {
        const defense = other.defense ?? 1
        // Big pos diff = small attack. Small diff = attack does ~ x hp. Big neg diff = more damage
        const attackDefenseDifferential = (this.attack / defense).toFixed(2)
        
        let finalAttack = this.attack * Number.parseFloat(attackDefenseDifferential)
        
        if (finalAttack < 1) {
            finalAttack = 1
        }
        
        return Math.round(finalAttack)
    }
    
    canAttack() {
        return this.attackSpeed !== 0 && this.attack !== 0
    }
    
    attackEntity(other: LivingEntity, manual = false) {
        if (other.dead || this.dead) {
            return other
        }
        if (!manual && (this.timeToAttack > 0 || !this.canAttack())) {
            return other
        }
        const rounded = this.getBaseDamage(other)
        log(`${this.name} attacks ${other.name} for ${rounded} damage`)
        
        if (other.currentHp <= rounded) {
            other.currentHp = 0
            other.dead = true
            other.onKill()
            log(`${this.name} kills ${other.name}`)
            this.resetAttackTime()
            return other
        }
        other.currentHp -= rounded
        if(manual) {
            return other
        }
        this.resetAttackTime()
        return other
    }
    
    resetAttackTime(){
        this.timeToAttack = 1000 / (this.attackSpeed ?? 1)
    }
    
    tick(diff: number){
        if (!this.canAttack()) {
            return false
        }
        this.timeToAttack -= diff
        return this.timeToAttack <= 0
    }

    fromBase(being: LivingEntity) {
        this.attack = being.attack
        this.name = being.name
        this.attackSpeed = being.attackSpeed
        const c = being.coordinates
        this.coordinates = new Coordinates(c.zone, c.sidePathPosition, c.world)
        this.critRate = being.critRate
        this.currentHp = being.currentHp
        this.maxHp = being.maxHp
        this.dead = being.dead
        this.defense = being.defense
        this.inventory = being.inventory.map(i => {
            if (i instanceof Soul) {
                return new Soul().from(i)
            }
            else if (i instanceof Mana) {
                return new Mana().from(i)
            }
            else {
                return new Item().from(i)
            }
        })
    }
    static from(foe: LivingEntity) {
        const f = new LivingEntity()
        f.fromBase(foe)
        return f
    }
}