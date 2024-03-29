import { $t } from '../../../locales/i18n';
import type { RoomDefinition } from '../../types';
import type { StoryResource } from './resources';

const rooms: RoomDefinition<StoryResource>[] = [{
    id: '',
    title: $t('room.corridor-dark.title'),
    fluff: $t('room.corridor-dark.fluff'),
    isHidden: [
        ['action', 'light on'],
    ],
    color: '#CCCCCC',
    bgColor: '#3B3B3B',
}, {
    id: '',
    title: $t('room.corridor.title'),
    fluff: $t('room.corridor.fluff'),
    isVisible: [
        ['action', 'light on'],
    ],
    color: '#000000',
    bgColor: '#ECECEC',
}, {
    id: 'controlRoom',
    title: $t('room.control-room.title'),
    fluff: $t('room.control-room.fluff'),
    isVisible: [
        ['action', 'control room'],
    ],
    color: '#DAA520',
    bgColor: '#1E355F',
}, {
    id: 'laboratory',
    title: $t('room.laboratory.title'),
    fluff: $t('room.laboratory.fluff'),
    isVisible: [
        ['action', 'laboratory'],
    ],
    color: '#000000',
    bgColor: '#B1D9E9',
}, {
    id: 'kitchen',
    title: $t('room.kitchen.title'),
    fluff: $t('room.kitchen.fluff'),
    isVisible: [
        ['action', 'kitchen'],
    ],
    color: '#000000',
    bgColor: '#F5F5DC',
}, {
    id: 'repairStation',
    title: $t('room.repair-room.title'),
    fluff: $t('room.repair-room.fluff'),
    isVisible: [
        ['action', 'repair station'],
    ],
    color: '#000000',
    bgColor: '#CD7F32',
}, {
    id: 'gym',
    title: $t('room.gym-room.title'),
    fluff: $t('room.gym-room.fluff'),
    isVisible: [
        ['action', 'gym room'],
    ],
    color: '#000000',
    bgColor: '#F0A830',
}, {
    id: 'bedroom1',
    title: $t('room.bedroom1.title'),
    fluff: $t('room.bedroom1.fluff'),
    isVisible: [
        ['action', 'bedroom1'],
    ],
    color: '#000000',
    bgColor: '#b7c9d1',
}, {
    id: 'bedroom2',
    title: $t('room.bedroom1.title'),
    fluff: $t('room.bedroom1.fluff'),
    isVisible: [
        ['action', 'bedroom2'],
    ],
    color: '#000000',
    bgColor: '#b7c9d1',
}];

export default rooms;
