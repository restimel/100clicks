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
}];

export default artifacts;
