<script lang="ts">
    import { createTabs, melt } from "@melt-ui/svelte";
    import Environment from "./environment.svelte";
    import { gameSave } from "../types/gameSave.svelte";
    import { DRONE_POS } from "../utils/storyUtils.svelte";
    const {
        elements: {root, list, trigger, content},
        states: { value }
    } = createTabs({ defaultValue: "Environment", orientation: "vertical"})
    const upgradesUnlocked = gameSave.save.storyPos >= DRONE_POS
    const tabHeaders = [
        { id: "Environment", title: "Environment"},
        { id: "Upgrades", title: "Upgrades", visible: upgradesUnlocked}
    ]
</script>
<div class="tab-container" use:melt={$root}>

    <div use:melt={$list}>
        {#each tabHeaders.filter(h => h.visible === undefined || h.visible) as tabHeader }
            <button class="tab-item" use:melt={$trigger(tabHeader.id)}>{tabHeader.title}</button>
            {#if $value === tabHeader.id}
                <div></div>
            {/if}
        {/each}
    </div>
    <div class="tab-panel" use:melt={$content(tabHeaders[0].id)}>
        <div class="tab-content">
            <Environment/>
        </div>
    </div>
    <div class="tab-panel" use:melt={$content(tabHeaders[1].id)}>
        <div class="tab-content">
            BBBBBBBBBBB
        </div>
    </div>
</div>

<style>
    .tab-item {
        display: flex;
        border-color: #16b8b8;
        border-width: 1px;
        background: none;
        min-width: 10em;
        justify-content: center;
    }

    .tab-item[data-state='active'] {
        font-weight: bolder;
        border-width: 2px;
    }

    .tab-container {
        border: #16b8b8;
        display: flex;
    }

    .tab-content {
        padding: 0px 2em;
        height: max-content;
    }

    .tab-panel {
        width: 100%;
    }
</style>