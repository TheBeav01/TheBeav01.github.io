<script lang="ts">
    import type { Resource } from "../types/resources/resource.svelte";
    import type { ResourceKey } from "./resources/resourceList.svelte";

    const {res, type} : {res: Resource, type: ResourceKey} = $props()

    function startTicking() {
        res.tickEnabled = !res.tickEnabled
    }
</script>

{#if type == "Inventory"}
    <button onclick={startTicking}>Deconstruct</button>
{/if}