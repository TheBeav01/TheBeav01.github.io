<script lang="ts">
    import { getPartnerName } from "../stores/playerStore.svelte";
    import { gameSave, saveGame } from "../types/gameSave.svelte";
    import StoryUtils, { storyflags } from "../utils/storyUtils.svelte";
    import ResourceList from "./resources/resourceList.svelte";

    let message = $derived(StoryUtils.getStoryState(gameSave.save));
    let hasMessage = $derived(message.text.length > 0 && message.text[0].text != "")
    const onNext = (_e: any) => {
        if (message.onNext) {
            message.onNext()
        }
        StoryUtils.setFlagAsRead()
        gameSave.save = {...gameSave.save}
        saveGame()
    }

    const substituteText = (text: string) => {
        return text.replaceAll("[[partnername]]", getPartnerName() ?? "Zephyr")
    }
</script>
<div>
    {#if storyflags["unlockedCombat"].storyShown}
        <div>Inventory:</div>
    {/if}
    <ResourceList type="Inventory" emptyText="No items"/>
    {#if hasMessage}
        <div>
            {#each message.text as textItem}
                {substituteText(textItem.text)}
                <br /><br />
            {/each}
            <div>
                <button class="progress-button" onclick={onNext}
                    >{message.onNextText ?? "Next"}</button
                >
            </div>
        </div>
    {/if}
</div>