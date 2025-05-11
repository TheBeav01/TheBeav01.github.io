<script>
    import { attackManually, encounterState, simulateDamage } from "../../stores/encounter.svelte";
    const damagerPerAttack = $derived(simulateDamage(encounterState.state.player, encounterState.state.foe))
    const {onTravel} = $props()
    const isDead = $derived({
        partnerDead: encounterState.state.partner.dead,
        playerDead: encounterState.state.player.dead
    })
    function attack() {
        attackManually()
    }
    function abort() {
        if (isDead.partnerDead) {
            const maxHp = encounterState.state.partner.hpStat.maxValue
            encounterState.state.partner.hpStat.value = Math.floor(maxHp / 4)
            encounterState.state.partner.dead = false
            onTravel(-1)
            return
        }
        const maxHp = encounterState.state.player.hpStat.maxValue
        encounterState.state.player.hpStat.value = Math.floor(maxHp / 4)
        encounterState.state.player.dead = false
        onTravel(-1)
    }
</script>
<div class="attack-button-container">
    <div>
        <button onclick={attack}>Attack</button> ~{damagerPerAttack} damage
    </div>
    {#if isDead.playerDead || isDead.partnerDead}
        <button class="outline" onclick={abort}>Abort</button>
    {/if}
</div>

<style>
    .attack-button-container {
        display: flex;
        flex-direction: column;
        width: fit-content;
        gap: 5px;
    }
    .outline {
        border-color: #b81616;
    }
</style>