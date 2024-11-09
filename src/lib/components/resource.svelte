<script lang="ts">
    import { resourceStore } from "../stores/resource-store.svelte";

    let { name }: {name: string} = $props()
    let resource = $state(resourceStore.get(name))
</script>

<div>
    {resource?.name ?? name} : {resource?.amt ?? 0}
</div>