import { energy, energyMax } from './run';
import type { Comparison, Condition, ConditionalItem } from './types';

export type Action = ConditionalItem & {
    type: 'action';
    title: string;
    description: string;
    fluff: string;
    cost: Comparison[];
    requirements: Condition[];
    roomId: string;
    action: () => void;
};
type ActionDefinition = Partial<Action>;

const actionList: Map<string, Action> = new Map();

function addActions(actions: ActionDefinition[]) {
    let idx = 0;
    for (const action of actions) {
        const id = action.id ?? `action-${idx}`;
        idx++;
        actionList.set(id, {
            id,
            type: 'action',
            title: action.title ?? '',
            description: action.description ?? '',
            fluff: action.fluff ?? '',
            cost: action.cost ?? [],
            isVisible: action.isVisible ?? [],
            isHidden: action.isHidden ?? [['isDone', true]],
            requirements: action.requirements ?? [],
            roomId: action.roomId || '',
            action: action.action ?? (() => {/* no actions */}),
        });
    }
}

addActions([{
    title: 'Dynamo',
    roomId: '',
    fluff: 'A small wheel generating electricity.',
    description: 'Energy: +1:energy:',
    action: () => energy.update((n) => n + 1n),
    isHidden: [],
}, {
    title: 'Light on',
    roomId: '',
    cost: [
        ['energy', 1n],
    ],
    fluff: 'Switch the light on, so you can see where to walk',
}, {
    title: 'Laboratory',
    roomId: '',
    cost: [
        ['energy', 5n],
    ],
    fluff: 'A closed door. "Laboratory" is written on the door.',
    isVisible: [['action', 'Light on']],
}, {
    title: 'Kitchen',
    roomId: '',
    cost: [
        ['energy', 5n],
    ],
    fluff: 'A closed door. "Kitchen" is written on the door.',
    isVisible: [['action', 'Light on']],
}, {
    title: 'Repair station',
    roomId: '',
    cost: [
        ['click', 50n],
    ],
    fluff: 'A closed door. "Repair Station" is written on the door. Something blocks the door behind.',
    isVisible: [['action', 'Light on']],
}, {
    title: 'Control room',
    roomId: '',
    cost: [
        ['energy', 5n],
        ['click', 2n],
    ],
    fluff: 'A closed door. "Control room" is written on the door.',
    isVisible: [['action', 'Light on']],
}, {
    title: 'Bedroom 1',
    roomId: '',
    cost: [
        ['energy', 2n],
        ['click', 5n],
    ],
    fluff: 'A closed door. This is a door leading to a bedroom.',
    requirements: [['action', 'Control room']],
    isVisible: [['action', 'Light on']],
}, {
    title: 'Bedroom 2',
    roomId: '',
    cost: [
        ['energy', 1n],
        ['click', 10n],
    ],
    fluff: 'A closed door. This is a door leading to a bedroom.',
    requirements: [['action', 'Control room']],
    isVisible: [['action', 'Light on']],
}, {
    title: 'Gym room',
    roomId: '',
    cost: [
        ['energy', 1n],
    ],
    fluff: 'A closed door. "Gym room" is written on the door.',
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
    title: 'Small food',
    roomId: 'kitchen',
    cost: [
        ['click', 10n],
    ],
    isVisible: [['action', 'Kitchen']],
    description: 'Energy: +2:energy:',
    action: () => energy.update((n) => n + 2n),
}, {
    title: 'Gym tool',
    roomId: 'gym',
    fluff: 'It makes you stronger',
    cost: [
        ['energy', 20n],
        ['click', 200n],
    ],
    isVisible: [['action', 'Gym room']],
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
        ['action', 'Gym room'],
    ],
    isHidden: [],
    description: 'Energy max: +10:energyMax:',
    action: () => energyMax.update((n) => n + 10n),
}, {
    title: 'Ghost analysis',
    roomId: 'laboratory',
    fluff: 'What is the Time?',
    cost: [
        ['energy', 1n],
        ['click', 10n],
    ],
    isVisible: [
        ['action', 'Laboratory'],
    ],
}, {
    title: 'Generator',
    roomId: 'repairStation',
    fluff: 'It generates electricity',
    cost: [
        ['energy', 1n],
    ],
    isVisible: [
        ['action', 'Repair station'],
    ],
    isHidden: [],
    description: 'Energy: +4:energy:',
    action: () => energy.update((n) => n + 4n),
}, {
    title: 'Energy of the past',
    roomId: 'laboratory',
    fluff: 'When lost actions generates energy!',
    cost: [
        ['lostClicks', 20n],
    ],
    isVisible: [
        ['action', 'Ghost analysis'],
    ],
    isHidden: [],
    description: 'Energy: +10:energy:',
    action: () => energy.update((n) => n + 10n),
}, {
    title: 'Sleeping ghost',
    roomId: 'laboratory',
    fluff: 'When lost actions generates energy!',
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
    isHidden: [],
    description: 'Energy: +25:energy:',
    action: () => energy.update((n) => n + 25n),
}, {
    title: 'Reactor',
    roomId: '',
    fluff: 'This is the heart of the vessel.',
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
}]);

export const list = actionList;

export function getAction(id: string): Action | undefined {
    if (actionList.has(id)) {
        return actionList.get(id);
    }

    const searchValue = id.toLowerCase();
    for (const action of actionList.values()) {
        if (action.title.toLowerCase() === searchValue) {
            return action;
        }
    }
    return;
}
