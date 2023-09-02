import { get } from 'svelte/store';
import { $t } from '../../locales/i18n';
import { _ } from 'svelte-i18n';
import type { Stars, Story } from '../types';
import actions from './tutorial/actions';
import artifacts from './tutorial/artifacts';
import equipments from './tutorial/equipments';
import {resources, setIconText} from './tutorial/resources';
import rooms from './tutorial/rooms';
import achievements from './tutorial/achievements';
import panels from './tutorial/panels';

import { resources as runResources, run } from '../run';
import type { StoryResource } from './tutorial/resources';

const story: Story<StoryResource> = {
    id: 'tutorial',
    version: '0.1.0',
    name: $t('story.tutorial.name'),
    description: $t('story.tutorial.description'),
    shopDescription: {
        fluff: $t('story.tutorial.shop.fluff'),
        currentMoney: $t('story.tutorial.resources.reputation--icon'),
        disabledContinueRun: $t('story.tutorial.shop.disabledContinueRun'),
        notEnoughCurrency: $t('story.tutorial.shop.notEnoughCurrency'),
        emptyShop: $t('story.tutorial.shop.emptyShop'),
        runAgain:  $t('story.tutorial.shop.runAgain'),
        gainExplanation: () => {

            return get(_)($t('story.tutorial.shop.explanation'), {
                values: {
                },
            });
        },
    },
    gameOver: {
        fluff: $t('story.tutorial.gameOver.fluff'),
        score: [{
            label: $t('story.tutorial.gameover.score-label'),
            value: () => {
                return get(run);
            },
            score: (value: bigint) => {
                const target = 2;
                const range = 2;

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

    panels,

    storyEffects: {
        startRun: () => {
            /* todo */
        },
        endRun: () => {
            // const [realGain] = gainReputation(
            //     runResources.value('lostClicks'),
            //     get(ownArtifacts).get('vortex') ?? 0n
            // );

            runResources.add('shopCurrency', 1n);
        },
    },
};

export default story;
