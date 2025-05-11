import { tick as tickResource } from "../resource/resourceManager.svelte";
import { resources } from "../stores/resourceStore.svelte";

export class ResourceLoop {
    static tick(diff: any) {
        for (const res of $state.snapshot(resources)) {
            tickResource(res[1], diff)
        }
    }
}