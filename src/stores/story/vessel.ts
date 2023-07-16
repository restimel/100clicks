import { $t } from '../../locales/i18n';
import { get } from 'svelte/store';
import type { Story } from '../types';
import actions from './vessel/actions';
import artifacts from './vessel/artifacts';
import equipments from './vessel/equipments';
import {resources, setIconText} from './vessel/resources';
import rooms from './vessel/rooms';
import achievements from './vessel/achievements';

import { resources as runResources, ownArtifacts } from '../run';

const story: Story = {
    id: 'vessel',
    name: $t('story.vessel.name'),
    description: $t('story.vessel.description'),
    actions,
    artifacts,
    equipments,
    rooms,
    achievements,

    resources,
    setIconText,

    dashboard: [
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

    storyEffects: {
        endRun: () => {
            const bonusTEnergy = 100n + (get(ownArtifacts).get('vortex') ?? 0n) * 10n;
            const gainTEnergy = runResources.value('energy') * bonusTEnergy / 100n;

            runResources.add('temporalEnergy', gainTEnergy);
        },
    },
};

export default story;
