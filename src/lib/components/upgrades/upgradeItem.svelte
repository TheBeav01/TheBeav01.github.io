<script lang="ts">
    import { playerStore } from "../../stores/playerStore.svelte";
    import { resourceStore } from "../../stores/resourceStore.svelte";
    import { gameSave } from "../../types/gameSave.svelte";
    import { Item } from "../../types/resources/item.svelte";
    import StoryUtils, { PRE_EQUIPMENT_ERA } from "../../utils/storyUtils.svelte";
    import { encounterState } from "../../stores/encounter.svelte";
    import type Upgrade from "../../types/resources/upgrade.svelte";

    const {upgrade} : {upgrade: Upgrade} = $props()
    const equip = () => {
        console.log(upgrade)
        const player = playerStore.get("player")
        const newPlayer = upgrade.equip(player!)
        playerStore.set("player", newPlayer)
        encounterState.state.player = newPlayer
        const res = resourceStore.get(upgrade.resourceUsed)
        res?.remove(Math.floor(upgrade.currentCost))
    }
</script>

<button class="upgrade-button" onclick={() => equip()}>
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

<style>
    .upgrade-button {
        height: fit-content;
    }
</style>