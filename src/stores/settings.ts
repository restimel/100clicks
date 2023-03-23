import { writable } from "svelte/store";

export const soundVolume = writable(100);
export const musicVolume = writable(50);
export const mute = writable(false);
