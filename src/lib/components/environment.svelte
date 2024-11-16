<script lang="ts">
    import { gameSave } from "../types/gameSave.svelte";
    import type LivingEntity from "../types/livingEntity.svelte";
    import { generateEnemy } from "../utils/generators/enemyGenerator";
    import StoryUtils, { INITIAL_SCAN_POS } from "../utils/storyUtils.svelte";
    let message = $derived(StoryUtils.getStoryState(gameSave.save))
    let save = $derived(gameSave.save)
    let pos = $derived(gameSave.save.storyPos)
    const divClass = $derived(pos == 1 ? "intermediate-panel" : null)
    let foe : {entity: LivingEntity, labels: string[]} | null = $state(null)
    $inspect(foe)
    $inspect(save)
    const travel = (dir: number) => {
        const coords = {...gameSave.save.coordinates}
        if (dir < 0) {
            dir = 0
        }
        if (dir > 3) {
            dir = 3
        }
        
        switch(dir) {
            case 0:
                coords.zone += 1
                break;
            case 1:
                if (coords.sidePathPosition == -1) {
                    coords.sidePathPosition = 0
                    break;
                }
                coords.sidePathPosition = 1
                break;
            case 3:
                if (coords.sidePathPosition == 1) {
                    coords.sidePathPosition = 0
                    break;
                }
                coords.sidePathPosition = -1
                break;
            case 2:
                coords.zone -= 1
                break
        }
        gameSave.save = {...gameSave.save, coordinates: coords}
        if (pos == INITIAL_SCAN_POS) {
            StoryUtils.setStoryPosition(INITIAL_SCAN_POS + 1)
        }
        generateEncounter()
    }

    const generateEncounter = () => {
        foe = generateEnemy()
    }
</script>
{#if pos == 0}
    <div class="initial-progress">
        {#each message.text as textItem}
            {textItem.text}
            <br/><br/>
        {/each}
        <button class="progress-button initial-progress-button" onclick={message.onNext}>{message.onNextText ?? "Next"}</button>
    </div>
{/if}
{#if pos > 0}
<div class="environment-container">
    <div>
        <div class="nav-button-group">
            <button onclick={() => travel(0)}>Advance</button>
            <div>
                <button disabled={save.coordinates.zone == 0} onclick={() => travel(3)}>Left Path</button>
                <button disabled={save.coordinates.zone == 0} onclick={() => travel(1)}>Right Path</button>
            </div>
            <button disabled={save.coordinates.zone == 0} onclick={() => travel(2)}>Go Back</button>
        </div>
        A:{save.coordinates.zone}
    </div>
    {#if pos > 1}
    
        <div class={divClass}>
            {#if foe?.entity}
                {foe.entity.name}
                {foe.entity.currentHp} / {foe.entity.maxHp}
                <div>
                    {#each foe.labels as label}
                        <span>{label}</span>  
                    {/each}
                </div>
            {/if}
            {#if !foe?.entity || foe.entity.currentHp === 0}
                <div>No entities found in area</div>
            {/if}
        </div>
    {/if}
    <div class={divClass}>
        {#if message.text.length > 0 && message.text[0].text != ""}
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
        flex-direction: column;
    }
    .initial-progress-button {
        margin: 0 auto;
    }
    .intermediate-panel {
        grid-column: 2 / 4;
    }
    .nav-button-group {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }
    .nav-button-group > button {
        align-self: center;
    }
    .nav-button-group button {
        width: fit-content;
        height: fit-content;
        padding: 2px 3px;
    }
    .nav-button-group > div {
        display: flex;
        justify-content: space-around;
    }
</style>