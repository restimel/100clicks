import { emptyArray } from '../../../helpers/common';
import { $t } from '../../../locales/i18n';
import type { ArtifactDefinition } from '../../types';
import type { StoryResource } from './resources';

const artifacts: ArtifactDefinition<StoryResource>[] = [{
    id: 'TDM',
    title: $t('story.tutorial.artifact.tdm.title'),
    fluff: $t('story.tutorial.artifact.tdm.fluff'),
    icon: 'fa-solid fa-clock-rotate-left',
    isVisible: emptyArray,
}, {
    id: 'vortex',
    title: $t('story.tutorial.artifact.vortex.title'),
    desc: $t('story.tutorial.artifact.vortex.desc'),
    isVisible: [['artifact', 'TDM']],
    isHidden: emptyArray,
    cost: (n: bigint) => (n + 1n) * (n + 2n),
}];

export default artifacts;
