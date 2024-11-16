import * as Enemy from "../../constants/enemyConstants"
import { gameSave } from "../../types/gameSave.svelte"
import LivingEntity from "../../types/livingEntity.svelte"
import { generateRandomNumber } from "../gameUtils.svelte"
const HIGH_AFFINITY_SCALE_FACTOR = 1.10
const HIGH_SPECIAL_SCALE_FACTOR = 1.25
const LOW_SPECIAL_SCALE_FACTOR = 0.80
const LOW_AFFINITY_SCALE_FACTOR = 1.02
const DEFAULT_ATTACK_SCALE_FACTOR = 1.08
const DEFENSE_SCALE_FACTOR = 1.05
const HP_SCALE_FACTOR = DEFENSE_SCALE_FACTOR
const DEFAULT_VAL = 2
type Affinity = "attack" | "defense" | "hp" | "speed" | "crit"
interface EnemyListItem {
    name: string,
    //Default: null
    affinity?: Affinity[],
    //Default: null
    drawback?: Affinity[]
}
interface EnemyTemplate {
    name: string,
    // Default: 100
    spawnWeight?: number
}

const rawEnemyList : EnemyListItem[] = [{
    name: Enemy.RAT
}, {
    name: Enemy.RABBIT
}, {
    name: Enemy.SQUIRREL
}, {
    name: Enemy.CHIPMUNK
}, {
    name: Enemy.HEDGEHOG
}, {
    name: Enemy.PORCUPINE,
    affinity: ["attack"],
    drawback: ["speed"],
}, {
    name: Enemy.RAVEN,
    affinity: ["speed", "crit"]
}, {
    name: Enemy.CROW,
    affinity: ["speed"]
}]

const enemyMap = new Map(rawEnemyList.map((item) => [item.name, item]))

const zones1To6 : EnemyTemplate[] = [{
    name: Enemy.RAT
}, {
    name: Enemy.RABBIT
}, {
    name: Enemy.SQUIRREL
}, {
    name: Enemy.CHIPMUNK
}, {
    name: Enemy.HEDGEHOG
}, {
    name: Enemy.PORCUPINE,
    spawnWeight: 10
}]

const zones7To10 : EnemyTemplate[] = [ {
    name: Enemy.CHIPMUNK
}, {
    name: Enemy.HEDGEHOG
}, {
    name: Enemy.PORCUPINE,
    spawnWeight: 90
}, {
    name: Enemy.RAVEN,
    spawnWeight: 70
}, {
    name: Enemy.CROW,
    spawnWeight: 90
}]


const generateEnemy = () => {
    const le = new LivingEntity()
    const zone = gameSave.save.coordinates.zone
    le.attackSpeed = 1
    le.critRate = 0.05
    le.inventory = []
    return applyModifiers(le, zone)
}

const applyModifiers = (entity: LivingEntity, zone: number) => {
    let enemy: EnemyTemplate
    if (zone <= 6) {
        enemy = pickEnemyFromWeightedList(zones1To6)
    }
    else if (zone <= 10) {
        enemy = pickEnemyFromWeightedList(zones7To10)
    } else {
        enemy = pickEnemyFromWeightedList(zones1To6)
    }
    entity.attack = Math.round(DEFAULT_VAL + Math.pow(zone, pickModifier(enemy.name, "attack")))
    entity.defense = Math.round(DEFAULT_VAL + Math.pow(zone, pickModifier(enemy.name, "defense")))
    entity.maxHp = Math.round(DEFAULT_VAL + Math.pow(zone, pickModifier(enemy.name, "hp")))
    entity.currentHp = entity.maxHp
    entity.attackSpeed = pickModifier(enemy.name, "speed")
    entity.critRate = pickModifier(enemy.name, "crit")
    console.log(entity)
    return entity
}

const pickModifier = (name: string, modifier: Affinity) => {
    const enemy = enemyMap.get(name)
    if (modifier in (enemy?.affinity ?? [])) {
        if (modifier in ["crit", "speed"]) {
            return HIGH_SPECIAL_SCALE_FACTOR
        }
        return HIGH_AFFINITY_SCALE_FACTOR
    }

    if (modifier in (enemy?.drawback ?? [])) {
        if (modifier in ["crit", "speed"]) {
            return LOW_SPECIAL_SCALE_FACTOR
        }
        return LOW_AFFINITY_SCALE_FACTOR
    }
    return pickDefaultModifier(modifier)
}

const pickDefaultModifier = (modifier: Affinity) => {
    switch(modifier) {
        case "attack":
            return DEFAULT_ATTACK_SCALE_FACTOR
        case "defense":
            return DEFENSE_SCALE_FACTOR
        case "hp":
            return HP_SCALE_FACTOR
        case "speed":
        case "crit":
            return 1
    }
}

const pickEnemyFromWeightedList = (list: EnemyTemplate[]) => {
    const fixedWeights = list.map(i => {
        if (i.spawnWeight === undefined) {
            i.spawnWeight = 0
        }
        return i
    })
    const weight = fixedWeights.reduce((l, c, _i, _list) => l + c.spawnWeight!, 0)
    const rand = Math.random()
    const final = rand * weight
    let total = 0
    for(const item of fixedWeights) {
        total += item.spawnWeight!
        if (total >= final) {
            return item
        }
    }
    //Else: Randomly pick. If we still overflow, pick last.
    const scaled = Math.floor(rand * list.length)
    return list[scaled] ?? list[list.length - 1]
}