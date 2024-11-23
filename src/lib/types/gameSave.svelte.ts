import SaveObject from "./saveObject.svelte"

export const gameSave = $state({
    save: new SaveObject()
})