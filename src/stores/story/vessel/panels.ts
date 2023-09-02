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
            condition: 'hadEnergy',
            label: $t('resources.energy--icon'),
            value: 'energy',
            valueMax: 'energyMax',
        }, {
            condition: 'hadLostClick',
            detail: $t('resources.lost-click--details'),
            label: $t('resources.lost-click--icon'),
            value: 'lostClicks',
        },
    ],
}, {
    type: 'panel',
    id: 'artifacts',
    header: '',
    panelType: 'artifacts',
    isVisible: true,
    isHidden: false,
}, {
    type: 'panel',
    id: 'equipments',
    header: '',
    panelType: 'equipments',
    isVisible: [['achievement', 'hadEquipment']],
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
