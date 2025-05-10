import type AttackStat from "../stats/attack"
import type AttackSpeedStat from "../stats/attackSpeed"
import type CritRateStat from "../stats/critRate"
import type DefenseStat from "../stats/defense"
import type HealthStat from "../stats/health"

export default interface BaseEntity {
    name: string,
    attackStat: AttackStat
    defenseStat: DefenseStat,
    attackSpeedStat: AttackSpeedStat,
    critRateStat: CritRateStat,
    hpStat: HealthStat
}