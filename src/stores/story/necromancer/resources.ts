import { icons } from '../../../helpers/icons';
import { $t } from '../../../locales/i18n';
import type { ResourcesDefinition } from '../../types';

export type StoryResource = 'shopCurrency' | 'peon' | 'peonMax' |
    'warrior' | 'warriorMax' |
    'worker' | 'sword' | 'monster' | 'recruitPeon';

export const resources: ResourcesDefinition<StoryResource> = [
    'peon',
    ['peonMax', 20n],
    'warrior',
    ['warriorMax', 20n],
    'worker',
    'sword',
    ['monster', 50n],
    ['recruitPeon', 1n],
];

export function setIconText() {
    icons.set(':peon:', ['fa-solid fa-person', $t('story.necromancer.resources.peon')]);
    icons.set(':peonMax:', [['fa-solid fa-circle fa-stack-2x', 'fa-solid fa-person fa-stack-1x fa-inverse'], $t('story.necromancer.resources.peon-max')]);
    icons.set(':warrior:', ['fa-solid fa-user-shield', $t('story.necromancer.resources.warrior')]);
    icons.set(':warriorMax:', [['fa-solid fa-circle fa-stack-2x', 'fa-solid fa-user-shield fa-stack-1x fa-inverse'], $t('story.necromancer.resources.warrior-max')]);
    icons.set(':worker:', [['fa-solid fa-person-digging'], $t('story.necromancer.resources.worker')]);
    icons.set(':sword:', ['fa-solid fa-shield', $t('story.necromancer.resources.sword')]);
    icons.set(':monster:', ['fa-solid fa-skull', $t('story.necromancer.resources.monster')]);
    icons.set(':shopCurrency:', ['fa-solid fa-award', $t('story.necromancer.resources.reputation')]);
}
