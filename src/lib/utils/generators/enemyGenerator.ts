import { EQUIPMENT_ERA, UNLOCKED_EQUIPMENT_PURCHASING, UNLOCKED_RESOURCE_DECONSTRUCTION } from "../../constants/constants"
import * as Enemy from "../../constants/enemyConstants"
import HealthStat from "../../stats/health"
import { log } from "../../stores/messageList.svelte"
import { gameSave, getFlagComplete } from "../../types/gameSave.svelte"
import LivingEntity from "../../types/livingEntity.svelte"
import type { Coordinates } from "../../types/saveObject.svelte"
import StoryUtils from "../storyUtils.svelte"
import { generateItems } from "./itemGenerator"
import { pickItemFromWeightedList, type Spawnable } from "./sharedGenerator"
const HIGH_AFFINITY_SCALE_FACTOR = 1.20
const LOW_AFFINITY_SCALE_FACTOR = 1.08
const DEFAULT_ATTACK_SCALE_FACTOR = 1.15
const DEFENSE_SCALE_FACTOR = 1.10
const HP_SCALE_FACTOR = DEFENSE_SCALE_FACTOR
const HIGH_SPECIAL_SCALE_FACTOR = 1.25
const LOW_SPECIAL_SCALE_FACTOR = 0.80
const DEFAULT_VAL = 1
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
interface EnemyTemplate extends Spawnable {
    name: string
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


export const generateEnemy = (left: number) : EnemyDisplay => {
    const le = new LivingEntity()
    le.attackSpeedStat.value = 0.25
    le.critRateStat.value = 0.05
    le.inventory = []
    return applyModifiers(le, left)
}

const applyModifiers = (entity: LivingEntity, left: number) : EnemyDisplay => {
    let enemy: EnemyTemplate
    const coords = gameSave.save.coordinates
    const zone = coords.zone
    entity.coordinates = coords
    if (canGenerateSpecialEnemy(coords, left)) {
        return generateSpecialEnemy(coords, entity)
    }
    if (zone <= 6) {
        enemy = pickItemFromWeightedList(zones1To6)
    }
    else if (zone <= 10) {
        enemy = pickItemFromWeightedList(zones7To10)
    } else {
        enemy = pickItemFromWeightedList(zones1To6)
    }
    entity.name = enemy.name
    entity.attackStat.value = Math.round(DEFAULT_VAL + Math.pow(zone, pickModifier(enemy.name, "attack")))
    entity.defenseStat.value = Math.round(DEFAULT_VAL + Math.pow(zone, pickModifier(enemy.name, "defense")))
    entity.hpStat = new HealthStat(Math.round(DEFAULT_VAL + Math.pow(zone, pickModifier(enemy.name, "hp"))))
    const baseAttackSpeed = calculateAttackSpeed()
    entity.attackSpeedStat.value = baseAttackSpeed * pickModifier(enemy.name, "speed")
    entity.critRateStat.value = pickModifier(enemy.name, "crit")
    entity.baseAttack = pickBaseAttack()
    entity.resetAttackTime()
    entity.inventory = generateItems(entity.coordinates.zone)
    return {entity, labels: generateLabels(enemy.name)}
}

const pickBaseAttack = () => {
    return Math.max(1,gameSave.save.difficultyFactor)
}

const calculateAttackSpeed = () => {
    return 0.25 * (Math.pow(1.25,gameSave.save.difficultyFactor))
}

const canGenerateSpecialEnemy = (coords: Coordinates, left: number) => {
    const isLastEnemy = left === 1 && coords.sidePathPosition === 0
    if (coords.zone === 3 && isLastEnemy  && !getFlagComplete(UNLOCKED_EQUIPMENT_PURCHASING)) {
        return true
    }
    if (coords.zone === 5 && isLastEnemy && !getFlagComplete(UNLOCKED_RESOURCE_DECONSTRUCTION)) {
        return true
    }
    return false
}

const generateSpecialEnemy = (coords: Coordinates, entity: LivingEntity) : EnemyDisplay => {
    entity.name = "Homing Pidgeon"
    entity.attackStat.value = 1
    entity.defenseStat.value = 1
    entity.attackSpeedStat.value = 0.5
    entity.critRateStat.value = 0
    const maxHp = Math.round(DEFAULT_VAL + Math.pow(coords.zone, HP_SCALE_FACTOR))
    entity.hpStat = new HealthStat(maxHp)
    switch (coords.zone) {
        case 3:
            entity.onKill = () => {
                entity.onDefaultKill()
                StoryUtils.setFlag(UNLOCKED_EQUIPMENT_PURCHASING)
            }
            break
        case 5:
            entity.onKill = () => {
                entity.onDefaultKill()
                onSpecialKill()
                StoryUtils.setFlag(UNLOCKED_RESOURCE_DECONSTRUCTION)
            }
            break
        default:
            entity.onKill = () => {
                onSpecialKill()
            }
            break
    }
    return {entity, labels: []}
}

const onSpecialKill = () => {
    gameSave.save.difficultyFactor += 1
    log("The world around you seems more menacing...")
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