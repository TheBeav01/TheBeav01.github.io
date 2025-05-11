<script lang="ts">
    import { resourceStore } from "../../stores/resourceStore.svelte";
    import Upgrade from "../../types/resources/upgrade.svelte";
    type ResourceKey = "Inventory" | "Resource" | "Upgrade" | "All" 
    const { type, emptyText } : {type: ResourceKey, emptyText?: string} = $props()
    function getList() {
        return resourceStore.values().filter(e => {
            switch (type) {
                case "All":
                    return true
                case "Inventory":
                    return e.isItem
                case "Resource":
                    return !e.isItem && !e.isUpgrade
                case "Upgrade":
                    return e.isUpgrade
            }
        })
    }
    let resources = $derived(getList())
</script>

<div>
    {#each resources as res}
        <!-- TODO: sort out how to do dev stuff and move this there -->
        <!-- <button onclick={() => awardResource(key)}>Award 10</button> -->
        <div>
            {res?.name}: {res?.amt ?? 0}
        </div>
    {/each}
</div>