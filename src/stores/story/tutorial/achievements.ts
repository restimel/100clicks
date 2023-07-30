import { writable } from 'svelte/store';
import { resources } from '../../run';
import type { AchievementDefinition } from '../../types';
import type { Writable } from 'svelte/store';

function hasValue(resourceName: string): Writable<boolean> {
    const storeAchievement = writable(false);
    const storeResource = resources.store(resourceName);
    if (storeResource) {
        const unsubscribeStore = storeResource.subscribe((value) => {
            if (value > 0n) {
                storeAchievement.set(true);
                unsubscribeStore();
            }
        });
    }
    return storeAchievement;
}

function isNotEmpty(resourceName: string): Promise<boolean> {
    const promise = new Promise<boolean>((resolve) => {
        const storeResource = resources.store(resourceName);
        if (storeResource) {
            const unsubscribeStore = storeResource.subscribe((value) => {
                if (value > 0n) {
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

function isEmptyAfter(resourceName: string, previous?: Writable<boolean>): Writable<boolean> {
    const storeAchievement = writable(false);
    if (previous) {
        const unsubscribeStore = previous.subscribe((value) => {
            if (value) {
                isNotEmpty(resourceName).then(() => {
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

export default function createAchievement(): AchievementDefinition[] {
    const win1 = isEmptyAfter('monster');
    const win2 = isEmptyAfter('monster', win1);
    const win3 = isEmptyAfter('monster', win2);

    return [
        ['hadWarrior', hasValue('warrior')],
        ['hadSword', hasValue('sword')],
        ['hadReputation', hasValue('reputation')],
        ['win1', win1],
        ['win2', win2],
        ['win3', win3],
    ];
}
