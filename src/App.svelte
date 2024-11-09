<script lang="ts">
  import { onMount } from "svelte";
  import { getResource } from "./lib/resource/resource-manager.svelte";
  import { load } from "./lib/game-loop/game-loop.svelte";
    import ResourceButton from "./lib/components/resourceButton.svelte";
  onMount(() => {
    load()
  })
  const gold = getResource("Gold")
  
  const doSave = (e: MouseEvent) => {
    console.log(e)
  }
  const increment = (_e: MouseEvent) => {
    gold?.add(1)
    console.log(gold)
  }
</script>

<main>
  <h1>
    Test Game
  </h1>
  <button onclick={increment}>Increment resource: {0}</button>
  <ResourceButton name="Gold"/>
  <ResourceButton name="Gold"/>
  <ResourceButton name="Gold"/>
  <ResourceButton name="Gold"/>
  <ResourceButton name="Gold"/>
  <ResourceButton name="Gold"/>

  <button onclick={doSave}>Save</button>
</main>
