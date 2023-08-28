import { $t } from '../locales/i18n';

import type { IconDesc } from '../stores/types';

export const icons: Map<string, [IconDesc, string]> = new Map([
    [':click:', ['fa-regular fa-hand-pointer', $t('resources.click')]],
    [':clicks:', ['fa-regular fa-hand-pointer', $t('resources.click')]],
    [':lostClick:', ['fa-solid fa-ghost', $t('resources.lost-click')]],
    [':lostClicks:', ['fa-solid fa-ghost', $t('resources.lost-click')]],
    [':warning:', ['fa-solid fa-triangle-exclamation', '???']],
    [':lock:', ['fa-solid fa-lock', $t('resources.lock')]],
    [':unlock:', ['fa-solid fa-unlock', $t('resources.unlock')]],
]);
