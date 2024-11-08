import SaveObject from "../beans/save-object";
import { setCookie } from "../utils/cookie-utils";
// TODO: for the love of god, switch globals to a store
export let save = $state(new SaveObject())

export function saveGame(s: SaveObject = save) {
    save = s
    const saveString = encodeSave()
    setCookie("save", saveString, 365)
}

function encodeSave() {
    var encString = JSON.stringify(save);
    var ret = btoa(encString);
    return ret;
  }