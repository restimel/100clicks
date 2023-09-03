import { $t } from '../../../locales/i18n';
import type { RoomDefinition } from '../../types';
import type { StoryResource } from './resources';

const rooms: RoomDefinition<StoryResource>[] = [{
    id: 'explanation',
    title: $t('story.tutorial.rooms.explanation.title'),
    bgColor: '#e0e8f0',
}, {
    id: 'main',
    title: $t('story.tutorial.rooms.main.title'),
    bgColor: '#fdbe4c',
}, {
    id: 'improvement',
    title: $t('story.tutorial.rooms.improvement.title'),
    isVisible: [
        ['action', 'improve'],
    ],
    bgColor: '#baf3bc',
}];

export default rooms;
