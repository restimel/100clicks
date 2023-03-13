import { $t } from '../locales/i18n';
import type {
    ConditionalItem,
} from './types';

export type Room = ConditionalItem & {
    type: 'room';
    title: string;
    fluff: string;
    color: string;
    bgColor: string;
};
type RoomDefinition = Partial<Room>;

const roomList: Room[] = [];

function addRooms(rooms: RoomDefinition[]) {
    let idx = 0;
    for (const room of rooms) {
        const id = room.id ?? `room-${idx}`;
        idx++;
        roomList.push({
            id,
            type: 'room',
            title: room.title ?? '',
            fluff: room.fluff ?? '',
            color: room.color ?? '#000000',
            bgColor: room.bgColor ?? '#FFFFFF',
            isVisible: room.isVisible ?? [],
            isHidden: room.isHidden ?? [],
        });
    }
}

addRooms([{
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
    bgColor: '#87CEEB',
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
}]);

export const rooms = roomList;
