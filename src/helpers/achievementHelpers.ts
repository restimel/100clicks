import { writable } from "svelte/store";
import { resources } from "../stores/run";

import type { Writable } from "svelte/store";

/**
 * Create a store which becomes true when the resource is greater than value (default 0n)
 * @param resourceName
 * @param refValue
 * @returns Writable<boolean>
 */
export function hasValue(resourceName: string, refValue = 0n): Writable<boolean> {
    const storeAchievement = writable(false);
    const storeResource = resources.store(resourceName);
    if (storeResource) {
        const unsubscribeStore = storeResource.subscribe((value) => {
            if (value > refValue) {
                storeAchievement.set(true);
                unsubscribeStore();
            }
        });
    }
    return storeAchievement;
}

function resourceIsSet(resourceName: string, refValue = 0n): Promise<boolean> {
    const promise = new Promise<boolean>((resolve) => {
        const storeResource = resources.store(resourceName);
        if (storeResource) {
            const unsubscribeStore = storeResource.subscribe((value) => {
                if (value > refValue) {
                    resolve(true);
                    unsubscribeStore();
                }
            });
        } else {
            resolve(false);
        }
    });

    return promise;
}

function isEmpty(resourceName: string, store: Writable<boolean>): Writable<boolean> {
    const storeResource = resources.store(resourceName);
    if (storeResource) {
        const unsubscribeStore = storeResource.subscribe((value) => {
            if (value <= 0n) {
                store.set(true);
                unsubscribeStore();
            }
        });
    }
    return store;
}

/**
 * Create a store which becomes true when the resource is 0n
 * after the given store becomes true.
 * @param resourceName
 * @param previous
 * @returns
 */
export function isEmptyAfter(resourceName: string, previous?: Writable<boolean>): Writable<boolean> {
    const storeAchievement = writable(false);
    if (previous) {
        const unsubscribeStore = previous.subscribe((value) => {
            if (value) {
                resourceIsSet(resourceName).then(() => {
                    isEmpty(resourceName, storeAchievement);
                });
                unsubscribeStore();
            }
        });
    } else {
        isEmpty(resourceName, storeAchievement);
    }

    return storeAchievement;
}

/**
 * Create a store which becomes true when the store has a certain number
 * of items.
 * @param storeRef
 * @param [sizeRef=0]
 * @returns
 */
export function hadAtLeast(storeRef: Writable<Array<unknown> | Map<unknown, unknown> | Set<unknown>>, sizeRef = 0): Writable<boolean> {
    const storeAchievement = writable(false);
    const unsubscribeStore = storeRef.subscribe((value) => {
        let trigger = false;
        if (Array.isArray(value)) {
            trigger = value.length > sizeRef;
        } else {
            trigger = value.size > sizeRef;
        }

        if (trigger) {
            storeAchievement.set(true);
            unsubscribeStore();
        }
    });

    return storeAchievement;
}
