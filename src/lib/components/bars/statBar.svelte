<script lang="ts">
    import { createProgress, melt } from "@melt-ui/svelte";
    const {currentRes, maxRes, additionalText, barColor} : {currentRes: number, maxRes: number, additionalText?: string, barColor: string} = $props()
    const {
        elements: { root },
  } = createProgress({
    max: 100,
  });
</script>
<div>
    <div class="base-progress base-height" use:melt={$root}>
        <div class="base-height" style={`transform: translateX(-${
            Math.floor(100 - ((currentRes / (maxRes ?? currentRes)) * 100))
          }%); background-color: ${barColor}`}></div>
    </div>
    <div class="bottom-text">
        <span>{currentRes} / {maxRes}</span>
        {#if additionalText}
            <span>{additionalText}</span>
        {/if}
        
    </div>
</div>

<style>
    .base-progress {
        background-color: whitesmoke;
        overflow-y: hidden;
    }
    .base-height {
        height: 5px;
    }

    .bottom-text {
        display: flex;
        justify-content: space-between;
    }
</style>