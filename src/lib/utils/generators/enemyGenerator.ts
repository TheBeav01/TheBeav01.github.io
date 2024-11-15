import { gameSave } from "../../types/gameSave.svelte"
import LivingEntity from "../../types/livingEntity.svelte"
const HIGH_AFFINITY_SCALE_FACTOR = 1.10
const LOW_AFFINITY_SCALE_FACTOR = 1.02
const DEFAULT_ATTACK_SCALE_FACTOR = 1.08
const DEFENSE_SCALE_FACTOR = 1.05
const HP_SCALE_FACTOR = DEFENSE_SCALE_FACTOR
const DEFAULT_VAL = 2
type Affinity = "attack" | "defense" | "hp" | "speed" | "crit"
interface EnemyTemplate {
    name: number
    spawnWeight: number,
    affinity?: Affinity
    drawback?: Affinity

}
const generateEnemy = () => {
    const le = new LivingEntity()
    const zone = gameSave.save.coordinates.zone
    le.attack = Math.round(DEFAULT_VAL + Math.pow(zone, DEFAULT_ATTACK_SCALE_FACTOR))
    le.defense = Math.round(DEFAULT_VAL + Math.pow(zone, DEFENSE_SCALE_FACTOR))
    le.maxHp = Math.round(DEFAULT_VAL + Math.pow(zone, HP_SCALE_FACTOR))
    le.currentHp = le.maxHp
    le.attackSpeed = 1
    le.critRate = 0.05
    le.inventory = []
    return applyModifiers(le)
}

const applyModifiers = (entity: LivingEntity) => {
    return entity
}