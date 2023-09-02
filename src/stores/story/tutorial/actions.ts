import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';
import { $t } from '../../../locales/i18n';
import { emptyArray } from '../../../helpers/common';
import { resources } from '../../run';
import type { ActionDefinition } from '../../types';
import type { StoryResource } from './resources';
import { endStory } from '../../story';

const actions: ActionDefinition<StoryResource>[] = [
/* {{{ Tutorial */

{
    id: 'tutorial1',
    title: $t('story.tutorial.actions.tuto1.title'),
    roomId: 'explanation',
    description: $t('story.tutorial.actions.tuto1.explanation'),
    fluff: $t('story.tutorial.actions.tuto1.nextStep'),
}, {
    id: 'tutorial2',
    title: $t('story.tutorial.actions.tuto2.title'),
    roomId: 'explanation',
    description: $t('story.tutorial.actions.tuto2.explanation'),
    fluff: $t('story.tutorial.actions.tuto2.nextStep'),
    isVisible: [['action', 'tutorial1']],
}, {
    id: 'tutorial3',
    title: $t('story.tutorial.actions.tuto3.title'),
    roomId: 'explanation',
    description: $t('story.tutorial.actions.tuto3.explanation'),
    fluff: $t('story.tutorial.actions.tuto3.nextStep'),
    isVisible: [['action', 'tutorial2']],
}, {
    id: 'tutorial4',
    title: $t('story.tutorial.actions.tuto4.title'),
    roomId: 'explanation',
    description: $t('story.tutorial.actions.tuto4.explanation'),
    fluff: $t('story.tutorial.actions.tuto4.nextStep'),
    cost: [
        ['click', 2n],
    ],
    isVisible: [['action', 'tutorial3']],
}, {
    id: 'tutorial5',
    title: $t('story.tutorial.actions.tuto5.title'),
    roomId: 'explanation',
    description: $t('story.tutorial.actions.tuto5.explanation'),
    fluff: $t('story.tutorial.actions.tuto5.nextStep'),
    cost: [
        ['point', 1n],
    ],
    isVisible: [['action', 'tutorial4']],
}, {
    id: 'tutorial6',
    title: $t('story.tutorial.actions.tuto6.title'),
    roomId: 'explanation',
    description: $t('story.tutorial.actions.tuto6.explanation'),
    fluff: $t('story.tutorial.actions.tuto6.description'),
    requirements: [['usedPoint', 1n]],
    isVisible: [['action', 'tutorial5']],
}, {
    id: 'tutorial7',
    title: $t('story.tutorial.actions.tuto7.title'),
    roomId: 'explanation',
    description: $t('story.tutorial.actions.tuto7.explanation'),
    fluff: $t('story.tutorial.actions.tuto7.nextStep'),
    isVisible: [['action', 'tutorial6']],
}, {
    id: 'run2-tutorial1',
    title: $t('story.tutorial.actions.run2-tutorial1.title'),
    roomId: 'explanation',
    description: $t('story.tutorial.actions.run2-tutorial1.explanation'),
    isVisible: [['artifact', 'TDM']],
}, {
    id: 'run2-tutorial2',
    title: $t('story.tutorial.actions.run2-tutorial2.title'),
    roomId: 'explanation',
    description: $t('story.tutorial.actions.run2-tutorial2.explanation'),
    isVisible: [
        ['action', 'run2-tutorial1'],
        ['achievement', 'hadLostClick'],
    ],
}, {
    id: 'information1',
    title: $t('story.tutorial.actions.info1.title'),
    roomId: 'explanation',
    description: $t('story.tutorial.actions.info1.explanation'),
    isVisible: [['action', 'tutorial3']],
}, {
    id: 'information2',
    title: $t('story.tutorial.actions.info1.title'),
    roomId: 'explanation',
    description: $t('story.tutorial.actions.info2.explanation'),
    isVisible: [['action', 'tutorial5']],
},

/* }}} */
/* {{{ actions  */

{
    id: 'point',
    roomId: 'main',
    title: $t('story.tutorial.actions.point.title'),
    fluff: $t('story.tutorial.actions.point.fluff'),
    description: () => get(_)($t('story.tutorial.actions.point.description'), {
        values: {
            value: Number(resources.value('getPoint')),
        },
    }),
    isHidden: emptyArray,
    doneWhenHidden: true,
    action: () => {
        resources.add('point', resources.value('getPoint'));
    },
}, {
    id: 'transform',
    roomId: 'main',
    title: $t('story.tutorial.actions.transform.title'),
    fluff: $t('story.tutorial.actions.transform.fluff'),
    description: () => get(_)($t('story.tutorial.actions.transform.description'), {
        values: {
            value: Number(resources.value('getUsedPoint')),
        },
    }),
    cost: [
        ['point', 5n],
    ],
    isHidden: emptyArray,
    doneWhenHidden: true,
    action: () => {
        resources.add('usedPoint', resources.value('getUsedPoint'));
    },
}, {
    id: 'bonus',
    roomId: 'main',
    title: $t('story.tutorial.actions.bonus.title'),
    fluff: $t('story.tutorial.actions.bonus.fluff'),
    description: () => get(_)($t('story.tutorial.actions.bonus.description'), {
        values: {
            value: Number(resources.value('getUsedPoint') * 3n),
        },
    }),
    cost: [
        ['point', 1n],
    ],
    isHidden: emptyArray,
    doneWhenHidden: true,
    action: () => {
        resources.add('usedPoint', resources.value('getUsedPoint') * 3n);
    },
}, {
    id: 'improve',
    roomId: 'main',
    title: $t('story.tutorial.actions.improve.title'),
    description: $t('story.tutorial.actions.improve.description'),
    cost: [
        ['click', 5n],
    ],
    doneWhenHidden: true,
}, {
    id: 'morePoint',
    roomId: 'improvement',
    title: $t('story.tutorial.actions.morePoint.title'),
    description: $t('story.tutorial.actions.morePoint.description'),
    isVisible: [['action', 'improve']],
    isHidden: emptyArray,
    doneWhenHidden: true,
    cost: [['point', 2n]],
    action: () => {
        resources.add('getPoint', 1n);
    },
}, {
    id: 'moreUsedPoint',
    roomId: 'improvement',
    title: $t('story.tutorial.actions.moreUsedPoint.title'),
    fluff: $t('story.tutorial.actions.moreUsedPoint.fluff'),
    description: $t('story.tutorial.actions.moreUsedPoint.description'),
    isVisible: [['action', 'improve']],
    isHidden: emptyArray,
    doneWhenHidden: true,
    cost: [['usedPoint', 1n]],
    action: () => {
        resources.add('getPoint', 1n);
    },
}, {
    id: 'moreMaxPoint',
    roomId: 'improvement',
    title: $t('story.tutorial.actions.moreMaxPoint.title'),
    fluff: $t('story.tutorial.actions.moreMaxPoint.fluff'),
    description: $t('story.tutorial.actions.moreMaxPoint.description'),
    isVisible: [['action', 'improve']],
    isHidden: emptyArray,
    doneWhenHidden: true,
    cost: [['usedPoint', 5n]],
    action: () => {
        resources.add('pointMax', 10n);
    },
}, {
    id: 'unlockBonus',
    roomId: 'improvement',
    title: $t('story.tutorial.actions.unlockBonus.title'),
    fluff: $t('story.tutorial.actions.unlockBonus.fluff'),
    description: $t('story.tutorial.actions.unlockBonus.description'),
    isVisible: [['action', 'improve']],
    cost: [['click', 10n]],
}, {
    id: 'startEnd',
    roomId: 'main',
    title: $t('story.tutorial.actions.startEnd.title'),
    fluff: $t('story.tutorial.actions.startEnd.fluff'),
    requirements: [
        ['point', 10n],
    ],
    cost: [
        ['click', 2n],
    ],
    doneWhenHidden: true,
}, {
    id: 'midAction',
    roomId: 'main',
    title: $t('story.tutorial.actions.midAction.title'),
    fluff: $t('story.tutorial.actions.midAction.fluff'),
    isVisible: [['action', 'startEnd']],
    cost: [
        ['click', 50n],
    ],
}, {
    id: 'lastAction',
    roomId: 'main',
    title: $t('story.tutorial.actions.lastAction.title'),
    fluff: $t('story.tutorial.actions.lastAction.fluff'),
    isVisible: [['action', 'midEnd']],
    cost: [
        ['usedPoint', 50n],
    ],
}, {
    id: 'end',
    roomId: 'main',
    title: $t('story.tutorial.actions.end.title'),
    fluff: $t('story.tutorial.actions.end.fluff'),
    description: $t('story.tutorial.actions.end.description'),
    isVisible: [['action', 'lastAction']],
    action: () => {
        endStory();
    },
},

/* }}} */
];

export default actions;
