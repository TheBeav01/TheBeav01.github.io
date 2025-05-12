<script lang="ts">
    import { playerStore } from "../../stores/playerStore.svelte";
    import { resourceStore } from "../../stores/resourceStore.svelte";
    import { encounterState } from "../../stores/encounter.svelte";
    import type Upgrade from "../../types/resources/upgrade.svelte";
    import { equipOrTogglePassive } from "../../types/gameSave.svelte";

    const {upgrade, passive} : {upgrade: Upgrade, passive?: boolean} = $props()
    const equip = () => {
        const equippable = (upgrade.isPassive && upgrade.amt > 0) || upgrade.canEquip()
        if (!equippable) {
            return
        }
        const res = resourceStore.get(upgrade.resourceUsed)
        if (upgrade.isPassive) {
            // Passive, so the flow is different
            const newUpgrade = upgrade.amt == 0
            if (newUpgrade) {
                res?.remove(Math.floor(upgrade.currentCost))
            }
            equipOrTogglePassive(upgrade)
            return
        }
        res?.remove(Math.floor(upgrade.currentCost))
        const player = playerStore.get("player")
        const newPlayer = upgrade.equip(player!)
        playerStore.set("player", newPlayer)
        encounterState.state.player = newPlayer
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
    {#if !passive || (passive && upgrade.amt == 0)}
        <div>
            {upgrade.currentCost.toFixed(0)} {upgrade.resourceUsed}
        </div>
        <div>
            {upgrade.getUpgradeText()}
        </div>
    {/if}
    {#if passive && upgrade.amt > 0}
        {upgrade.upgradeToggled ? "Active" : "Inactive"}
    {/if}
</button>

<style>
    .upgrade-button {
        height: fit-content;
    }
</style>