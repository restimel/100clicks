import { get } from 'svelte/store';
import { $t } from '../../locales/i18n';
import { _ } from 'svelte-i18n';
import type { Story } from '../types';
import actions from './vessel/actions';
import artifacts from './vessel/artifacts';
import equipments from './vessel/equipments';
import {resources, setIconText} from './vessel/resources';
import rooms from './vessel/rooms';
import achievements from './vessel/achievements';

import { resources as runResources, ownArtifacts } from '../run';
import type {StoryResource} from './vessel/resources';

const story: Story<StoryResource> = {
    id: 'vessel',
    name: $t('story.vessel.name'),
    description: $t('story.vessel.description'),
    shopDescription: {
        fluff: $t('story.vessel.shop.fluff'),
        currentMoney: $t('resources.temporal-energy--icon'),
        disabledContinueRun: $t('story.vessel.shop.disabledContinueRun'),
        notEnoughCurrency: $t('story.vessel.shop.notEnoughCurrency'),
        emptyShop: $t('story.vessel.shop.emptyShop'),
        runAgain:  $t('story.vessel.shop.runAgain'),
        gainExplanation: () => {
            const decimals = 100;
            const energy = runResources.value('energy');
            const gainEnergy = Number(energy) / decimals;

            const vortexBonus = (get(ownArtifacts).get('vortex') ?? 0n) * 10n;
            const gainVortex = energy * vortexBonus / 100n;
            const gainMultiple = Number(gainVortex) / decimals;

            const bonusTEnergy = 100n + vortexBonus;
            const realGain = energy * bonusTEnergy / 100n;

            const total = runResources.value('shopCurrency');
            const initialValue = Number(total - realGain) / decimals;

            return get(_)($t('story.vessel.shop.explanation'), {
                values: {
                    initialValue,
                    energy: Number(energy),
                    gainEnergy,
                    multiple: Number(vortexBonus),
                    gainMultiple,
                    gainTotal: Number(realGain) / decimals,
                    total: Number(total) / decimals,
                },
            });
        },
    },
    actions,
    artifacts,
    equipments,
    rooms,
    achievements,

    resources,
    setIconText,


    panels: [{
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
    }],

    storyEffects: {
        endRun: () => {
            const bonusTEnergy = 100n + (get(ownArtifacts).get('vortex') ?? 0n) * 10n;
            const gainTEnergy = runResources.value('energy') * bonusTEnergy / 100n;

            runResources.add('shopCurrency', gainTEnergy);
        },
    },
};

export default story;
