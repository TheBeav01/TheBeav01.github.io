<script lang="ts">
    import { resourceStore } from "../../stores/resourceStore.svelte";
    import Upgrade from "../../types/resources/upgrade.svelte";
    import DeconstructButton from "../deconstructButton.svelte";
    export type ResourceKey = "Inventory" | "Resource" | "Upgrade" | "Passive" | "All" 
    const { type, emptyText } : {type: ResourceKey, emptyText?: string} = $props()
    function getList() {
        return resourceStore.values().filter(e => {
            switch (type) {
                case "All":
                    return true
                case "Inventory":
                    console.log(e)
                    return e.isItem
                case "Resource":
                    return !e.isItem && !e.isUpgrade
                case "Upgrade":
                    return e.isUpgrade
                case "Passive":
                    if (!e.isUpgrade) {
                        return false
                    }
                    const upg = e as Upgrade
                    return upg.isPassive
            }
        })
    }
    let resources = $derived.by(() => {
        return resourceStore.values().filter(e => {
            switch (type) {
                case "All":
                    return true
                case "Inventory":
                    console.log(e)
                    return e.isItem
                case "Resource":
                    return !e.isItem && !e.isUpgrade
                case "Upgrade":
                    return e.isUpgrade
                case "Passive":
                    if (!e.isUpgrade) {
                        return false
                    }
                    const upg = e as Upgrade
                    return upg.isPassive
            }
        })
    })
</script>

<div>
    {#each resources as res}
        <!-- TODO: sort out how to do dev stuff and move this there -->
        <!-- <button onclick={() => awardResource(key)}>Award 10</button> -->
        <div>
            <span>{res?.name}: {res?.amt ? res.amt.toFixed(1) : 0} <DeconstructButton res={res} type={type}/></span>
        </div>
    {/each}
</div>