import * as Enemy from "../../constants/enemyConstants"
import { gameSave } from "../../types/gameSave.svelte"
import LivingEntity from "../../types/livingEntity.svelte"
const HIGH_AFFINITY_SCALE_FACTOR = 1.33
const HIGH_SPECIAL_SCALE_FACTOR = 1.25
const LOW_SPECIAL_SCALE_FACTOR = 0.80
const LOW_AFFINITY_SCALE_FACTOR = 1.15
const DEFAULT_ATTACK_SCALE_FACTOR = 1.20
const DEFENSE_SCALE_FACTOR = 1.15
const HP_SCALE_FACTOR = DEFENSE_SCALE_FACTOR
const DEFAULT_VAL = 1
const BASE_HP = 1
type Affinity = "attack" | "defense" | "hp" | "speed" | "crit" | "accuracy"

export interface EnemyDisplay {
    entity: LivingEntity,
    labels: string[]
}
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


export const generateEnemy = () : EnemyDisplay => {
    const le = new LivingEntity()
    const zone = gameSave.save.coordinates.zone
    le.attackSpeed = 0.25
    le.critRate = 0.05
    le.inventory = []
    return applyModifiers(le, zone)
}

const applyModifiers = (entity: LivingEntity, zone: number) : EnemyDisplay => {
    let enemy: EnemyTemplate
    if (zone <= 6) {
        enemy = pickEnemyFromWeightedList(zones1To6)
    }
    else if (zone <= 10) {
        enemy = pickEnemyFromWeightedList(zones7To10)
    } else {
        enemy = pickEnemyFromWeightedList(zones1To6)
    }
    entity.name = enemy.name
    entity.attack = Math.round(DEFAULT_VAL + Math.pow(zone, pickModifier(enemy.name, "attack")))
    entity.defense = Math.round(DEFAULT_VAL + Math.pow(zone, pickModifier(enemy.name, "defense")))
    entity.maxHp = Math.round(DEFAULT_VAL + Math.pow(zone, pickModifier(enemy.name, "hp")))
    entity.currentHp = entity.maxHp
    const baseAttackSpeed = gameSave.save.coordinates.zone <= 5 ? 0.25 : 1
    entity.attackSpeed = baseAttackSpeed * pickModifier(enemy.name, "speed")
    entity.critRate = pickModifier(enemy.name, "crit")
    entity.resetAttackTime()
    console.log(entity)
    return {entity, labels: generateLabels(enemy.name)}
}

const generateLabels = (name: string) => {
    const enemy = enemyMap.get(name)
    const labels : string[] = []
    enemy?.affinity?.forEach(x => {
        labels.push(pickLabel(x))
    })
    enemy?.drawback?.forEach(x => {
        labels.push(pickLabel(x, true))
    })
    return labels
}

const pickLabel = (label: Affinity, drawback = false) => {
    let labels = []
    switch(label) {
        case "attack":
            labels = ["Vicious", "Blunting"]
            break
        case "defense":
            labels = ["Tough", "Vulnerable"]
            break
        case "hp":
            labels = ["Healthy", "Frail"]
            break
        case "speed":
            labels = ["Quick", "Passive"]
            break
        case "crit":
            labels = ["Precise", "Inexact"]
            break
        case "accuracy":
            labels = ["Accurate", "Blinded"]
            break
    }
    return drawback ? labels[1] : labels[0]
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
        case "accuracy":
        case "crit":
            return 1
    }
}

const pickEnemyFromWeightedList = (list: EnemyTemplate[]) => {
    const fixedWeights = list.map(i => {
        if (i.spawnWeight === undefined) {
            i.spawnWeight = 100
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