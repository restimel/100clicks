import { icons } from '../../../helpers/icons';
import { $t } from '../../../locales/i18n';
import type { ResourcesDefinition } from '../../types';

export type StoryResource = 'shopCurrency' | 'point' | 'pointMax' | 'usedPoint' | 'getPoint' | 'getUsedPoint';

export const resources: ResourcesDefinition<StoryResource> = [
    'point',
    ['pointMax', 50n],
    'usedPoint',
    ['getPoint', 1n],
    ['getUsedPoint', 1n],
];

export function setIconText() {
    icons.set(':point:', ['fa-solid fa-cookie', $t('story.tutorial.resources.point')]);
    icons.set(':pointMax:', [['fa-solid fa-circle fa-stack-2x', 'fa-solid fa-person fa-stack-1x fa-inverse'], $t('story.tutorial.resources.point-max')]);
    icons.set(':usedPoint:', ['fa-solid fa-cookie-bite', $t('story.tutorial.resources.used-point')]);
    icons.set(':shopCurrency:', ['fa-solid fa-ticket', $t('story.tutorial.resources.shopCurrency')]);
}
