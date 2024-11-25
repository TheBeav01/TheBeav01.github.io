<script lang="ts">
    import { untrack } from "svelte";
    import { playerStore } from "../../stores/playerStore.svelte";
    import { resourceStore } from "../../stores/resourceStore.svelte";
    import { gameSave } from "../../types/gameSave.svelte";
    import { Item } from "../../types/resources/item.svelte";
    import StoryUtils, { PRE_EQUIPMENT_ERA } from "../../utils/storyUtils.svelte";
    import type Player from "../../types/player";
    import type Mana from "../../types/resources/mana.svelte";
    import { encounterState } from "../../stores/encounter.svelte";

    const mana = $derived(resourceStore.get("Mana"))!
    const player = $derived(encounterState.state.player)!
    const allUpgrades = $derived(getAvailablePlayerUpgrades(player, mana))
    const equip = (item: Item) => {
        const newPlayer = item.equip(player)
        playerStore.set("player", newPlayer)
        encounterState.state.player = newPlayer
    }

    function getAvailablePlayerUpgrades(player: Player, mana: Mana) {
        return StoryUtils.allUpgrades.filter((u, idx) => {
            if (idx == 0) {
                return true
            }
            const hasItem = player.inventory.find(i => i.name === u.name) !== undefined
            if (hasItem) {
                return true
            }
            if (mana._amt >= u.currentCost / 2) {
                return true
            }
            return false
        })
    }
</script>

{#if gameSave.save.storyPos > PRE_EQUIPMENT_ERA}
    <div class="upgrade-container">
        <h3>Player Upgrades</h3>
        <div>
            {#each allUpgrades.filter(d => d.attack > 0) as upgrade}
                <button class="upgrade-button" onclick={() => equip(upgrade)}>
                    <div>
                        {upgrade.name} - Rank {upgrade.amt}
                    </div>
                    <div>
                        {upgrade.currentCost.toFixed(0)} Mana
                    </div>
                    <div>
                        {upgrade.getUpgradeText()}
                    </div>
                </button>
            {/each}
        </div>
        <div>
            {#each allUpgrades.filter(d => d.defense > 0) as upgrade}
                <button class="upgrade-button" onclick={() => equip(upgrade)}>
                    <div>
                        {upgrade.name} - Rank {upgrade.amt}
                    </div>
                    <div>
                        {upgrade.calculateNextCost().toFixed(0)} Mana
                    </div>
                    <div>
                        {upgrade.getUpgradeText()}
                    </div>
                </button>
            {/each}
        </div>
    </div>
{/if}

<style>
    .upgrade-container {
        grid-column: 1/3;
    }
    .upgrade-button {
        height: fit-content;
    }
</style>