import { get, writable } from 'svelte/store';
import { icons } from '../../../helpers/icons';
import { $t } from '../../../locales/i18n';
import type { ResourcesDefinition } from '../../types';

/* {{{ energy */

function createEnergy() {
    const { subscribe, set, update } = writable(0n);

    return {
        subscribe,
        set,
        update,
        // TODO: seems useless
        checkMax: () => {
            update((value) => {
                const max = get(energyMax);
                if (value > max) {
                    return max;
                }
                return value;
            });
        },
    };
}

export const energyMax = writable(100n);
export const energy = createEnergy();

/* }}} */

export const resources: ResourcesDefinition = [
    ['energy', energy],
    ['energyMax', energyMax],
    'temporalEnergy',
];

export function setIconText() {
    icons.set(':energy:', ['fa-solid fa-bolt-lightning', $t('resources.energy')]);
    icons.set(':energyMax:', [['fa-solid fa-circle fa-stack-2x', 'fa-solid fa-bolt-lightning fa-stack-1x fa-inverse'], $t('resources.energy-max')]);
    icons.set(':temporalEnergy:', [['fa-solid fa-calendar fa-stack-2x', 'fa-solid fa-bolt-lightning fa-stack-1x fa-inverse'], $t('resources.temporal-energy')]);
    icons.set(':tEnergy:', [['fa-solid fa-calendar fa-stack-2x', 'fa-solid fa-bolt-lightning fa-stack-1x fa-inverse'], $t('resources.temporal-energy')]);
}
