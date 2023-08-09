import { derived, get } from 'svelte/store';
import { writableArray, writableSet } from '../helpers/SvelteStore';
import { getAction, list } from './items/actions';
import { rooms } from './items/rooms';
import {
    actionClicked,
    actionOpened,
    clicks,
    endRun,
    ghostClicks,
    lostClicks,
    ownArtifacts,
    ownEquipments,
    resources,
    storyEffects,
} from '../stores/run';
import { checkComparison, isDisplayed } from './items';
import { getArtifact } from './items/artifacts';

import type {
    Action,
    Comparison,
    DisplayedAction,
    Log,
    Room,
} from '../stores/types';
import { getEquipment } from './items/equipments';
import { playSound, stopSound } from './sound';
import { noop } from 'svelte/internal';

type StoryResource = string;

/* {{{ exposed variables */

export const accessibleRooms = derived(
    [clicks],
    (): Room<StoryResource>[] =>
{
    const values = rooms.filter(isDisplayed);
    return values;
});

export const accessibleList = derived(
    [actionClicked, clicks],
    ([$actionClicked]): DisplayedAction<StoryResource>[] =>
{
    const values = Array.from(list.values()).filter(isDisplayed);
    const updatedActions: DisplayedAction<StoryResource>[] = values.map((action) => {
        const id = action.id;
        const description = typeof action.description === 'function' ? action.description() : action.description;
        return {
            id: action.id,
            roomId: action.roomId,
            title: action.title,
            description: description,
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
                        const targetAction = getAction(condition[1] as string);
                        if (!targetAction) {
                            return [condition[1], false];
                        }
                        const actionId = targetAction.id;
                        const isDone = !!actionOpened.get(actionId);
                        const actionName = targetAction.title || actionId;
                        return [actionName, isDone];
                    }
                    case 'artifact': {
                        const id = condition[1] as string;
                        const hasArtifact = get(ownArtifacts).get(id);
                        const artifactName = getArtifact(id)?.title ?? id;
                        return [artifactName, !!hasArtifact];
                    }
                    case 'equipment': {
                        const id = condition[1] as string;
                        const hasEquipment = ownEquipments.has(id);
                        const equipmentName = getEquipment(id)?.title ?? id;
                        return [equipmentName, !!hasEquipment];
                    }
                    case 'isDone': {
                        return [action.title, true];
                    }
                    default: {
                        const isDone = checkComparison(id, condition as Comparison<StoryResource>);
                        const [name, value] = condition;
                        const label = `${name.at(0)?.toUpperCase()}${name.slice(1)}: ${value}:${name}:`;
                        return [label, isDone];
                    }
                }
            }),
        } as DisplayedAction<StoryResource>;
    });
    return updatedActions;
});

export const logs = writableArray<Log>();
export const usingArtifact = writableSet<string>();

/* }}} */

function checkCost(action: Action<StoryResource>): boolean {
    const id = action.id;
    return action.cost.every(checkComparison.bind(null, id));
}
function payCost(action: Action<StoryResource>) {
    const id = action.id;
    const nbClick = (actionClicked.get(id) ?? 0n) + 1n;
    action.cost.forEach(([type, value]) => {
        if (type === 'click') {
            const isDone = value <= nbClick;
            if (isDone) {
                logs.push(['open', id]);
            }
            actionOpened.$set(id, isDone);
            return;
        }
        resources.pay(type, value);
    });

    /* Register the action as used */
    if (!actionOpened.has(id)) {
        logs.push(['open', id]);
        actionOpened.$set(id, true);
    }

    /* Register action clicked */
    actionClicked.$set(id, nbClick);
}

function doAction(id: string): boolean {
    const nbClicks = get(clicks);
    if (nbClicks >= 100n) {
        return false;
    }
    const action = list.get(id) ?? (id === 'cheat-end' ? {
        id: 'cheat-end',
        type: 'action',
        title: '',
        description: '',
        fluff: '',
        cost: [],
        requirements: [],
        roomId: '',
        action: noop,
        isVisible: [],
        isHidden: [],
    } as Action<string> : undefined);

    if (!action || !isDisplayed(action) || !checkCost(action)) {
        return false;
    }

    payCost(action);
    const logItem = action.action(actionClicked.get(action.id) ?? 1n);

    if (Array.isArray(logItem)) {
        logs.push(logItem);
    }

    const sound = action.sound;
    if (sound?.name) {
        playSound(sound.name, sound);
    }

    return true;
}

export function useArtifact(name: string, useIt?: boolean) {
    const useArtifact = useIt ?? !usingArtifact.has(name);

    if (!useArtifact) {
        usingArtifact.delete(name);
        stopSound('artifactUsage');
        return;
    }
    const artifact = getArtifact(name);
    const nbOwn = get(ownArtifacts).get(name) ?? 0n;

    if (!artifact?.usable || nbOwn <= 0n) {
        return;
    }
    usingArtifact.add(name);
    playSound('artifactUsage');
}

export function applyAction(id: string): number {
    const nbClicks = get(clicks);
    let nbAction = 1;
    if (nbClicks >= 100n) {
        return 0;
    }

    logs.set([]);

    if (!doAction(id)) {
        return 0;
    }
    if (usingArtifact.has('double')) {
        /* repeat the action */
        if (!doAction(id)) {
            /* If the action cannot be repeated do not use the artifact */
            usingArtifact.delete('double');
        } else {
            nbAction++;
        }
    }

    /* Replay */
    const clickIdx = Number(get(clicks));
    const ghosts = ghostClicks.at(clickIdx) ?? new Map<string, bigint>();
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
        const pastGhosts = ghostClicks.at(clickUpdateIdx);
        if (pastGhosts) {
            ghostsRec = pastGhosts;
        } else {
            /* Do not use the past artifact when there is no previous click index */
            usingArtifact.delete('past');
        }
    }

    ghostsRec.set(id, (ghosts.get(id) ?? 0n) + 1n);
    ghostClicks.change(clickUpdateIdx, ghostsRec);

    /* Use artifacts */
    get(usingArtifact).forEach((artifactName) => {
        ownArtifacts.use(artifactName);
    });
    usingArtifact.update((set) => (set.clear(), set));

    /* end action effect */
    storyEffects.endAction?.(get(clicks));

    /* Increment click */
    clicks.update(val => val + 1n);
    if (get(clicks) >= 100n) {
        endRun();
    }

    return nbAction;
}

export function clickAction(event: CustomEvent<string>) {
    const id = event.detail;
    const actions = applyAction(id);
    if (actions) {
        playSound('action', {repeat: actions});
        stopSound('artifactUsage');
    } else {
        playSound('error');
    }
}
