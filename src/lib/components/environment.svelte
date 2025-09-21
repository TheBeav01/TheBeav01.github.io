<script lang="ts">
    import { cloneEncounter, CombatLoop, encounterState, setEncounter, tick } from "../stores/encounter.svelte";
    import { getPartnerName } from "../stores/playerStore.svelte";
    import { gameSave, getFlagComplete, saveGame } from "../types/gameSave.svelte";
    import { untrack } from "svelte";
    import {
        generateEnemy,
        type EnemyDisplay,
    } from "../utils/generators/enemyGenerator";
    import StoryUtils, { storyflags } from "../utils/storyUtils.svelte";
    import InfoTabs from "./infoTabs.svelte";
    import LivingEntity from "../types/livingEntity.svelte";
    import { Coordinates } from "../types/saveObject.svelte";
    import { getEnemiesPerZone } from "../utils/gameUtils.svelte";
    import AttackPanel from "./environment/attackPanel.svelte";
    import EncounterEntity from "./environment/encounterEntity.svelte";
    import UpgradePane from "./upgrades/upgradePane.svelte";
    import { UNLOCKED_COMBAT, UNLOCKED_NAVIGATION, FIRST_ENEMY_ENCOUNTER, UNLOCKED_FIRST_WEAPON } from "../constants/constants";
    let message = $derived(StoryUtils.getStoryState(gameSave.save));
    let save = $derived(gameSave.save);
    let navigationUnlocked = $derived.by(() => {
        if (!storyflags[UNLOCKED_NAVIGATION]) {
            return false
        }
        return storyflags[UNLOCKED_NAVIGATION].storyShown
    })
    let combatUnlocked = $derived.by(() => {
        if (!storyflags[UNLOCKED_COMBAT]) {
            return false
        }
        return storyflags[UNLOCKED_COMBAT].storyShown

    })
    let thirdPhaseUnlocked = $derived.by(() => {
        if (!storyflags[FIRST_ENEMY_ENCOUNTER]) {
            return false
        }
        return storyflags[FIRST_ENEMY_ENCOUNTER].storyShown
    })
    const divClass = $derived(navigationUnlocked && !combatUnlocked ? "intermediate-panel" : null);
    const epz = $derived(
        getEnemiesPerZone(gameSave.save.coordinates.zone),
    );
    let currentFoe: EnemyDisplay = $state({
        entity: new LivingEntity(0),
        labels: []
    });
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
            return
        }
        if (remaining <= 0 && gameSave.save.highestArea <= gameSave.save.coordinates.zone) {
            gameSave.save.highestArea = gameSave.save.coordinates.zone + 1
        }
        if (getFlagComplete(FIRST_ENEMY_ENCOUNTER) && !getFlagComplete(UNLOCKED_FIRST_WEAPON)) {
            StoryUtils.setFlag(UNLOCKED_FIRST_WEAPON)
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
        
        if (getFlagComplete(UNLOCKED_COMBAT) && !getFlagComplete(FIRST_ENEMY_ENCOUNTER)) {
            StoryUtils.setFlag(FIRST_ENEMY_ENCOUNTER)
            CombatLoop.pause()
        }
        if (resetCount) {
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
    const substituteText = (text: string) => {
        return text.replaceAll("[[partnername]]", getPartnerName() ?? "Zephyr")
    }

    const onNext = (_e: any) => {
        StoryUtils.setFlagAsRead()
        StoryUtils.setFlag(UNLOCKED_COMBAT)
    }
</script>
{#if !navigationUnlocked}
    <div class="initial-progress">
        {#each message.text as textItem}
            {substituteText(textItem.text)}
            <br /><br />
        {/each}
        <button
            class="progress-button initial-progress-button"
            onclick={onNext}>{message.onNextText ?? "Next"}</button
        >
    </div>
{/if}
{#if navigationUnlocked}
    <div class="environment-container">
        <div>
            Area {coords.zone} - {encounter.remaining <= 0 ? "No" : encounter.remaining} Creatures Remain
            <div class="nav-button-group">
                <div>
                    <button
                    disabled={coords.zone == 0}
                    onclick={() => onTravel(2)}>Previous Zone</button>
                    <button disabled={encounter.remaining > 0 || !getFlagComplete(UNLOCKED_COMBAT)} onclick={() => onTravel(0)}>Next Zone</button>
                    
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
        {#if thirdPhaseUnlocked}
            <div class={`battle-panel fit-height`}>
                {#if encounter.remaining <= 0 && coords.sidePathPosition === 0}
                    <div>No entities found in area</div>
                {/if}
                {#if encounter.remaining > 0 || coords.sidePathPosition !== 0}
                    <div class="ally">
                        <div>
                            <EncounterEntity entity={encounter.player}/>
                        </div>
                        <div>
                            <EncounterEntity entity={encounter.partner}/>
                        </div>
                        <AttackPanel onTravel={onTravel}/>
                    </div>
                    <div class="enemy">
                        <EncounterEntity entity={encounter.foe} additionalBarText={`${(encounter.foe.timeToAttack / 1000).toFixed(1)}s until next attack`}
                        labels={currentFoe?.labels} barColor="#b81616"/>
                    </div>
                {/if}
            </div>
        {/if}
        <div class={divClass}>
            <InfoTabs/>
        </div>
        <UpgradePane/>
    </div>
{/if}

<style>
    .environment-container {
        display: grid;
        grid-template-columns: 20% 60% 20%;
        grid-template-rows: 50% 50%;
        height: 100%;
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
        padding-left: 1rem;
    }
    .battle-panel {
        display: grid;
        gap: 5px;
        padding-left: 1em;
        padding-right: 1em;
        grid-template-columns: 1fr 1fr;
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

    .fit-height {
        height: fit-content;
    }
    .ally > div {
        padding: 4px 0;
    }
</style>
