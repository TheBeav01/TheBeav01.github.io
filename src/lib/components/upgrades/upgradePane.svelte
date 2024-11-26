<script lang="ts">
    import { playerStore } from "../../stores/playerStore.svelte";
    import { resourceStore } from "../../stores/resourceStore.svelte";
    import { gameSave } from "../../types/gameSave.svelte";
    import { Item } from "../../types/resources/item.svelte";
    import StoryUtils, { PRE_EQUIPMENT_ERA } from "../../utils/storyUtils.svelte";
    import { encounterState } from "../../stores/encounter.svelte";

    let item = $derived.by(() => {
        const x = resourceStore.get("Mana")
        const player = playerStore.get("player")!
        return StoryUtils.getAvailablePlayerUpgrades(player, x!)
    })
    const equip = (item: Item) => {
        console.log(item)
        const player = playerStore.get("player")
        const newPlayer = item.equip(player!)
        playerStore.set("player", newPlayer)
        encounterState.state.player = newPlayer
        const mana = resourceStore.get("Mana")
        mana?.remove(Math.floor(item.currentCost))
    }
</script>

{#if gameSave.save.storyPos > PRE_EQUIPMENT_ERA}
    <div class="upgrade-container">
        <h3>Player Upgrades</h3>
        <div>
            {#each item.filter(d => d.attack > 0) as upgrade}
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
            {#each item.filter(d => d.defense > 0) as upgrade}
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