<script>
    import { resourceStore } from "../../stores/resourceStore.svelte";

    const souls = $derived(resourceStore.get("Souls"))
</script>