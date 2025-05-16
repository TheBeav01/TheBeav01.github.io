<script lang="ts">
    import { message_list } from "../stores/messageList.svelte";
    import { getPartnerName } from "../stores/playerStore.svelte";
    const messages = message_list.value ?? []
</script>
<div class="message-container">
    {#each messages.reverse() as message}
        <div class="message">{message.replaceAll("[[partnername]]", getPartnerName() ?? "Zephyr")}</div>
    {/each}
</div>

<style>
    .message-container {
        margin-top: auto;
        height: 8em;
        overflow-y: auto;
    }
    .message {
        font-size: smaller;
    }
</style>