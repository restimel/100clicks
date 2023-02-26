import { get, writable } from 'svelte/store';

export const run = writable(1n);
export const runOver = writable(false);

export const clicks = writable(0n);
export const lostClicks = writable(0n);

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

export const actionOpened = writable<Map<string, boolean>>(new Map());
export const actionClicked = writable<Map<string, bigint>>(new Map());
export const ghostClicks = writable<Array<Map<string, bigint>>>(new Array(100));

/* }}} */
/* {{{ Permanent states */

function createArtifacts() {
	const { subscribe, set, update } = writable<Map<string, bigint>>(new Map());

	return {
		subscribe,
		set,
		update,
		add: (id: string) => {
			update((map) => {
				const value = map.get(id) ?? 0n;
				map.set(id, value + 1n);
				return map;
			});
		},
		use: (id: string) => {
			update((map) => {
				const value = map.get(id) ?? 0n;
				if (value <= 1n) {
					map.delete(id);
				}
				map.set(id, value - 1n);
				return map;
			});
		},
	};
}
export const ownArtifacts = createArtifacts();
export const temporalEnergy = writable(0n);

/* }}} */

export function startRun() {
	actionOpened.update((map) => (map.clear(), map));
	actionClicked.update((map) => (map.clear(), map));

	lostClicks.set(0n);
	energy.set(0n);
	energyMax.set(100n);
	run.update((value) => value + 1n);
	clicks.set(0n);
	runOver.set(false);
}

export function endRun() {
	const bonusTEnergy = 100n + (get(ownArtifacts).get('vortex') ?? 0n) * 10n;
	const gainTEnergy = get(energy) * bonusTEnergy / 100n;
	temporalEnergy.update((value) => value + gainTEnergy);
	runOver.set(true);
}
