<script lang="ts">
    import type LivingEntity from "../../types/livingEntity.svelte";
    import StatBar from "../bars/statBar.svelte";
    const { entity, additionalBarText = "", labels = [], barColor = "#16b8b8"} : {entity: LivingEntity, additionalBarText?: string, labels?: string[], barColor?: string} = $props()
</script>
{entity.name}
<StatBar currentRes={entity.hpStat.value} maxRes={entity.hpStat.maxValue} additionalText={additionalBarText} barColor={barColor}/>
<div>
    {#each labels as label}
        <span>{label}</span>
    {/each}
</div>
<div>
    {entity.attackStat.value} Attack
    {entity.defenseStat.value} Defense
</div>