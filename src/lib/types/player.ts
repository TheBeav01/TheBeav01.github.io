import { saveGame } from "../stores/gameSave.svelte";
import { onDeath } from "../stores/gameState.svelte";
import { addResource, resourceStore } from "../stores/resourceStore.svelte";
import StoryUtils from "../utils/storyUtils.svelte";
import { gameSave } from "./gameSave.svelte";
import LivingEntity from "./livingEntity.svelte";
import type { Resource } from "./resources/resource.svelte";

export default class Player extends LivingEntity {
    constructor(isPartner: boolean = false) {
        super(0)
        this.isPartner = isPartner
        this.entityType = isPartner ? "Partner" : "Player"
    }
    isPartner: boolean
    onKill() {
        if (this.isPartner) {
            onDeath.value = {...onDeath.value, partnerDead: true}
            gameSave.save.stats.partnerDeaths += 1
            saveGame()
            return
        }
        onDeath.value = {...onDeath.value, playerDead: true}
        gameSave.save.stats.deaths += 1
        saveGame()
        return
    };
    
    awardItem(item: Resource, amount?: number) {
        if (!item.isItem) {
            addResource(item, amount)
            return
        }
        const amountToAdd = amount === undefined ? item._amt : amount
        addResource(item, amountToAdd)
    }
    static fromPartner(partner: Player) {
        const p = new Player(true)
        p.fromBase(partner)
        p.resetAttackTime()
        return p
    }
    static from(player: Player) {
        const upgrades = StoryUtils.getAvailablePlayerUpgrades(resourceStore)
        const p = new Player()
        p.fromBase(player)
        upgrades.forEach(u => {
            u.equip(p, u.amt)
        })
        return p
    }
}