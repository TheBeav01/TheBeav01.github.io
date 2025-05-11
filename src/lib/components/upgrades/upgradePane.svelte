<script lang="ts">
    import { playerStore } from "../../stores/playerStore.svelte";
    import { resourceStore } from "../../stores/resourceStore.svelte";
    import { gameSave } from "../../types/gameSave.svelte";
    import { Item } from "../../types/resources/item.svelte";
    import StoryUtils, { PRE_EQUIPMENT_ERA } from "../../utils/storyUtils.svelte";
    import { encounterState } from "../../stores/encounter.svelte";
    import type Upgrade from "../../types/resources/upgrade.svelte";
    import UpgradeItem from "./upgradeItem.svelte";

    let item = $derived.by(() => {
        return StoryUtils.getAvailablePlayerUpgrades(resourceStore)
    })
</script>

{#if gameSave.save.storyPos > PRE_EQUIPMENT_ERA}
    <div class="upgrade-container">
        <h3>Player Upgrades</h3>
        <div>
            {#each item.filter(d => d.attackStat.value > 0) as u}
                <UpgradeItem upgrade={u}/>
            {/each}
        </div>
        <div>
            {#each item.filter(d => d.defenseStat.value > 0) as u}
                <UpgradeItem upgrade={u}/>
            {/each}
            
        </div>
    </div>
{/if}

<style>
    .upgrade-container {
        grid-column: 1/3;
    }
</style>