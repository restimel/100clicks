import { icons } from '../../../helpers/icons';
import { $t } from '../../../locales/i18n';
import { resources as runResources } from '../../run';
import type { ResourcesDefinition } from '../../types';

export type StoryResource = 'shopCurrency' | 'peon' | 'peonMax' | 'warrior' |
    'worker' | 'sword' | 'reputation' | 'monster';

const reputation = runResources.store('shopCurrency');
export const resources: ResourcesDefinition<StoryResource> = [
    'peon',
    ['peonMax', 10n],
    'warrior',
    'worker',
    'sword',
    ['reputation', reputation ?? 0n],
    ['monster', 50n],
];

export function setIconText() {
    icons.set(':peon:', ['fa-solid fa-person', $t('story.tutorial.resources.peon')]);
    icons.set(':peonMax:', [['fa-solid fa-circle fa-stack-2x', 'fa-solid fa-person fa-stack-1x fa-inverse'], $t('story.tutorial.resources.peon-max')]);
    icons.set(':warrior:', ['fa-solid fa-user-shield', $t('story.tutorial.resources.warrior')]);
    icons.set(':worker:', [['fa-solid fa-person-digging'], $t('story.tutorial.resources.worker')]);
    icons.set(':sword:', ['fa-solid fa-shield', $t('story.tutorial.resources.sword')]);
    icons.set(':monster:', ['fa-solid fa-skull', $t('story.tutorial.resources.monster')]);
    icons.set(':reputation:', ['fa-solid fa-award', $t('story.tutorial.resources.reputation')]);
    icons.set(':shopCurrency:', ['fa-solid fa-award', $t('story.tutorial.resources.reputation')]);
}
