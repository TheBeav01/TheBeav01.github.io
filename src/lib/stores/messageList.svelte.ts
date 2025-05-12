import Box from "../utils/stateBox.svelte";
import { getPartnerName } from "./playerStore.svelte";

export const message_list = $state(new Box<string[]>([]))

export const log = (string: string) => {
    if (message_list.value == undefined) {
        message_list.value = []
    }
    message_list.value.push(string.replaceAll("[[partnername]]", getPartnerName() ?? "Zephyr"))
}