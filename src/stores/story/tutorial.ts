import { get } from 'svelte/store';
import { $t } from '../../locales/i18n';
import { _ } from 'svelte-i18n';
import type { Story } from '../types';
import actions from './tutorial/actions';
import artifacts from './tutorial/artifacts';
import equipments from './tutorial/equipments';
import {resources, setIconText} from './tutorial/resources';
import rooms from './tutorial/rooms';
import achievements from './tutorial/achievements';

import { resources as runResources, ownArtifacts } from '../run';
import type { StoryResource } from './tutorial/resources';

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
    id: 'tutorial',
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
                return get(_)($t('story.tutorial.shop.explanation-bonus'), { values: {
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

            return get(_)($t('story.tutorial.shop.explanation'), {
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
                condition: 'hadLostClick',
                detail: $t('resources.lost-click--details'),
                label: $t('resources.lost-click--icon'),
                value: 'lostClicks',
            }, {
                condition: 'hadReputation',
                detail: $t('story.tutorial.resources.reputation--detail'),
                label: $t('story.tutorial.resources.reputation--icon'),
                value: 'shopCurrency',
                decimals: 100n,
            },
        ],
    }, {
        type: 'panel',
        panelType: 'dashboard',
        id: 'army',
        header: $t('story.tutorial.panels.army.title'),
        isVisible: true,
        isHidden: false,
        content: [
            {
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
                valueMax: 'warriorMax',
            }, {
                condition: true,
                label: $t('story.tutorial.resources.sword--icon'),
                value: 'sword',
            },
        ],
    }, {
        type: 'panel',
        panelType: 'dashboard',
        id: 'enemy',
        header: $t('story.tutorial.panels.enemy.title'),
        isVisible: true,
        isHidden: [['equipment', 'win-battle3']],
        content: [
            {
                condition: true,
                label: $t('story.tutorial.resources.monster--icon'),
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
    }],

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
