import { get, writable } from 'svelte/store';
import {
    lostClicks,
} from '../stores/run';
import type { Writable } from 'svelte/store';
import type { AchievementDefinition } from './types';


const hadLostClick = writable(false);
const unsubscribeLostClicks = lostClicks.subscribe((value) => {
	if (value > 0) {
        hadLostClick.set(true);
        unsubscribeLostClicks();
    }
});

function createAchievement() {
	const storeValues = writable<Record<string, Writable<boolean>>>({});
	const { subscribe, set, update } = storeValues;

	function getAchievement(achievementName: string): boolean {
		const values = get(storeValues);
		const achievement = values[achievementName];
		if (!achievement) {
            return false;
		}
        return get(achievement);
	}

	return {
		subscribe,
		set,
		update,
		value: (achievementName: string): boolean => {
			return getAchievement(achievementName);
		},
		initialize: (values: AchievementDefinition[]) => {
			const achievements: Record<string, Writable<boolean>> = {
				hadLostClick,
			};
            for (const [name, value] of values) {
                achievements[name] = value;
            }
			set(achievements);
		},
	};
}
const achievements = createAchievement()

export default achievements;
