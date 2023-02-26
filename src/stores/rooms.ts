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
    title: 'Dark place',
    fluff: 'It is dark and you can\'t see anything.',
    isHidden: [
        ['action', 'light on'],
    ],
    color: '#CCCCCC',
    bgColor: '#383838',
}, {
    id: '',
    title: 'A corridor',
    fluff: 'A corridor made of metal. It leads to several doors',
    isVisible: [
        ['action', 'light on'],
    ],
    color: '#000000',
    bgColor: '#FFFFFF',
}, {
    id: 'controlRoom',
    title: 'The Control room',
    fluff: 'The heart of the vessel.',
    isVisible: [
        ['action', 'control room'],
    ],
    color: '#bdc482',
    bgColor: '#3d0882',
}, {
    id: 'laboratory',
    title: 'The laboratory',
    fluff: 'A room filled of many electronic tools.',
    isVisible: [
        ['action', 'laboratory'],
    ],
    color: '#000000',
    bgColor: '#CCFFFF',
}, {
    id: 'kitchen',
    title: 'The kitchen',
    fluff: 'A table is in the center. Pantry contains some food.',
    isVisible: [
        ['action', 'kitchen'],
    ],
    color: '#000000',
    bgColor: '#CCCC66',
}, {
    id: 'repairStation',
    title: 'A repair station',
    fluff: 'A table is in the center. Pantry contains some food.',
    isVisible: [
        ['action', 'repair station'],
    ],
    color: '#000000',
    bgColor: '#FFCC66',
}, {
    id: 'gym',
    title: 'A gym room',
    fluff: 'Many accessories for sport.',
    isVisible: [
        ['action', 'gym room'],
    ],
    color: '#000000',
    bgColor: '#CCCCFF',
}, {
    id: 'bedroom1',
    title: 'A bedroom',
    fluff: 'This is a bedroom of a crew.',
    isVisible: [
        ['action', 'bedroom 1'],
    ],
    color: '#000000',
    bgColor: '#CCCCFF',
}]);

export const rooms = roomList;
