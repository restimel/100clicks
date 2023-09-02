import { $t } from '../../../locales/i18n';
import type { RoomDefinition } from '../../types';
import type { StoryResource } from './resources';

const rooms: RoomDefinition<StoryResource>[] = [{
    id: 'explanation',
    title: $t('story.tutorial.rooms.explanation.title'),
    fluff: $t('story.tutorial.rooms.explanation.fluff'),
    // color: '#CCCCCC',
    // bgColor: '#3B3B3B',
}, {
    id: 'main',
    title: $t('story.tutorial.rooms.main.title'),
    fluff: $t('story.tutorial.rooms.main.fluff'),
    // color: '#CCCCCC',
    // bgColor: '#3B3B3B',
}, {
    id: 'improvement',
    title: $t('story.tutorial.rooms.improvement.title'),
    fluff: $t('story.tutorial.rooms.improvement.fluff'),
    isVisible: [
        ['action', 'improve'],
    ],
    // color: '#CCCCCC',
    // bgColor: '#3B3B3B',
}];

export default rooms;
