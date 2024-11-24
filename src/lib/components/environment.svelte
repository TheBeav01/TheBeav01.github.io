<script lang="ts">
    import { attackManually, cloneEncounter, encounterState, setEncounter, simulateDamage, tick } from "../stores/encounter.svelte";
    import { playerStore } from "../stores/playerStore.svelte";
    import { gameSave } from "../types/gameSave.svelte";
    import Player from "../types/player";
    import { untrack } from "svelte";
    import {
        generateEnemy,
        type EnemyDisplay,
    } from "../utils/generators/enemyGenerator";
    import StoryUtils, { AFTER_INITIAL_COMBAT, INITIAL_NAVIGATION_POS, INITIAL_SCAN_POS } from "../utils/storyUtils.svelte";
    import StatBar from "./bars/statBar.svelte";
    import InfoTabs from "./infoTabs.svelte";
    import LivingEntity from "../types/livingEntity.svelte";
    import { Coordinates } from "../types/saveObject.svelte";
    import { getEnemiesPerZone } from "../utils/gameUtils.svelte";
    import { saveGame } from "../stores/gameSave.svelte";
    import AttackPanel from "./environment/attackPanel.svelte";
    let message = $derived(StoryUtils.getStoryState(gameSave.save));
    let save = $derived(gameSave.save);
    let pos = $derived(gameSave.save.storyPos);
    const divClass = $derived(pos == 1 ? "intermediate-panel" : null);
    const battleClass = $derived(
        pos == 1 ? "intermediate-panel" : "battle-panel",
    );
    const epz = $derived(
        getEnemiesPerZone(gameSave.save.coordinates.zone),
    );
    let currentFoe: EnemyDisplay = $state({
        entity: new LivingEntity(0),
        labels: []
    });
    const currentPlayer = $derived(playerStore.get("player") ?? new Player());
    const currentPartner = $derived(playerStore.get("partner") ?? new Player(true));
    const encounter = $derived(encounterState.state)
    const coords = $derived(gameSave.save.coordinates)
    $effect(() => {
        if (encounter.foe.dead) {
            untrack(() => onEnemyKill())
        }
        if (encounter.partner.dead) {

        }
        if (encounter.player.dead) {

        }
    })
    const onEnemyKill = () => {
        if (pos === INITIAL_NAVIGATION_POS) {
            StoryUtils.setStoryPosition(AFTER_INITIAL_COMBAT)
        }
        if (save.coordinates.sidePathPosition != 0) {
            generateEncounter()
            return
        }
        tick()
        const remaining = encounter.remaining
        if (remaining > 0) {
            generateEncounter()
        }
        if (encounter.foe.coordinates.zone != gameSave.save.coordinates.zone) {
            console.log("Skipping update")
            return
        }
        if (remaining <= 0) {
            gameSave.save.highestArea = gameSave.save.coordinates.zone + 1
            console.log(`Updated highest: ${gameSave.save.highestArea}`)
        } 
    }
    const onTravel = (dir: number) => {
        const gsc = gameSave.save.coordinates
        const coords = new Coordinates(gsc.zone, gsc.sidePathPosition, gsc.world);
        let highest = gameSave.save.highestArea
        if (dir > 3) {
            dir = 3;
        }

        let resetCount = false

        switch (dir) {
            case -1:
                coords.zone -= 1
                resetCount = true
                coords.sidePathPosition = 0
                break
            case 0:
                coords.zone += 1;
                resetCount = true
                break;
            case 1:
                if (coords.sidePathPosition == -1) {
                    coords.sidePathPosition = 0;
                    break;
                }
                coords.sidePathPosition = 1;
                break;
            case 3:
                if (coords.sidePathPosition == 1) {
                    coords.sidePathPosition = 0;
                    break;
                }
                coords.sidePathPosition = -1;
                break;
            case 2:
                coords.zone -= 1;
                resetCount = true
                break;
        }
        
        gameSave.save = { ...gameSave.save, coordinates: coords};
        if (pos == INITIAL_SCAN_POS) {
            StoryUtils.setStoryPosition(INITIAL_SCAN_POS + 1);
        }
        if (resetCount) {
            console.log(`Highest: ${highest} and current: ${coords.zone}`)
            const newEPZ = highest > coords.zone ? 0 : epz
            tick(newEPZ)
        }
        if (coords.sidePathPosition == 0 && encounter.remaining <= 0) {
            currentFoe.entity.dead = true
            setEncounter(currentFoe.entity)
            gameSave.save.encounter = cloneEncounter(encounterState.state)
            saveGame()
            return
        }
        generateEncounter();
    };

    const generateEncounter = () => {
        currentFoe = generateEnemy(encounter.remaining)
        setEncounter(currentFoe.entity)

    };
</script>

{#if pos == 0}
    <div class="initial-progress">
        {#each message.text as textItem}
            {textItem.text}
            <br /><br />
        {/each}
        <button
            class="progress-button initial-progress-button"
            onclick={message.onNext}>{message.onNextText ?? "Next"}</button
        >
    </div>
{/if}
{#if pos > 0}
    <div class="environment-container">
        <div>
            Area {coords.zone} - {encounter.remaining <= 0 ? "No" : encounter.remaining} Creatures Remain
            <div class="nav-button-group">
                <div>
                    <button
                    disabled={coords.zone == 0}
                    onclick={() => onTravel(2)}>Previous Zone</button>
                    <button disabled={encounter.remaining > 0} onclick={() => onTravel(0)}>Next Zone</button>
                    
                </div>
                <div>
                    <button
                        disabled={coords.zone == 0 ||
                            coords.sidePathPosition === -1}
                        onclick={() => onTravel(3)}>Left Path</button
                    >
                    <button
                        disabled={coords.zone == 0 ||
                            coords.sidePathPosition === 1}
                        onclick={() => onTravel(1)}>Right Path</button
                    >
                </div>
            </div>
        </div>
        {#if pos > 1}
            <div class={`${battleClass} fit-height`}>
                {#if encounter.remaining <= 0 && coords.sidePathPosition === 0}
                    <div>No entities found in area</div>
                {/if}
                {#if encounter.remaining > 0 || coords.sidePathPosition !== 0}
                    <div class="ally">
                        <div>
                            {currentPlayer?.name}:
                            <StatBar
                                currentRes={encounter?.player.currentHp ?? 0}
                                maxRes={encounter?.player.maxHp ?? 0}
                            />
                        </div>
                        <div>
                            {currentPartner?.name}
                            <StatBar
                                currentRes={encounter?.partner.currentHp ?? 0}
                                maxRes={encounter?.partner.maxHp ?? 0}
                            />
                        </div>
                        <AttackPanel onTravel={onTravel}/>
                    </div>
                    <span id="vs-text">VS:</span>
                    <div class="enemy">
                        {encounter.foe.name}
                        <StatBar currentRes={encounter.foe.currentHp ?? 0}
                            maxRes={encounter.foe.maxHp ?? 0} additionalText={`${(encounter.foe.timeToAttack / 1000).toFixed(1)}s until next attack`}/>
                        {#if currentFoe}
                            <div>
                                {#each currentFoe.labels as label}
                                    <span>{label}</span>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        {/if}
        <div class={divClass}>
            <InfoTabs/>
        </div>
    </div>
{/if}

<style>
    .environment-container {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: 20% 60% 20%;
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
    .battle-panel {
        display: grid;
        gap: 5px;
        padding-left: 1em;
        padding-right: 1em;
        grid-template-columns: 1fr auto 1fr;
    }
    .nav-button-group {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        padding-top: 1em;
    }
    .nav-button-group button {
        width: 50%;
    }
    .nav-button-group > div {
        display: flex;
        gap: 8px;
    }
    #vs-text {
        align-self: center;
    }

    .fit-height {
        height: fit-content;
    }
</style>
