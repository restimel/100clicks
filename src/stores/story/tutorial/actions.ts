import { get } from 'svelte/store';
import { emptyArray } from '../../../helpers/common';
import { $t } from '../../../locales/i18n';
import { _ } from 'svelte-i18n';
import { resources } from '../../run';
import type { ActionDefinition } from '../../types';
import type { StoryResource } from './resources';

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
}

const actions: ActionDefinition<StoryResource>[] = [{
    id: 'recruitment',
    title: $t('story.tutorial.actions.recruitment.title'),
    roomId: 'village',
    fluff: $t('story.tutorial.actions.recruitment.fluff'),
    description: () => get(_)($t('story.tutorial.actions.recruitment.description'), {
        values: {
            value: Number(resources.value('recruitPeon')),
        },
    }),
    action: () => {
        resources.add('peon', resources.value('recruitPeon'));
    },
    isHidden: emptyArray,
}, {
    id: 'battle',
    roomId: 'battle field',
    title: $t('story.tutorial.actions.battle.title'),
    fluff: $t('story.tutorial.actions.battle.fluff'),
    requirements: [
        ['warrior', 1n],
    ],
    action: () => {
        battle();
    },
    isHidden: [
        ['achievement', 'win1'],
    ],
}, {
    id: 'exploreBattle1',
    roomId: 'battle field',
    title: $t('story.tutorial.actions.exploreBattle1.title'),
    fluff: $t('story.tutorial.actions.exploreBattle1.fluff'),
    action: () => {
        resources.reset('monster', 200n);
    },
    isVisible: [
        ['achievement', 'win1'],
    ],
}, {
    id: 'battle2',
    roomId: 'battle field',
    title: $t('story.tutorial.actions.battle2.title'),
    fluff: $t('story.tutorial.actions.battle2.fluff'),
    requirements: [
        ['warrior', 1n],
    ],
    action: () => {
        battle();
    },
    isVisible: [
        ['achievement', 'win1'],
        ['action', 'exploreBattle1'],
    ],
    isHidden: [
        ['achievement', 'win2'],
    ],
}, {
    id: 'exploreBattle2',
    roomId: 'battle field',
    title: $t('story.tutorial.actions.exploreBattle2.title'),
    fluff: $t('story.tutorial.actions.exploreBattle2.fluff'),
    action: () => {
        resources.reset('monster', 1000n);
    },
    isVisible: [
        ['achievement', 'win2'],
    ],
}, {
    id: 'battle3',
    roomId: 'battle field',
    title: $t('story.tutorial.actions.battle3.title'),
    fluff: $t('story.tutorial.actions.battle3.fluff'),
    requirements: [
        ['warrior', 1n],
        ['action', 'exploreBattle2'],
    ],
    action: () => {
        battle();
    },
    isVisible: [
        ['achievement', 'win2'],
    ],
    isHidden: [
        ['achievement', 'win3'],
    ],
}, {
    id: 'exploreBattle3',
    roomId: 'battle field',
    title: $t('story.tutorial.actions.exploreBattle3.title'),
    fluff: $t('story.tutorial.actions.exploreBattle3.fluff'),
    isVisible: [
        ['achievement', 'win3'],
    ],
}, {
    id: 'finalBattle',
    roomId: 'battle field',
    title: $t('story.tutorial.actions.finalBattle.title'),
    fluff: $t('story.tutorial.actions.finalBattle.fluff'),
    cost: [
        ['warrior', 100n],
    ],
    action: () => {
        console.log('todo last battle', resources.value('warrior'));
    },
    isVisible: [
        ['action', 'exploreBattle3'],
    ],
}, {
    id: 'train worker',
    roomId: 'village',
    title: $t('story.tutorial.actions.trainWorker.title'),
    fluff: $t('story.tutorial.actions.trainWorker.fluff'),
    cost: [
        ['peon', 1n],
    ],
    action: () => resources.add('worker', 1n),
    isHidden: emptyArray,
}, {
    id: 'train warrior',
    roomId: 'village',
    title: $t('story.tutorial.actions.trainWarrior.title'),
    fluff: $t('story.tutorial.actions.trainWarrior.fluff'),
    cost: [
        ['peon', 1n],
        ['sword', 1n],
    ],
    action: () => resources.add('warrior', 1n),
    isHidden: emptyArray,
}, {
    id: 'explore village',
    roomId: 'village',
    title: $t('story.tutorial.actions.exploreVillage.title'),
    fluff: $t('story.tutorial.actions.exploreVillage.fluff'),
}, {
    id: 'forge',
    roomId: 'village',
    title: $t('story.tutorial.actions.forge.title'),
    fluff: $t('story.tutorial.actions.forge.fluff'),
    description: $t('story.tutorial.actions.forge.description'),
    cost: [
        ['worker', 1n],
    ],
    action: () => resources.add('sword', 10n),
    isVisible: [
        ['action', 'explore village'],
    ],
    isHidden: emptyArray,
}, {
    id: 'town hall',
    roomId: 'village',
    title: $t('story.tutorial.actions.townHall.title'),
    fluff: $t('story.tutorial.actions.townHall.fluff'),
    isVisible: [
        ['action', 'explore village'],
    ],
}, {
    id: 'mayor1',
    roomId: 'village',
    title: $t('story.tutorial.actions.mayor1.title'),
    fluff: $t('story.tutorial.actions.mayor1.fluff'),
    isVisible: [
        ['action', 'town hall'],
    ],
}, {
    id: 'mayor2',
    roomId: 'village',
    title: $t('story.tutorial.actions.mayor2.title'),
    fluff: $t('story.tutorial.actions.mayor2.fluff'),
    isVisible: [
        ['action', 'mayor1'],
    ],
    cost: [
        ['click', 5n],
    ],
}, {
    id: 'mayor3',
    roomId: 'village',
    title: $t('story.tutorial.actions.mayor3.title'),
    fluff: $t('story.tutorial.actions.mayor3.fluff'),
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
    title: $t('story.tutorial.actions.smallFarm.title'),
    fluff: $t('story.tutorial.actions.smallFarm.fluff'),
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
}];

export default actions;
