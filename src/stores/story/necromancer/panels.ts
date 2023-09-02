import { } from '../../../helpers/achievementHelpers';
import { $t } from '../../../locales/i18n';
import type { Panel } from '../../types';
import type { StoryResource } from './resources';

const panels: Panel<StoryResource>[] = [{
    type: 'panel',
    id: 'dashboard',
    header: '',
    panelType: 'dashboard',
    isVisible: true,
    isHidden: false,
    content: [
        {
            condition: true,
            label: $t('resources.click--icon'),
            value: 'clicks',
            valueMax: 100n,
        }, {
            condition: 'hadLostClick',
            detail: $t('resources.lost-click--details'),
            label: $t('resources.lost-click--icon'),
            value: 'lostClicks',
        }, {
            condition: 'hadReputation',
            detail: $t('story.necromancer.resources.reputation--detail'),
            label: $t('story.necromancer.resources.reputation--icon'),
            value: 'shopCurrency',
            decimals: 100n,
        },
    ],
}, {
    type: 'panel',
    panelType: 'dashboard',
    id: 'army',
    header: $t('story.necromancer.panels.army.title'),
    isVisible: true,
    isHidden: false,
    content: [
        {
            condition: true,
            label: $t('story.necromancer.resources.peon--icon'),
            value: 'peon',
            valueMax: 'peonMax',
        }, {
            condition: true,
            label: $t('story.necromancer.resources.worker--icon'),
            value: 'worker',
        }, {
            condition: 'hadWarrior',
            label: $t('story.necromancer.resources.warrior--icon'),
            value: 'warrior',
            valueMax: 'warriorMax',
        }, {
            condition: true,
            label: $t('story.necromancer.resources.sword--icon'),
            value: 'sword',
        },
    ],
}, {
    type: 'panel',
    panelType: 'dashboard',
    id: 'enemy',
    header: $t('story.necromancer.panels.enemy.title'),
    isVisible: true,
    isHidden: [['equipment', 'win-battle3']],
    content: [
        {
            condition: true,
            label: $t('story.necromancer.resources.monster--icon'),
            value: 'monster',
        },
    ],
}, {
    type: 'panel',
    id: 'artifacts',
    header: '',
    panelType: 'artifacts',
    isVisible: [['achievement', 'hadArtifact']],
    isHidden: false,
}, {
    type: 'panel',
    id: 'equipments',
    header: '',
    panelType: 'equipments',
    isVisible: false,
    isHidden: false,
}, {
    type: 'panel',
    id: 'logs',
    header: '',
    panelType: 'logs',
    isVisible: true,
    isHidden: false,
}];

export default panels;
