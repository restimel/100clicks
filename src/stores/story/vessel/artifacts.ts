import { emptyArray } from '../../../helpers/common';
import { $t } from '../../../locales/i18n';
import type { ArtifactDefinition } from '../../types';
import type { StoryResource } from './resources';

const artifacts: ArtifactDefinition<StoryResource>[] = [{
    id: 'TDM',
    title: $t('artifact.tdm.title'),
    fluff: $t('artifact.tdm.fluff'),
    icon: 'fa-solid fa-clock-rotate-left',
    isVisible: emptyArray,
}, {
    id: 'vortex',
    title: $t('artifact.vortex.title'),
    fluff: $t('artifact.vortex.fluff'),
    desc: $t('artifact.vortex.desc'),
    isHidden: emptyArray,
    cost: (n: bigint) => (n + 1n) * (n + 2n),
}, {
    id: 'double',
    title: $t('artifact.double.title'),
    icon: [{
        icon: 'fa-solid fa-hand-pointer fa-inverse',
        transformation: 'right-6 grow-8',
    }, {
        icon: 'fa-solid fa-hand-pointer',
        size: 'fa-stack-2x',
        transformation: 'left-6',
    }],
    fluff: $t('artifact.double.fluff'),
    desc: $t('artifact.double.desc'),
    isHidden: emptyArray,
    cost: (n: bigint) => 5n * (n + 1n),
    usable: true,
}, {
    id: 'past',
    title: $t('artifact.past.title'),
    icon: [{
        icon: 'fa-solid fa-hand-pointer',
        transformation: 'shrink-3',
    }, {
        icon: 'fa-solid fa-rotate-left',
        size: 'fa-stack-2x',
        transformation: 'left-6',
    }],
    fluff: $t('artifact.past.fluff'),
    desc: $t('artifact.past.desc'),
    isHidden: emptyArray,
    isVisible: [['artifact', 'double']],
    cost: (n: bigint, t: bigint) => t + 5n * (n + 1n),
    usable: true,
}];

export default artifacts;
