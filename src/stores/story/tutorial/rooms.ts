import { $t } from '../../../locales/i18n';
import type { RoomDefinition } from '../../types';
import type { StoryResource } from './resources';

const rooms: RoomDefinition<StoryResource>[] = [{
    id: 'village',
    title: $t('story.tutorial.rooms.village.title'),
    fluff: $t('story.tutorial.rooms.village.fluff'),
    // color: '#CCCCCC',
    // bgColor: '#3B3B3B',
}, {
    id: 'isolate farms',
    title: $t('story.tutorial.rooms.isolateFarms.title'),
    fluff: $t('story.tutorial.rooms.isolateFarms.fluff'),
    // color: '#CCCCCC',
    // bgColor: '#3B3B3B',
}, {
    id: 'battle field',
    title: $t('story.tutorial.rooms.battleField.title'),
    fluff: $t('story.tutorial.rooms.battleField.fluff'),
    // color: '#CCCCCC',
    // bgColor: '#3B3B3B',
}];

export default rooms;
