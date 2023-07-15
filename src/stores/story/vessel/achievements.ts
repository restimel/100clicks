import { writable } from 'svelte/store';
import { resources } from '../../run';
import type { AchievementDefinition } from '../../types';


export default function createAchievement(): AchievementDefinition[] {
    const hadEnergy = writable(false);
    const store = resources.store('energy');
    if (store) {
        const unsubscribeEnergy = store.subscribe((value) => {
            if (value > 0) {
                hadEnergy.set(true);
                unsubscribeEnergy();
            }
        });
    }

    return [
        ['hadEnergy', hadEnergy],
    ];
}
