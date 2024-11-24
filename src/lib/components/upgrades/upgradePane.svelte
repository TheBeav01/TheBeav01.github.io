<script lang="ts">
    import { untrack } from "svelte";
    import { playerStore } from "../../stores/playerStore.svelte";
    import { resourceStore } from "../../stores/resourceStore.svelte";
    import { gameSave } from "../../types/gameSave.svelte";
    import { Item } from "../../types/resources/item.svelte";
    import StoryUtils, { PRE_EQUIPMENT_ERA } from "../../utils/storyUtils.svelte";

    const mana = $derived(resourceStore.get("Mana"))
    const player = $derived(playerStore.get("player"))
    const displayable = $derived.by(() => {
        const disp = StoryUtils.getAvailablePlayerUpgrades().filter((item, idx) => {
            console.log("A")
            if (idx == 0) {
                return true
            }
            const hasItem = player!.inventory.find(i => i.name === item.name) !== undefined
            if (hasItem) {
                return true
            }
            const next = untrack(() => item.calculateNextCost())
            if (mana!._amt >= (next / 2)) {
                return true
            }
            return false
        })
        console.log("----")
        return disp
    })
    const equip = (item: Item) => {
        const newPlayer = item.equip(playerStore.get("player")!)
        playerStore.set("player", newPlayer)
    }
</script>

{#if gameSave.save.storyPos > PRE_EQUIPMENT_ERA}
    <div class="upgrade-container">
        <h3>Player Upgrades</h3>
        <div>
            {#each displayable.filter(d => d.attack > 0) as upgrade}
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
        <div>
            {#each displayable.filter(d => d.defense > 0) as upgrade}
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