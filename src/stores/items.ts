/** Managed conditions for items (actions, rooms, equipments, ...)  */

import { get, writable } from "svelte/store";
import { getAction } from "./actions";
import {
    actionClicked,
    actionOpened,
    energy,
    energyMax,
    lostClicks,
    ownArtifacts,
    ownEquipments,
    run,
} from "./run";

import type { Writable } from "svelte/store";
import type {
    Comparison,
    Condition,
    ConditionalItem,
    ConditionType,
} from "./types";
import { getArtifact } from "./artifacts";
import { getEquipment } from "./equipments";


export const conditionMap: Record<ConditionType, Writable<bigint>> = {
    'energy': energy,
    'energyMax': energyMax,
    'lostClicks': lostClicks,
    'run': run,
    'click': writable(0n), /* should not be used */
};

export function checkComparison(actionId: string, [type, value]: Comparison): boolean {
    if (type === 'click') {
        /* compare with number of clicks */
        const currentValue = actionClicked.get(actionId) ?? 0n;
        return value > currentValue;
    }
    const store = conditionMap[type];
    const currentValue = get(store);
    return currentValue >= value;
}

export function checkCondition(item: ConditionalItem, condition: Condition): boolean {
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
            const targetAction = getAction(condition[1]);
            if (!targetAction) {
                return false;
            }
            const actionId = targetAction.id;
            return !!actionOpened.get(actionId);
        }
        case 'artifact': {
            const targetArtifact = getArtifact(condition[1]);
            if (!targetArtifact) {
                return false;
            }
            const artifactId = targetArtifact.id;
            return !!get(ownArtifacts).get(artifactId);
        }
        case 'equipment': {
            const targetEquipment = getEquipment(condition[1]);
            if (!targetEquipment) {
                return false;
            }
            const equipmentId = targetEquipment.id;
            return ownEquipments.has(equipmentId);
        }
        default:
            return checkComparison(item.id, condition);
    }
}

export function isDisplayed(item: ConditionalItem): boolean {
    const isVisible = item.isVisible.every(checkCondition.bind(null, item));
    const isHidden = !isVisible || item.isHidden.some(checkCondition.bind(null, item));
    return isVisible && !isHidden;
}
