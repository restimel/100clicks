import { emptyArray, noop } from '../../helpers/common';
import type { Action, ActionDefinition } from '../types';

type StoryResource = string;

const actionList: Map<string, Action<StoryResource>> = new Map();

export function addActions(actions: ActionDefinition<StoryResource>[], reset: boolean) {
    if (reset) {
        actionList.clear();
    }

    let idx = 0;
    for (const action of actions) {
        const id = action.id?.toLowerCase() ?? `action-${idx}`;
        idx++;
        actionList.set(id, {
            id,
            type: 'action',
            title: action.title ?? '',
            description: action.description ?? '',
            fluff: action.fluff ?? '',
            cost: action.cost ?? emptyArray,
            isVisible: action.isVisible ?? emptyArray,
            isHidden: action.isHidden ?? [['isDone', true]],
            requirements: action.requirements ?? emptyArray,
            roomId: action.roomId || '',
            sound: action.sound,
            action: action.action ?? noop,
        });
    }
}

export const list: Map<string, Action<StoryResource>> = actionList;

export function getAction(id: string): Action<StoryResource> | undefined {
    const searchValue = id.toLowerCase();
    if (actionList.has(searchValue)) {
        return actionList.get(searchValue);
    }

    for (const action of actionList.values()) {
        if (action.title.toLowerCase() === searchValue) {
            return action;
        }
    }
    return;
}
