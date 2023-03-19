import { emptyArray, noop } from '../helpers/common';
import { $t } from '../locales/i18n';
import { energy, energyMax, ownEquipments } from './run';
import type { Comparison, Condition, ConditionalItem, Log } from './types';

export type Action = ConditionalItem & {
    type: 'action';
    title: string;
    description: string;
    fluff: string;
    cost: Comparison[];
    requirements: Condition[];
    roomId: string;
    action: (click: bigint) => Log | void;
};
type ActionDefinition = Partial<Action>;

const actionList: Map<string, Action> = new Map();

function addActions(actions: ActionDefinition[]) {
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
            action: action.action ?? noop,
        });
    }
}

addActions([{
    id: 'dynamo',
    title: $t('action.dynamo.title'),
    roomId: '',
    fluff: $t('action.dynamo.fluff'),
    description: $t('action.dynamo.description'),
    action: () => energy.update((n) => n + 1n),
    isHidden: emptyArray,
}, {
    id: 'light on',
    title: $t('action.light-on.title'),
    roomId: '',
    cost: [
        ['energy', 1n],
    ],
    fluff: $t('action.light-on.fluff'),
}, {
    id: 'laboratory',
    title: $t('action.laboratory.title'),
    roomId: '',
    cost: [
        ['energy', 5n],
    ],
    fluff: $t('action.laboratory.fluff'),
    isVisible: [['action', 'Light on']],
}, {
    id: 'kitchen',
    title: $t('action.kitchen.title'),
    roomId: '',
    cost: [
        ['energy', 5n],
    ],
    fluff: $t('action.kitchen.fluff'),
    isVisible: [['action', 'Light on']],
}, {
    id: 'repair station',
    title: $t('action.repair-room.title'),
    roomId: '',
    cost: [
        ['click', 50n],
    ],
    fluff: $t('action.repair-room.fluff'),
    isVisible: [['action', 'Light on']],
}, {
    id: 'control room',
    title: $t('action.control-room.title'),
    roomId: '',
    cost: [
        ['energy', 5n],
        ['click', 2n],
    ],
    fluff: $t('action.control-room.fluff'),
    isVisible: [['action', 'Light on']],
}, {
    id: 'bedroom1',
    title: $t('action.bedroom1.title'),
    roomId: '',
    cost: [
        ['energy', 2n],
        ['click', 5n],
    ],
    fluff: $t('action.bedroom1.fluff'),
    requirements: [['action', 'Control room']],
    isVisible: [['action', 'Light on']],
}, {
    id: 'bedroom2',
    title: $t('action.bedroom2.title'),
    roomId: '',
    cost: [
        ['energy', 1n],
        ['click', 10n],
    ],
    fluff: $t('action.bedroom2.fluff'),
    requirements: [['action', 'Control room']],
    isVisible: [['action', 'Light on']],
}, {
    id: 'gym room',
    title: $t('action.gym-room.title'),
    roomId: '',
    cost: [
        ['energy', 1n],
    ],
    fluff: $t('action.gym-room.fluff'),
    requirements: [['action', 'Control room']],
    isVisible: [['action', 'Light on']],
}, {
    title: 'Hot food',
    roomId: 'kitchen',
    cost: [
        ['click', 5n],
    ],
    isVisible: [['action', 'Kitchen']],
    requirements: [['action', 'Control room']],
    description: 'Energy: +5:energy:',
    action: () => energy.update((n) => n + 5n),
}, {
    title: $t('action.apples.title'),
    roomId: 'kitchen',
    cost: [
        ['click', 10n],
    ],
    isVisible: [['action', 'Kitchen']],
    description: $t('action.apples.description'),
    action: () => energy.update((n) => n + 2n),
}, {
    title: 'Gym tool',
    roomId: 'gym',
    fluff: 'It makes you stronger',
    cost: [
        ['energy', 20n],
        ['click', 200n],
    ],
    isVisible: [['action', 'gym room']],
    description: 'Energy max: +1:energyMax:',
    action: () => energyMax.update((n) => n + 1n),
}, {
    title: 'Gym tool 2',
    roomId: 'gym',
    fluff: 'It makes you stronger',
    cost: [
        ['energy', 100n],
    ],
    isVisible: [
        ['energyMax', 200n],
        ['action', 'gym room'],
    ],
    isHidden: emptyArray,
    description: 'Energy max: +10:energyMax:',
    action: () => energyMax.update((n) => n + 10n),
}, {
    id: 'ghost analysis',
    title: $t('action.ghost-analysis.title'),
    roomId: 'laboratory',
    fluff: $t('action.ghost-analysis.fluff'),
    cost: [
        ['energy', 1n],
        ['click', 10n],
    ],
    isVisible: [
        ['action', 'Laboratory'],
    ],
}, {
    id: 'generator',
    title: $t('action.generator.title'),
    roomId: 'repairStation',
    fluff: $t('action.generator.fluff'),
    cost: [
        ['energy', 1n],
    ],
    isVisible: [
        ['action', 'Repair station'],
    ],
    isHidden: emptyArray,
    description: $t('action.generator.description'),
    action: () => energy.update((n) => n + 4n),
}, {
    title: $t('action.search-energy-past.title'),
    roomId: 'laboratory',
    fluff: $t('action.search-energy-past.fluff'),
    cost: [
        ['lostClicks', 20n],
    ],
    isVisible: [
        ['action', 'Ghost analysis'],
    ],
    isHidden: emptyArray,
    description: $t('action.search-energy-past.description'),
    action: () => energy.update((n) => n + 10n),
}, {
    id: 'sleeping-ghost',
    title: $t('action.sleeping-ghost.title'),
    roomId: 'laboratory',
    fluff: $t('action.sleeping-ghost.fluff'),
    cost: [
        ['lostClicks', 5n],
        ['energy', 5n],
    ],
    requirements: [
        ['action', 'Bedroom 1'],
        ['action', 'Bedroom 2'],
    ],
    isVisible: [
        ['action', 'Ghost analysis'],
    ],
    isHidden: emptyArray,
    description: $t('action.sleeping-ghost.description'),
    action: () => energy.update((n) => n + 25n),
}, {
    id: 'reactor',
    title: $t('action.reactor.title'),
    roomId: '',
    fluff: $t('action.reactor.fluff'),
    cost: [
        ['energy', 500n],
        ['click', 10n],
    ],
    isVisible: [
        ['action', 'control room'],
    ],
    requirements: [
        ['action', 'Laboratory'],
        ['energyMax', 550n],
    ],
    action: () => {
        console.log('To be continued...');
    },
}, {
    id: 'search-bedroom1',
    title: $t('action.search-bedroom1.title'),
    roomId: 'bedroom1',
    fluff: $t('action.search-bedroom1.fluff'),
    cost: [
        ['click', 5n],
        ['energy', 1n],
    ],
    isVisible: [
        ['action', 'bedroom1'],
    ],
    action: (click) => {
        if (click === 3n && ownEquipments.add('paper')) {
            return ['equipment', 'paper'];
        }
        if (click === 4n && ownEquipments.add('pencil')) {
            return ['equipment', 'pencil'];
        }
        if (click === 5n && ownEquipments.add('card-staff-1')) {
            return ['equipment', 'card-staff-1'];
        }
    },
}, {
    id: 'search-bedroom2',
    title: $t('action.search-bedroom2.title'),
    roomId: 'bedroom2',
    fluff: $t('action.search-bedroom2.fluff'),
    cost: [
        ['click', 5n],
        ['energy', 1n],
    ],
    isVisible: [
        ['action', 'bedroom2'],
    ],
    action: (click) => {
        if (click === 1n && ownEquipments.add('paper')) {
            return ['equipment', 'paper'];
        }
        if (click === 2n && ownEquipments.add('pencil')) {
            return ['equipment', 'pencil'];
        }
        if (click === 5n && ownEquipments.add('card-staff-2')) {
            return ['equipment', 'card-staff-2'];
        }
    },
}]);

export const list = actionList;

export function getAction(id: string): Action | undefined {
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
