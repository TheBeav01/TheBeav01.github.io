<script lang="ts">
    import { getPlayer, playerStore } from "../stores/playerStore.svelte";
    import { gameSave } from "../types/gameSave.svelte";
    import StoryUtils from "../utils/storyUtils.svelte";

    let message = $derived(StoryUtils.getStoryState(gameSave.save));
    let hasMessage = $derived(message.text.length > 0 && message.text[0].text != "")
    const onNext = (_e: any) => {
        if (message.onNext) {
            message.onNext()
        }
    }
</script>
<div>
    {#if !hasMessage}
        <div>Inventory:</div>
        {#if getPlayer().inventory.length === 0}
            <span>No items</span>
        {/if}
        {#each getPlayer().inventory as item}
            <div>{item.name} x{item.amt}</div>
        {/each}
    {/if}
    {#if hasMessage}
        {#each message.text as textItem}
            {textItem.text}
            <br /><br />
        {/each}
        {#if message.onNext}
            <div>
                <button class="progress-button" onclick={onNext}
                    >{message.onNextText ?? "Next"}</button
                >
            </div>
        {/if}
    {/if}
</div>