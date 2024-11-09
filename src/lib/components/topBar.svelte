<script lang="ts">
    import { getDate } from "../utils/date-utils";
    import onFrameCooldown from "../utils/frame-utils.svelte";
    import Resource from "./resource.svelte";
    let date = $state(getDate())
    onFrameCooldown(30, () => date = getDate())
</script>
<div class="top-bar-container">
    <span class="top-bar-flex-item center-item">{date}</span>
    <div class="top-bar-flex-item">
        <div>
            <Resource name="Souls"/>
            <Resource name="Mana"/>
            <Resource name="Metal"/>
        </div>
    </div>
    <div class="button-container center-item">
        <button id="save-button">Save</button>
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