import { $t } from '../../../locales/i18n';
import type { RoomDefinition } from '../../types';
import type { StoryResource } from './resources';

const rooms: RoomDefinition<StoryResource>[] = [{
    id: 'village',
    title: $t('story.necromancer.rooms.village.title'),
    fluff: $t('story.necromancer.rooms.village.fluff'),
    // color: '#CCCCCC',
    // bgColor: '#3B3B3B',
}, {
    id: 'isolate farms',
    title: $t('story.necromancer.rooms.isolateFarms.title'),
    fluff: $t('story.necromancer.rooms.isolateFarms.fluff'),
    // color: '#CCCCCC',
    // bgColor: '#3B3B3B',
}, {
    id: 'battle field',
    title: $t('story.necromancer.rooms.battleField.title'),
    fluff: $t('story.necromancer.rooms.battleField.fluff'),
    // color: '#CCCCCC',
    // bgColor: '#3B3B3B',
}];

export default rooms;
