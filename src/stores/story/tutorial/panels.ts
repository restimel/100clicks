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
            condition: true,
            label: $t('story.tutorial.resources.point--icon'),
            value: 'point',
            valueMax: 'pointMax',
        }, {
            condition: true,
            label: $t('story.tutorial.resources.used-point--icon'),
            value: 'usedPoint',
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
