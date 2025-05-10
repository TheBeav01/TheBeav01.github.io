<script lang="ts">
    import { saveGame } from "../stores/gameSave.svelte";
    import { addXToResource, resourceStore } from "../stores/resourceStore.svelte";
    import { getDate } from "../utils/dateUtils";
    import {onFrameCooldown} from "../utils/gameUtils.svelte";
    import ResourceList from "./resources/resourceList.svelte";
    let date = $state(getDate())
    onFrameCooldown(30, () => date = getDate())
    const item = $derived(resourceStore)
    function awardResource(res: string) {
        addXToResource(res, 10)
    }
</script>
<div class="top-bar-container">
    <span class="top-bar-flex-item center-item">{date}</span>
    <div class="top-bar-flex-item">
        <div>
            <ResourceList type="Resource"/>
        </div>
    </div>
    <div class="button-container center-item">
        <button onclick={(_e) => saveGame()} id="save-button">Save</button>
        <button id="settings-button">Settings</button>
    </div>
</div>
<style>
    .top-bar-container {
        display: flex;
    }

    .top-bar-flex-item {
        flex: 1;
    }

    .button-container {
        display: flex;
        gap: 1em;
    }

    .center-item {
        align-self: center;
    }
</style>