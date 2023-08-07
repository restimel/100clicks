import { get, writable } from 'svelte/store';
import {
	writableArray,
	writableIncMap,
	writableMap,
	writableSet,
} from '../helpers/SvelteStore';
import { playAmbient } from './sound';
import type { Writable } from 'svelte/store';
import type { ResourcesDefinition, StoryEffects } from './types';

export const run = writable(1n);
export const runOver = writable(false);

export const clicks = writable(0n);
export const lostClicks = writable(0n);

/** List of equipment acquired during the run */
export const ownEquipments = writableSet<string>();

type StoryResource = string;

function createResources() {
	const storeValues = writable<Record<string, Writable<bigint>>>({});
	const { subscribe, set, update } = storeValues;
	let defaultValues = new Map<string, bigint>();

	const shopCurrency = writable<bigint>(0n);

	function getStore(resourceName: string): Writable<bigint> | undefined {
		const values = get(storeValues);
		return values[resourceName];
	}

	function getValue(resourceName: string): bigint | undefined {
		const resource = getStore(resourceName);
		if (resource) {
			return get(resource);
		}
	}

	function setValue(resourceName: string, value: bigint, noCheck = false) {
		const resource = getStore(resourceName);
		resource?.set(value);

		if (!noCheck) {
			checkMax(resourceName);
		}
	}

	function checkMax(resourceName: string) {
		const max = getValue(resourceName + 'Max');
		if (max === undefined) {
			return;
		}

		/* undefined should be converted to 0n */
		const value = getValue(resourceName) as bigint;
		if (value > max) {
			setValue(resourceName, max, true);
		}
	}

	function reset(resourceName: string, value?: bigint) {
		const resourceValue = getValue(resourceName);
		if (resourceValue === undefined) {
			return;
		}
		const defaultValue = value ?? defaultValues.get(resourceName) ?? 0n;
		setValue(resourceName, defaultValue, true);
	}

	function resetAll() {
		for (const [resourceName, defaultValue] of defaultValues) {
			reset(resourceName, defaultValue);
		}
	}

	return {
		subscribe,
		set,
		update,
		store: getStore,
		value: (resourceName: string): bigint => {
			const resourceValue = getValue(resourceName);
			return resourceValue ?? 0n;
		},
		add: (resourceName: string, value = 1n) => {
			const resourceValue = getValue(resourceName);
			if (resourceValue === undefined) {
				return;
			}
			setValue(resourceName, resourceValue + value);
		},
		reset,
		resetAll,
		pay: (resourceName: string, value: bigint): boolean => {
			/* undefined should be converted to 0n */
			const resourceValue = getValue(resourceName) as bigint;
			if (resourceValue < value) {
				return false;
			}
			setValue(resourceName, resourceValue - value, true);
			return true;
		},
		initialize: (values: ResourcesDefinition<StoryResource>) => {
			const resources: Record<string, Writable<bigint>> = {
				clicks: clicks,
				lostClicks: lostClicks,
				shopCurrency: shopCurrency,
			};
			const initValues: Array<[string, bigint]> = values.map((value) => {
				if (typeof value === 'string') {
					const store = writable(0n);
					resources[value] = store;
					return [value, 0n];
				}

				const [defaultName, defaultValue] = value;
				if (typeof defaultValue === 'bigint') {
					const store = writable(defaultValue);
					resources[defaultName] = store;
					return [defaultName, defaultValue];
				}
				resources[defaultName] = defaultValue;

				return [defaultName, get(defaultValue)];
			});
			defaultValues = new Map(initValues);
			defaultValues.set('clicks', 0n);
			defaultValues.set('lostClicks', 0n);
			set(resources);
		},
	};
}
export const resources = createResources();

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

/* }}} */

export let storyEffects: StoryEffects = {};

export function saveStoryEffects(effects: StoryEffects) {
	storyEffects = effects;
}

export function startRun() {
	actionOpened.clear();
	actionClicked.clear();
	ownEquipments.clear();

	resources.resetAll();

	run.update((value) => value + 1n);
	runOver.set(false);

    playAmbient();

	storyEffects.startRun?.(get(run));
}

export function endRun() {
	storyEffects.endRun?.(get(run));

	runOver.set(true);
}
