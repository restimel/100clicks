import { writable } from 'svelte/store';
import {
    energy,
    lostClicks,
} from '../stores/run';


export const hadEnergy = writable(false);
const unsubscribeEnergy = energy.subscribe((value) => {
	if (value > 0) {
        hadEnergy.set(true);
        unsubscribeEnergy();
    }
});

export const hadLostClick = writable(false);
const unsubscribeLostClicks = lostClicks.subscribe((value) => {
	if (value > 0) {
        hadLostClick.set(true);
        unsubscribeLostClicks();
    }
});
