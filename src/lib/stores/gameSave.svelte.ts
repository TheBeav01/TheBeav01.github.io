import SaveObject from "../types/saveObject.svelte";
import { setCookie } from "../utils/cookieUtils";
import { writable } from "svelte/store";
import Box from "../utils/stateBox.svelte";
import { log } from "./messageList.svelte";
export let saveStore = new Box(new SaveObject())
export let save = new SaveObject()
export let savePos = new Box(save.storyPos)
export function saveGame(s: SaveObject = save) {
  const saveString = encodeSave()
  setCookie("save", saveString, 365)
  saveStore.value = s
  save = s
  console.log(save)
  log("Saved!")
}



/**
 * Translates the string from a series of ints and '|' to something that is implementable by the game.
 * As the creator is too lazy to properly implement a base-32 string, the '|' acts as a splitter for the various fields.
 * @param {*} stringToDecode The save string retrieved from the cookie 
 */
export function decodeSave(stringToDecode: string) {
  const newSave = JSON.parse(atob(stringToDecode))
  saveStore.value = newSave
  save = newSave
}

/**
 * Translates a variety of game features into a save string that will likely grow over time.
 */
export function encodeSave() {
  var encString = JSON.stringify(save);
  var ret = btoa(encString);
  return ret;
}

/**
 * Imports the game. Doesn't do anything of note ATM
 */
export function Import() {

}
/**
 * Exports the game into a save string that is copied to the clipboard. Unlike import, this does something
 */
export function Export() {
  const string = encodeSave()
}



export function cleanSave() {

}
