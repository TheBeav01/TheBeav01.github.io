<script lang="ts">
    import { message_list } from "../stores/messageList.svelte";

    const messages = message_list.value ?? []
</script>
<div class="message-container">
    {#each messages.reverse() as message}
        <div class="message">{message}</div>
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