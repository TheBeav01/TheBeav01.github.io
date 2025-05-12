import { tick as tickResource } from "../resource/resourceManager.svelte";
import { resources } from "../stores/resourceStore.svelte";

export class ResourceLoop {
    static tick(diff: any) {
        let added = 0.0
        for (const res of $state.snapshot(resources)) {
            added += tickResource(res[1], diff)
        }
        resources.get("Mana")!.add(added)
    }
}