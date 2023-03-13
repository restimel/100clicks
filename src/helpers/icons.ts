import { $t } from '../locales/i18n';

import type { IconDesc } from '../stores/types';

export const icons: Record<string, [IconDesc, string]> = {
    ':click:': ['fa-regular fa-hand-pointer', $t('ressources.click')],
    ':clicks:': ['fa-regular fa-hand-pointer', $t('ressources.click')],
    ':lostClick:': ['fa-solid fa-ghost', $t('ressources.lost-click')],
    ':lostClicks:': ['fa-solid fa-ghost', $t('ressources.lost-click')],
    ':energy:': ['fa-solid fa-bolt-lightning', $t('ressources.energy')],
    ':energyMax:': [['fa-solid fa-circle fa-stack-2x', 'fa-solid fa-bolt-lightning fa-stack-1x fa-inverse'], $t('ressources.energy-max')],
    ':temporalEnergy:': [['fa-solid fa-calendar fa-stack-2x', 'fa-solid fa-bolt-lightning fa-stack-1x fa-inverse'], $t('ressources.temporal-energy')],
    ':tEnergy:': [['fa-solid fa-calendar fa-stack-2x', 'fa-solid fa-bolt-lightning fa-stack-1x fa-inverse'], $t('ressources.temporal-energy')],
    ':warning:': ['fa-solid fa-triangle-exclamation', '???'],
};
