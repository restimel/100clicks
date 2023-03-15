import { $t } from '../locales/i18n';

import type { IconDesc } from '../stores/types';

export const icons: Record<string, [IconDesc, string]> = {
    ':click:': ['fa-regular fa-hand-pointer', $t('resources.click')],
    ':clicks:': ['fa-regular fa-hand-pointer', $t('resources.click')],
    ':lostClick:': ['fa-solid fa-ghost', $t('resources.lost-click')],
    ':lostClicks:': ['fa-solid fa-ghost', $t('resources.lost-click')],
    ':energy:': ['fa-solid fa-bolt-lightning', $t('resources.energy')],
    ':energyMax:': [['fa-solid fa-circle fa-stack-2x', 'fa-solid fa-bolt-lightning fa-stack-1x fa-inverse'], $t('resources.energy-max')],
    ':temporalEnergy:': [['fa-solid fa-calendar fa-stack-2x', 'fa-solid fa-bolt-lightning fa-stack-1x fa-inverse'], $t('resources.temporal-energy')],
    ':tEnergy:': [['fa-solid fa-calendar fa-stack-2x', 'fa-solid fa-bolt-lightning fa-stack-1x fa-inverse'], $t('resources.temporal-energy')],
    ':warning:': ['fa-solid fa-triangle-exclamation', '???'],
};
