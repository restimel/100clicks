import { writable } from 'svelte/store';
import { addActions } from './items/actions';
import { addArtifacts } from './items/artifacts';
import { addEquipments } from './items/equipments';
import { addRooms } from './items/rooms';
import { startRun } from './run';
import actions from './story/vessel/actions';
import artifacts from './story/vessel/artifacts';
import equipments from './story/vessel/equipments';
import rooms from './story/vessel/rooms';

export const storyReady = writable(false);

export function startStory() {
    addActions(actions);
    addRooms(rooms);
    addArtifacts(artifacts);
    addEquipments(equipments);

    startRun();

    storyReady.set(true);
}
