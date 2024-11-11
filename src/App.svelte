<script lang="ts">
  import { onMount } from "svelte";
  import { load } from "./lib/game-loop/gameLoop.svelte";
  import TopBar from "./lib/components/topBar.svelte";  
  import ContentArea from "./lib/components/contentArea.svelte";
    import MessageConsole from "./lib/components/messageConsole.svelte";
  onMount(() => {
    load()
  })
</script>

<main class="main-app">
  <TopBar/>
  <ContentArea/>
  <MessageConsole/>
</main>

<style>
  .main-app {
    display: flex;
    flex-direction: column;
    gap: 2em
  }
</style>
