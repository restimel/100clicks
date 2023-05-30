
import { emptyArray } from '../../helpers/common';
import type {
    Equipment,
    EquipmentDefinition,
} from '../types';

const equipmentList: Map<string, Equipment> = new Map();

// const defaultIcon = 'M50 100a50 50 0 1 1 0 -100a50 50 0 1 1 0 100zM50 19a6.5 6.5 0 0 0 0 14a6.5 6.5 0 0 0 0 -14zM50 50a23.5 23.5 0 0 0 0 47.8a47.8 47.8 0 0 0 0 -95.6a23.5 23.5 0 0 1 0 47.8zM50 66.5a6.5 6.5 0 0 0 0 14a6.5 6.5 0 0 0 0 -14z';
export function addEquipments(equipments: EquipmentDefinition[]) {
    let idx = 0;
    for (const equipment of equipments) {
        const id = equipment.id ?? `equipment-${idx}`;
        idx++;
        equipmentList.set(id, {
            id,
            type: 'equipment',
            title: equipment.title ?? '',
            fluff: equipment.fluff ?? '',
            icon: equipment.icon ?? 'fa-brands fa-codepen',
            isVisible: equipment.isVisible ?? emptyArray,
            isHidden: equipment.isHidden ?? emptyArray,
        });
    }
}

export const equipments = equipmentList;

export function getEquipment(id: string): Equipment | undefined {
    const searchValue = id.toLowerCase();

    if (equipmentList.has(searchValue)) {
        return equipmentList.get(searchValue);
    }

    for (const equipment of equipmentList.values()) {
        if (equipment.title.toLowerCase() === searchValue) {
            return equipment;
        }
    }
    return;
}
