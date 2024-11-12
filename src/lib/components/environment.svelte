<script lang="ts">
    import { save, saveStore, savePos } from "../stores/gameSave.svelte";
    import Box from "../utils/stateBox.svelte";
    import StoryUtils, { currentStory } from "../utils/storyUtils.svelte";
    let message = currentStory
    let pos = saveStore.value.storyPos
    $inspect(saveStore)
    $inspect(save)
    $inspect(currentStory)
    function onClick(m: any){
        m()
        // message.value.value = StoryUtils.getCurrentStoryMessage()
        // pos.value = save.storyPos
    }
</script>
{message.value.text}
{#if pos == 0}
    {message.value.text}
    <div class="initial-progress">
        <button class="progress-button initial-progress-button" onclick={() => onClick(message.value.onNext)}>{message.value.onNextText ?? "Next"}</button>
    </div>
{/if}
{#if pos > 0}
<div class="environment-container">
    <div>
        Navigation
    </div>
    <div>
        Battle
    </div>
    <div>
        {#if message.value.text}
            {message.value.text}
            {#if message.value.onNext}
                <div>
                    <button class="progress-button" onclick={() => onClick(message.value.onNext)}>{message.value.onNextText ?? "Next"}</button>
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