<script lang="ts">
    import { saveGame } from "../stores/gameSave.svelte";
    import { getPartnerName, getPlayer } from "../stores/playerStore.svelte";
    import { gameSave } from "../types/gameSave.svelte";
    import StoryUtils from "../utils/storyUtils.svelte";
    import ResourceList from "./resources/resourceList.svelte";

    let message = $derived(StoryUtils.getStoryState(gameSave.save));
    let hasMessage = $derived(message.text.length > 0 && message.text[0].text != "")
    const onNext = (_e: any) => {
        if (message.onNext) {
            message.onNext()
        }
        gameSave.save = {...gameSave.save}
        saveGame()
    }

    const substituteText = (text: string) => {
        return text.replaceAll("[[partnername]]", getPartnerName() ?? "Zephyr")
    }
</script>
<div>
    {#if !hasMessage}
        <div>Inventory:</div>
        <ResourceList type="Inventory" emptyText="No items"/>
    {/if}
    {#if hasMessage}
        {#each message.text as textItem}
            {substituteText(textItem.text)}
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