import { get } from 'svelte/store';
import { $t } from '../../locales/i18n';
import { _ } from 'svelte-i18n';
import actions from './vessel/actions';
import artifacts from './vessel/artifacts';
import equipments from './vessel/equipments';
import {resources, setIconText} from './vessel/resources';
import rooms from './vessel/rooms';
import achievements from './vessel/achievements';
import panels from './vessel/panels';
import { resources as runResources, ownArtifacts, run } from '../run';

import type {StoryResource} from './vessel/resources';
import type { Stars, Story } from '../types';

const story: Story<StoryResource> = {
    id: 'vessel',
    version: '0.5.0',
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
    gameOver: {
        fluff: $t('story.vessel.gameOver.fluff'),
        score: [{
            label: $t('story.vessel.gameover.score-label'),
            value: () => {
                return get(run);
            },
            score: (value: bigint) => {
                const target = 20;
                const range = 5;

                const refValue = Math.max(Number(value) - target, 1);
                const score = Math.floor(Math.log(refValue)/Math.log(range))
                const stars = Math.max(0, 5 - score) as Stars;

                return stars;
            },
        }],
    },
    actions,
    artifacts,
    equipments,
    rooms,
    achievements,

    resources,
    setIconText,


    panels: panels,

    storyEffects: {
        endRun: () => {
            const bonusTEnergy = 100n + (get(ownArtifacts).get('vortex') ?? 0n) * 10n;
            const gainTEnergy = runResources.value('energy') * bonusTEnergy / 100n;

            runResources.add('shopCurrency', gainTEnergy);
        },
    },
};

export default story;
