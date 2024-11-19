<script lang="ts">
    import { createProgress, melt } from "@melt-ui/svelte";
    const {currentRes, maxRes} : {currentRes: number, maxRes: number} = $props()
    const {
        elements: { root },
  } = createProgress({
    max: 100,
  });
</script>
<div>
    <div class="base-progress base-height" use:melt={$root}>
        <div class="base-height bar-fill" style={`transform: translateX(-${
            Math.floor(100 - ((currentRes / (maxRes ?? currentRes)) * 100))
          }%)`}></div>
    </div>
    {currentRes} / {maxRes}
</div>

<style>
    .base-progress {
        background-color: whitesmoke;
        overflow-y: hidden;
    }
    .bar-fill {
        background-color: aqua;
    }
    .base-height {
        height: 5px;
    }
</style>