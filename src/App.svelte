<script lang="ts">
  import { onMount } from "svelte";
  import { getResource } from "./lib/resource/resource-manager.svelte";
  import { load } from "./lib/game-loop/game-loop.svelte";
  import TopBar from "./lib/components/topBar.svelte";
  import Resource from "./lib/components/resource.svelte";
    import ContentArea from "./lib/components/contentArea.svelte";
  onMount(() => {
    load()
  })
</script>

<main class="main-app">
  <TopBar/>
  <ContentArea/>
</main>

<style>
  .main-app {
    display: flex;
    flex-direction: column;
  }

  .foo {
    height: 100%
  }
</style>
