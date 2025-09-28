<script lang="ts">
    import { UNLOCKED_COMBAT } from "../constants/constants";
    import { storyflags } from "../utils/storyUtils.svelte";
    import ResourceList from "./resources/resourceList.svelte";
    import StoryMessageContainer from "./storyMessageContainer.svelte";
</script>
<div>
    {#if storyflags[UNLOCKED_COMBAT]?.storyShown}
        <div>Inventory:</div>
    {/if}
    <ResourceList type="Inventory" emptyText="No items"/>
</div>