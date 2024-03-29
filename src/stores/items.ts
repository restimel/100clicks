/** Managed conditions for items (actions, rooms, equipments, ...)  */

import { get } from 'svelte/store';
import { getAction } from './items/actions';
import {
    actionClicked,
    actionOpened,
    ownArtifacts,
    ownEquipments,
    resources,
} from './run';

import type {
    Comparison,
    Condition,
    ConditionalItem,
} from './types';
import { getArtifact } from './items/artifacts';
import { getEquipment } from './items/equipments';
import achievements from './achievements';

type StoryResource = string;

export function checkComparison(actionId: string, [type, value]: Comparison<StoryResource>): boolean {
    if (type === 'click') {
        /* compare with number of clicks */
        const currentValue = actionClicked.get(actionId) ?? 0n;
        return value > currentValue;
    }

    const currentValue = resources.value(type);
    return currentValue >= value;
}

export function checkCondition<T = StoryResource>(item: ConditionalItem<T>, condition: Condition<T>): boolean {
    switch (condition[0]) {
        case 'isDone': {
            if (item.type === "action") {
                /* Action */
                const value = !!actionOpened.get(item.id);
                return value === condition[1];
            } else {
                /* Room */
                console.warn('TODO: "isDone" for Room', item.type, item.id, condition[1]);
                return true;
            }
        }
        case 'action': {
            const targetAction = getAction(condition[1] as string);
            if (!targetAction) {
                return false;
            }
            const actionId = targetAction.id;
            return !!actionOpened.get(actionId);
        }
        case 'artifact': {
            const targetArtifact = getArtifact(condition[1] as string);
            if (!targetArtifact) {
                return false;
            }
            const artifactId = targetArtifact.id;
            return !!get(ownArtifacts).get(artifactId);
        }
        case 'equipment': {
            const targetEquipment = getEquipment(condition[1] as string);
            if (!targetEquipment) {
                return false;
            }
            const equipmentId = targetEquipment.id;
            return ownEquipments.has(equipmentId);
        }
        case 'achievement': {
            return achievements.value(condition[1] as string);
        }
        case 'panel':
            return false;
        default:
            return checkComparison(item.id, condition as Comparison<StoryResource>);
    }
}

export function isDisplayed(item: ConditionalItem<StoryResource>): boolean {
    const isVisibleProp = item.isVisible;
    const isVisible = typeof isVisibleProp === 'boolean'
        ? isVisibleProp
        : isVisibleProp.every(checkCondition.bind(null, item));

    const isHiddenProp = item.isHidden;
    const isHidden = !isVisible || (typeof isHiddenProp === 'boolean'
            ? isHiddenProp
            : isHiddenProp.some(checkCondition.bind(null, item))
    );

    return isVisible && !isHidden;
}
