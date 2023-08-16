import { get } from 'svelte/store';
import { emptyArray } from '../../../helpers/common';
import { $t } from '../../../locales/i18n';
import { _ } from 'svelte-i18n';
import { ownEquipments, resources } from '../../run';
import type { ActionDefinition } from '../../types';
import type { StoryResource } from './resources';
import { endStory } from '../../story';

function battle() {
    const monster = resources.value('monster');
    const warriors = resources.value('warrior');

    if (monster > warriors) {
        resources.add('monster', -warriors);
        resources.reset('warrior', 0n);
    } else {
        resources.add('warrior', -monster);
        resources.reset('monster', 0n);
        resources.add('shopCurrency', 100n);
    }

    if (resources.value('monster') <= 0n) {
        if (!ownEquipments.has('win-battle1')) {
            ownEquipments.add('win-battle1')
        } else if (!ownEquipments.has('win-battle2')) {
            ownEquipments.add('win-battle2')
        } else if (!ownEquipments.has('win-battle3')) {
            ownEquipments.add('win-battle3')
        }
    }
}

const actions: ActionDefinition<StoryResource>[] = [{
    id: 'recruitment',
    title: $t('story.necromancer.actions.recruitment.title'),
    roomId: 'village',
    fluff: $t('story.necromancer.actions.recruitment.fluff'),
    description: () => get(_)($t('story.necromancer.actions.recruitment.description'), {
        values: {
            value: Number(resources.value('recruitPeon')),
        },
    }),
    action: () => {
        resources.add('peon', resources.value('recruitPeon'));
    },
    isHidden: emptyArray,
    doneWhenHidden: true,
}, {
    id: 'battle',
    roomId: 'battle field',
    title: $t('story.necromancer.actions.battle.title'),
    fluff: $t('story.necromancer.actions.battle.fluff'),
    requirements: [
        ['warrior', 1n],
    ],
    action: () => {
        battle();
    },
    isHidden: [
        ['equipment', 'win-battle1'],
    ],
    doneWhenHidden: true,
}, {
    id: 'exploreBattle1',
    roomId: 'battle field',
    title: $t('story.necromancer.actions.exploreBattle1.title'),
    fluff: $t('story.necromancer.actions.exploreBattle1.fluff'),
    action: () => {
        resources.reset('monster', 200n);
    },
    isVisible: [
        ['action', 'battle'],
    ],
}, {
    id: 'battle2',
    roomId: 'battle field',
    title: $t('story.necromancer.actions.battle2.title'),
    fluff: $t('story.necromancer.actions.battle2.fluff'),
    requirements: [
        ['warrior', 1n],
    ],
    action: () => {
        battle();
    },
    isVisible: [
        ['action', 'exploreBattle1'],
    ],
    isHidden: [
        ['equipment', 'win-battle2']
    ],
    doneWhenHidden: true,
}, {
    id: 'exploreBattle2',
    roomId: 'battle field',
    title: $t('story.necromancer.actions.exploreBattle2.title'),
    fluff: $t('story.necromancer.actions.exploreBattle2.fluff'),
    action: () => {
        resources.reset('monster', 1000n);
    },
    isVisible: [
        ['action', 'battle2'],
    ],
}, {
    id: 'battle3',
    roomId: 'battle field',
    title: $t('story.necromancer.actions.battle3.title'),
    fluff: $t('story.necromancer.actions.battle3.fluff'),
    requirements: [
        ['warrior', 1n],
        ['action', 'exploreBattle2'],
    ],
    action: () => {
        battle();
    },
    isVisible: [
        ['action', 'battle2'],
    ],
    isHidden: [
        ['equipment', 'win-battle3']
    ],
    doneWhenHidden: true,
}, {
    id: 'exploreBattle3',
    roomId: 'battle field',
    title: $t('story.necromancer.actions.exploreBattle3.title'),
    fluff: $t('story.necromancer.actions.exploreBattle3.fluff'),
    isVisible: [
        ['action', 'battle3'],
    ],
}, {
    id: 'finalBattle',
    roomId: 'battle field',
    title: $t('story.necromancer.actions.finalBattle.title'),
    fluff: $t('story.necromancer.actions.finalBattle.fluff'),
    cost: [
        ['warrior', 100n],
    ],
    action: () => {
        endStory();
    },
    isVisible: [
        ['action', 'exploreBattle3'],
    ],
}, {
    id: 'train worker',
    roomId: 'village',
    title: $t('story.necromancer.actions.trainWorker.title'),
    fluff: $t('story.necromancer.actions.trainWorker.fluff'),
    cost: [
        ['peon', 1n],
    ],
    action: () => resources.add('worker', 1n),
    isHidden: emptyArray,
    doneWhenHidden: true,
}, {
    id: 'train warrior',
    roomId: 'village',
    title: $t('story.necromancer.actions.trainWarrior.title'),
    fluff: $t('story.necromancer.actions.trainWarrior.fluff'),
    cost: [
        ['peon', 1n],
        ['sword', 1n],
    ],
    action: () => resources.add('warrior', 1n),
    isHidden: emptyArray,
    doneWhenHidden: true,
}, {
    id: 'explore village',
    roomId: 'village',
    title: $t('story.necromancer.actions.exploreVillage.title'),
    fluff: $t('story.necromancer.actions.exploreVillage.fluff'),
}, {
    id: 'forge',
    roomId: 'village',
    title: $t('story.necromancer.actions.forge.title'),
    fluff: $t('story.necromancer.actions.forge.fluff'),
    description: $t('story.necromancer.actions.forge.description'),
    cost: [
        ['worker', 1n],
    ],
    action: () => resources.add('sword', 10n),
    isVisible: [
        ['action', 'explore village'],
    ],
    isHidden: emptyArray,
    doneWhenHidden: true,
}, {
    id: 'town hall',
    roomId: 'village',
    title: $t('story.necromancer.actions.townHall.title'),
    fluff: $t('story.necromancer.actions.townHall.fluff'),
    isVisible: [
        ['action', 'explore village'],
    ],
}, {
    id: 'mayor1',
    roomId: 'village',
    title: $t('story.necromancer.actions.mayor1.title'),
    fluff: $t('story.necromancer.actions.mayor1.fluff'),
    isVisible: [
        ['action', 'town hall'],
    ],
}, {
    id: 'mayor2',
    roomId: 'village',
    title: $t('story.necromancer.actions.mayor2.title'),
    fluff: $t('story.necromancer.actions.mayor2.fluff'),
    isVisible: [
        ['action', 'mayor1'],
    ],
    cost: [
        ['click', 5n],
    ],
}, {
    id: 'mayor3',
    roomId: 'village',
    title: $t('story.necromancer.actions.mayor3.title'),
    fluff: $t('story.necromancer.actions.mayor3.fluff'),
    isVisible: [
        ['action', 'mayor2'],
    ],
    cost: [
        ['click', 4n],
    ],
    action: () => {
        resources.add('recruitPeon', 1n);
    },
}, {
    id: 'small farms',
    roomId: 'isolate farms',
    title: $t('story.necromancer.actions.smallFarm.title'),
    fluff: $t('story.necromancer.actions.smallFarm.fluff'),
    cost: [
        ['click', 50n],
    ],
    action: (click: bigint) => {
        if (click % 5n === 0n) {
            resources.add('peonMax', 1n);
            resources.add('warriorMax', 1n);
            return ['resource', 'peonMax|1'];
        }
    },
    isHidden: emptyArray,
    doneWhenHidden: true,
}];

export default actions;
