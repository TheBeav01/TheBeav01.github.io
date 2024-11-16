<script lang="ts">
    import { createProgress, melt } from "@melt-ui/svelte";
    import { writable } from "svelte/store";
    const calculatePercentage = (current: number, max: number) => {
        return Math.floor(100 - ((current / (max ?? current)) * 100))
    }
    const {currentRes, maxRes} : {currentRes: number, maxRes: number} = $props()
    const percentage = calculatePercentage(currentRes, maxRes)
    const val = writable(percentage)
    const {
        elements: { root },
  } = createProgress({
    value: val,
    max: 100,
  });
</script>
<div>
    <div class="base-progress base-height" use:melt={$root}>
        <div class="base-height bar-fill" style={`transform: translateX(-${
            $val
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