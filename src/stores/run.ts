import { get, writable } from 'svelte/store';
import {
	writableArray,
	writableIncMap,
	writableMap,
	writableSet,
} from '../helpers/SvelteStore';
import { playAmbient } from './sound';

export const run = writable(1n);
export const runOver = writable(false);

export const clicks = writable(0n);
export const lostClicks = writable(0n);

/** List of equipment acquired during the run */
export const ownEquipments = writableSet<string>();

/* {{{ energy */

function createEnergy() {
	const { subscribe, set, update } = writable(0n);

	return {
		subscribe,
		set,
		update,
		checkMax: () => {
			update((value) => {
				const max = get(energyMax);
				if (value > max) {
					return max;
				}
				return value;
			});
		},
	};
}

export const energyMax = writable(100n);
export const energy = createEnergy();

/* }}} */
/* {{{ Memorize */

/** List all action done at least once, and set it to true if it is completed */
export const actionOpened = writableMap<string, boolean>();
/** Number of click done on an action during a run */
export const actionClicked = writableMap<string, bigint>();
/** The clicks of previous run */
export const ghostClicks = writableArray<Map<string, bigint>>(new Array(100));

/* }}} */
/* {{{ Permanent states */

export const totalOwnArtifacts = writableIncMap<string>();
export const ownArtifacts = (() => {
	const { subscribe, set, update } = writable<Map<string, bigint>>(new Map());

	return {
		subscribe,
		set,
		update,
		add: (id: string) => {
			update((map) => {
				const value = map.get(id) ?? 0n;
				map.set(id, value + 1n);
				totalOwnArtifacts.inc(id, 1n);
				return map;
			});
		},
		use: (id: string) => {
			update((map) => {
				const value = map.get(id) ?? 0n;
				if (value <= 1n) {
					map.delete(id);
				} else {
					map.set(id, value - 1n);
				}
				return map;
			});
		},
	};
})();
export const temporalEnergy = writable(0n);

/* }}} */

export function startRun() {
	actionOpened.clear();
	actionClicked.clear();
	ownEquipments.clear();

	lostClicks.set(0n);
	energy.set(0n);
	energyMax.set(100n);
	run.update((value) => value + 1n);
	clicks.set(0n);
	runOver.set(false);

    playAmbient();
}

export function endRun() {
	const bonusTEnergy = 100n + (get(ownArtifacts).get('vortex') ?? 0n) * 10n;
	const gainTEnergy = get(energy) * bonusTEnergy / 100n;
	temporalEnergy.update((value) => value + gainTEnergy);
	runOver.set(true);
}
