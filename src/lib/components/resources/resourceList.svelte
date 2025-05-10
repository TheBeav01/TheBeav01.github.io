<script lang="ts">
    import { resourceStore } from "../../stores/resourceStore.svelte";
    type ResourceKey = "Inventory" | "Resource" | "All"
    const { type, emptyText } : {type: ResourceKey, emptyText?: string} = $props()
    function getList() {
        return resourceStore.values().filter(e => {
            if (type == "All") {
                return true
            }
            if (type == "Inventory") {
                return e.isItem
            }
            if (type == "Resource") {
                return !e.isItem
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