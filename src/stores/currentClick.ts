import { derived, get, writable } from 'svelte/store';
import { getAction, list } from '../stores/actions';
import { rooms } from './rooms';
import {
    actionClicked,
    actionOpened,
    clicks,
    endRun,
    energy,
    ghostClicks,
    lostClicks,
    ownArtifacts,
} from '../stores/run';
import { checkComparison, conditionMap, isDisplayed } from './items';
import { getArtifact } from './artifacts';

import type {
    Action,
} from '../stores/actions';
import type {
    DisplayedAction,
    Log,
} from '../stores/types';
import type { Room } from './rooms';


/* {{{ exposed variables */

export const accessibleRooms = derived(
    [clicks],
    (): Room[] =>
{
    const values = rooms.filter(isDisplayed);
    return values;
});

export const accessibleList = derived(
    [actionClicked, clicks],
    ([$actionClicked]): DisplayedAction[] =>
{
    const values = Array.from(list.values()).filter(isDisplayed);
    const updatedActions: DisplayedAction[] = values.map((action) => {
        const id = action.id;
        return {
            id: action.id,
            roomId: action.roomId,
            title: action.title,
            description: action.description,
            fluff: action.fluff,
            cost: action.cost.map(([type, amount]) => {
                if (type === 'click') {
                    const currentClick = $actionClicked.get(id) ?? 0n;
                    return [type, amount - currentClick];
                }
                return [type, amount];
            }),
            canPayCost: checkCost(action),
            prerequisites: action.requirements.map((condition) => {
                switch (condition[0]) {
                    case 'action': {
                        const targetAction = getAction(condition[1]);
                        if (!targetAction) {
                            return [condition[1], false];
                        }
                        const actionId = targetAction.id;
                        const isDone = !!get(actionOpened).get(actionId);
                        const actionName = targetAction.title || actionId;
                        return [actionName, isDone];
                    }
                    case 'artifact': {
                        const id = condition[1];
                        const hasArtifact = get(ownArtifacts).get(id);
                        const artifact = getArtifact(id)?.title ?? id;
                        return [artifact, !!hasArtifact];
                    }
                    case 'isDone': {
                        return [action.title, true];
                    }
                    default: {
                        const isDone = checkComparison(id, condition);
                        const [name, value] = condition;
                        const label = `${name.at(0)?.toUpperCase()}${name.slice(1)}: ${value}:${name}:`;
                        return [label, isDone];
                    }
                }
            }),
        }
    });
    return updatedActions;
});

export const logs = writable<Log[]>([]);

export const usingArtifact = (() => {
	const value = writable<Set<string>>(new Set());
    const { set, subscribe, update } = value;

	return {
		subscribe,
		set,
		update,
		add: (id: string) => {
			update((set) => {
				set.add(id);
				return set;
			});
		},
		delete: (id: string) => {
			update((set) => {
				set.delete(id);
				return set;
			});
		},
		has: (id: string) => {
			return get(value).has(id);
		},
	};
})();

/* }}} */

function checkCost(action: Action): boolean {
    const id = action.id;
    return action.cost.every(checkComparison.bind(null, id));
}
function payCost(action: Action) {
    const id = action.id;
    const nbClick = (get(actionClicked).get(id) ?? 0n) + 1n;
    action.cost.forEach(([type, value]) => {
        if (type === 'click') {
            const isDone = value <= nbClick;
            if (isDone) {
                logs.update((list) => (list.push(['open', id]), list));
            }
            actionOpened.update((map) => (map.set(id, isDone), map));
            return;
        }
        const store = conditionMap[type];
        store.update(val => val - value);
    });

    /* Register the action as used */
    if (!get(actionOpened).has(id)) {
        logs.update((list) => (list.push(['open', id]), list));
        actionOpened.update((map) => (map.set(id, true), map));
    }

    /* Register action clicked */
    actionClicked.update((map) => (map.set(id, nbClick), map));
}

function doAction(id: string): boolean {
    const nbClicks = get(clicks);
    if (nbClicks >= 100) {
        return false;
    }
    const action = list.get(id);

    if (!action || !isDisplayed(action) || !checkCost(action)) {
        return false;
    }

    payCost(action);
    action.action();

    return true;
}

export function useArtifact(name: string, useIt?: boolean) {
    const useArtifact = useIt ?? !usingArtifact.has(name);

    if (!useArtifact) {
        usingArtifact.delete(name);
        return;
    }
    const artifact = getArtifact(name);
    const nbOwn = get(ownArtifacts).get(name) ?? 0n;

    if (!artifact?.usable || nbOwn <= 0n) {
        return;
    }
    usingArtifact.add(name);
}

export function clickAction(event: CustomEvent<string>) {
    const nbClicks = get(clicks);
    if (nbClicks >= 100) {
        return;
    }

    logs.set([]);

    const id = event.detail;
    if (!doAction(id)) {
        return;
    }
    if (usingArtifact.has('double')) {
        /* repeat the action */
        if (!doAction(id)) {
            /* If the action cannot be repeated do not use the artifact */
            usingArtifact.delete('double');
        }
    }

    /* Replay */
    const clickIdx = Number(get(clicks));
    const ghosts = get(ghostClicks)[clickIdx] ?? new Map();
    let currentLostClicks = 0n;
    for (const [actionId, times] of ghosts) {
        for (let replay = 0n; replay < times; replay++) {
            if (!doAction(actionId)) {
                currentLostClicks++;
            }
        }
    }
    if (currentLostClicks > 0n) {
        lostClicks.update((value) => value + currentLostClicks);
    }

    /* Remember the action for further replay */
    let ghostsRec = ghosts;
    let clickUpdateIdx = clickIdx;
    if (usingArtifact.has('past')) {
        clickUpdateIdx = clickIdx - 1;
        ghostsRec = get(ghostClicks)[clickUpdateIdx];
        if (!ghostsRec) {
            /* Do not use the past artifact when there is no previous click index */
            usingArtifact.delete('past');
            ghostsRec = ghosts;
        }
    }

    ghostsRec.set(id, (ghosts.get(id) ?? 0n) + 1n);
    ghostClicks.update((arr) => (arr[clickUpdateIdx] = ghostsRec, arr));

    /* Use artifacts */
    get(usingArtifact).forEach((artifactName) => {
        ownArtifacts.use(artifactName);
    });
    usingArtifact.update((set) => (set.clear(), set));

    /* Check max */
    energy.checkMax();

    /* Increment click */
    clicks.update(val => val + 1n);
    if (get(clicks) >= 100n) {
        endRun();
    }
}
