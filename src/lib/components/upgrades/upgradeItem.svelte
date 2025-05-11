<script lang="ts">
    import { playerStore } from "../../stores/playerStore.svelte";
    import { resourceStore } from "../../stores/resourceStore.svelte";
    import { encounterState } from "../../stores/encounter.svelte";
    import type Upgrade from "../../types/resources/upgrade.svelte";
    import { name } from "@melt-ui/svelte";
    import { equipOrTogglePassive, gameSave, getPassiveValue } from "../../types/gameSave.svelte";

    const {upgrade, passive} : {upgrade: Upgrade, passive?: boolean} = $props()
    const equip = () => {
        if (!upgrade.canEquip()) {
            return
        }
        if (upgrade.isPassive) {
            // Passive, so the flow is different
            equipOrTogglePassive(upgrade)
            return
        }
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
        {#if passive}
            {upgrade.name}
        {/if}
        {#if !passive}
            {upgrade.name} - Rank {upgrade.amt}
        {/if}
    </div>
    {#if !passive || (passive && getPassiveValue(upgrade.name) == null)}
        <div>
            {upgrade.currentCost.toFixed(0)} {upgrade.resourceUsed}
        </div>
        <div>
            {upgrade.getUpgradeText()}
        </div>
    {/if}
    {#if passive && getPassiveValue(upgrade.name) != null}
        {upgrade.upgradeToggled ? "Active" : "Inactive"}
    {/if}
</button>

<style>
    .upgrade-button {
        height: fit-content;
    }
</style>