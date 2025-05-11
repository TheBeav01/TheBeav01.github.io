import SaveObject from "./saveObject.svelte"

export const gameSave = $state({
    save: new SaveObject()
})

export const getPassive = (name: string) => {
    const passive = gameSave.save.passives.find(p => p.name == name)
    if (!passive) {
        return null
    }
    return passive.toggled
}