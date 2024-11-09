import { Resource } from "./resource.svelte";

export class Gold extends Resource {
    protected apply(toResource: Resource): void {
        return
    }
    createNew(): Resource {
        this.name = "Gold"
        this.amt = 0
        this.description = "Test Description"
        return this
    }
    
}