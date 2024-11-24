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
        const maxHp = encounterState.state.player.maxHp
        encounterState.state.player.currentHp = Math.floor(maxHp / 4)
        encounterState.state.player.dead = false
        onTravel(-1)
    }
</script>
<div>
    <button onclick={attack}>Attack</button> ~{damagerPerAttack} damage
    {#if isDead.playerDead}
        <button onclick={abort}>Abort</button>
    {/if}
</div>