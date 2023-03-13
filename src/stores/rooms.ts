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
    bgColor: '#383838',
}, {
    id: '',
    title: $t('room.corridor.title'),
    fluff: $t('room.corridor.fluff'),
    isVisible: [
        ['action', 'light on'],
    ],
    color: '#000000',
    bgColor: '#FFFFFF',
}, {
    id: 'controlRoom',
    title: $t('room.control-room.title'),
    fluff: $t('room.control-room.fluff'),
    isVisible: [
        ['action', 'control room'],
    ],
    color: '#bdc482',
    bgColor: '#3d0882',
}, {
    id: 'laboratory',
    title: $t('room.laboratory.title'),
    fluff: $t('room.laboratory.fluff'),
    isVisible: [
        ['action', 'laboratory'],
    ],
    color: '#000000',
    bgColor: '#CCFFFF',
}, {
    id: 'kitchen',
    title: $t('room.kitchen.title'),
    fluff: $t('room.kitchen.fluff'),
    isVisible: [
        ['action', 'kitchen'],
    ],
    color: '#000000',
    bgColor: '#CCCC66',
}, {
    id: 'repairStation',
    title: $t('room.repair-room.title'),
    fluff: $t('room.repair-room.fluff'),
    isVisible: [
        ['action', 'repair station'],
    ],
    color: '#000000',
    bgColor: '#FFCC66',
}, {
    id: 'gym',
    title: $t('room.gym-room.title'),
    fluff: $t('room.gym-room.fluff'),
    isVisible: [
        ['action', 'gym room'],
    ],
    color: '#000000',
    bgColor: '#CCCCFF',
}, {
    id: 'bedroom1',
    title: $t('room.bedroom1.title'),
    fluff: $t('room.bedroom1.fluff'),
    isVisible: [
        ['action', 'bedroom 1'],
    ],
    color: '#000000',
    bgColor: '#CCCCFF',
}]);

export const rooms = roomList;
