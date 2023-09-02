import { get } from 'svelte/store';
import { $t } from '../../locales/i18n';
import { _ } from 'svelte-i18n';
import type { Stars, Story } from '../types';
import actions from './necromancer/actions';
import artifacts from './necromancer/artifacts';
import equipments from './necromancer/equipments';
import {resources, setIconText} from './necromancer/resources';
import rooms from './necromancer/rooms';
import achievements from './necromancer/achievements';

import { resources as runResources, ownArtifacts, run } from '../run';
import type { StoryResource } from './necromancer/resources';
import panels from './necromancer/panels';

/**
 * @return [total, baseGain, bonusGain]
 */
function gainReputation(lostClicks: bigint, vortex: bigint): [bigint, bigint, bigint] {
    const shopDecimals = 100n;
    const base = 100n;
    const bonusShop = base + vortex * 10n;
    const gainRatio = 4n;
    const baseValue = lostClicks * shopDecimals;
    const gainShop = baseValue * bonusShop / (base * gainRatio);
    const realGain = gainShop < shopDecimals ? shopDecimals : gainShop;

    return [realGain, baseValue / gainRatio, realGain - gainShop];
}

const story: Story<StoryResource> = {
    id: 'necromancer',
    version: '0.9.0',
    name: $t('story.necromancer.name'),
    description: $t('story.necromancer.description'),
    shopDescription: {
        fluff: $t('story.necromancer.shop.fluff'),
        currentMoney: $t('story.necromancer.resources.reputation--icon'),
        disabledContinueRun: $t('story.necromancer.shop.disabledContinueRun'),
        notEnoughCurrency: $t('story.necromancer.shop.notEnoughCurrency'),
        emptyShop: $t('story.necromancer.shop.emptyShop'),
        runAgain:  $t('story.necromancer.shop.runAgain'),
        gainExplanation: () => {
            const decimals = 100;
            const lostClicks = runResources.value('lostClicks');
            const vortex = get(ownArtifacts).get('vortex') ?? 0n;

            const [realGain, baseGain, bonusGain] = gainReputation(
                lostClicks,
                vortex
            );

            const gainLostClick = Number(baseGain) / decimals;
            const multiple = Number(vortex) * 10;
            const gainMultiple = Number(realGain - baseGain - bonusGain) / decimals;
            const gainTotal = Number(realGain) / decimals;
            const total = runResources.value('shopCurrency');
            const initialValue = Number(total - realGain) / decimals;


            if (bonusGain) {
                const bonus = Number(bonusGain) / decimals;
                return get(_)($t('story.necromancer.shop.explanation-bonus'), { values: {
                    initialValue,
                    lostClicks: Number(lostClicks),
                    gainLostClick,
                    multiple,
                    gainMultiple,
                    bonus,
                    gainTotal,
                    total: Number(total) / decimals,
                } });
            }

            return get(_)($t('story.necromancer.shop.explanation'), {
                values: {
                    initialValue,
                    lostClicks: Number(lostClicks),
                    gainLostClick,
                    multiple,
                    gainMultiple,
                    gainTotal,
                    total: Number(total) / decimals,
                },
            });
        },
    },
    gameOver: {
        fluff: $t('story.necromancer.gameOver.fluff'),
        score: [{
            label: $t('story.necromancer.gameover.score-label'),
            value: () => {
                return get(run);
            },
            score: (value: bigint) => {
                const target = 10;
                const range = 3;

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
        startRun: () => {
            runResources.add('peonMax', get(ownArtifacts).get('farmers') ?? 0n);
            runResources.add('warriorMax', get(ownArtifacts).get('farmers') ?? 0n);
        },
        endRun: () => {
            const [realGain] = gainReputation(
                runResources.value('lostClicks'),
                get(ownArtifacts).get('vortex') ?? 0n
            );

            runResources.add('shopCurrency', realGain);
        },
    },
};

export default story;
