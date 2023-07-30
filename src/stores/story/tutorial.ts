import { $t } from '../../locales/i18n';
import { get } from 'svelte/store';
import type { Story } from '../types';
import actions from './tutorial/actions';
import artifacts from './tutorial/artifacts';
import equipments from './tutorial/equipments';
import {resources, setIconText} from './tutorial/resources';
import rooms from './tutorial/rooms';
import achievements from './tutorial/achievements';

import { resources as runResources, ownArtifacts } from '../run';

const story: Story = {
    id: 'tutorial',
    name: $t('story.tutorial.name'),
    description: $t('story.tutorial.description'),
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
            condition: true,
            label: $t('story.tutorial.resources.peon--icon'),
            value: 'peon',
            valueMax: 'peonMax',
        }, {
            condition: true,
            label: $t('story.tutorial.resources.worker--icon'),
            value: 'worker',
        }, {
            condition: 'hadWarrior',
            label: $t('story.tutorial.resources.warrior--icon'),
            value: 'warrior',
        }, {
            condition: true,
            label: $t('story.tutorial.resources.sword--icon'),
            value: 'sword',
        }, {
            condition: 'hadReputation',
            label: $t('story.tutorial.resources.reputation--icon'),
            value: 'reputation',
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
