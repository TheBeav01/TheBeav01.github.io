<script lang="ts">
    import { toggle } from "@melt-ui/svelte/internal/helpers";
    import { resourceStore } from "../../stores/resourceStore.svelte";
    import { gameSave } from "../../types/gameSave.svelte";
    import StoryUtils, { EQUIPMENT_ERA } from "../../utils/storyUtils.svelte";
    import UpgradeItem from "./upgradeItem.svelte";

    let item = $derived.by(() => {
        return StoryUtils.getAvailablePlayerUpgrades(resourceStore)
    })
</script>

{#if gameSave.save.storyPos >= EQUIPMENT_ERA}
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
        <h3>
            Passives
        </h3>
        <div>
            {#each item.filter(d => d.isPassive && (d.togglable || (!d.togglable && d.amt == 0))) as u}
                <UpgradeItem upgrade={u} passive/>
            {/each}
        </div>
    </div>
{/if}

<style>
    .upgrade-container {
        grid-column: 1/3;
    }
</style>