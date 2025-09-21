<script lang="ts">
    import { resourceStore } from "../../stores/resourceStore.svelte";
    import { getFlagComplete } from "../../types/gameSave.svelte";
    import UpgradeItem from "./upgradeItem.svelte";
    import UpgradeUtils from "../../utils/upgradeUtils";
    import { UNLOCKED_FIRST_WEAPON } from "../../constants/constants";

    let item = $derived.by(() => {
        return UpgradeUtils.getAvailablePlayerUpgrades(resourceStore)
    })
</script>

{#if getFlagComplete(UNLOCKED_FIRST_WEAPON)}
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