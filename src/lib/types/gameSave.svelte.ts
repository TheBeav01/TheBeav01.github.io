import SaveObject from "./saveObject.svelte"

// class GameSave {
//     _save = $state(new SaveObject())
//     get save() {
//       return this._save
//     }
  
//     set save(save: SaveObject) {
//       this._save = save
//     }
// }

export const gameSave = $state({
    save: new SaveObject()
})