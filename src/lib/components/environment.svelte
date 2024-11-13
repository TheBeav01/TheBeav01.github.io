<script lang="ts">
    import { gameSave } from "../types/gameSave.svelte";
    import StoryUtils from "../utils/storyUtils.svelte";
    let message = $derived(StoryUtils.getStoryState(gameSave.save))
    let save = $derived(gameSave.save)
    let pos = $derived(gameSave.save.storyPos)
    $inspect(message)
</script>
{#if pos == 0}
    {message.text}
    <div class="initial-progress">
        <button class="progress-button initial-progress-button" onclick={message.onNext}>{message.onNextText ?? "Next"}</button>
    </div>
{/if}
{#if pos > 0}
<div class="environment-container">
    <div>
        Zone: {save.coordinates.zone}
    </div>
    <div>
        Battle
    </div>
    <div>
        {#if message.text.length > 0}
            {#each message.text as textItem}
                {textItem.text}
                <br/><br/>
            {/each}
            {#if message.onNext}
                <div>
                    <button class="progress-button" onclick={message.onNext}>{message.onNextText ?? "Next"}</button>
                </div>
            {/if}
        {/if}
    </div>
</div>
{/if}

<style>
    .environment-container {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 33% 33% 33%
    }
    .progress-button {
        border-color: #6c0e0e;
    }
    .initial-progress {
        display: flex;
    }
    .initial-progress-button {
        margin: 0 auto;
    }
</style>