import { emptyArray } from '../../helpers/common';
import type {
    Room,
    RoomDefinition,
} from '../types';

const roomList: Room[] = [];

export function addRooms(rooms: RoomDefinition[]) {
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
            isVisible: room.isVisible ?? emptyArray,
            isHidden: room.isHidden ?? emptyArray,
        });
    }
}

export const rooms = roomList;