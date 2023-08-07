import { get, writable } from 'svelte/store';
import { addActions } from './items/actions';
import { addArtifacts } from './items/artifacts';
import { addEquipments } from './items/equipments';
import { addRooms } from './items/rooms';
import { resources as runResources, saveStoryEffects, startRun } from './run';
import achievements from './achievements';
import vesselStory from './story/vessel';
import tutorialStory from './story/tutorial';
import type { Panel, Story } from './types';

type StoryResource = string;

export const storyList = new Map<string, Story<StoryResource>>();
function addStory(story: Story<StoryResource>) {
    storyList.set(story.id, story);
}

export const storyReady = writable(false);
export const activeStory = writable<string>('vessel');

export let panels: Panel<StoryResource>[] = [];

/* Register stories */
addStory(tutorialStory);
addStory(vesselStory);

export function startStory(): boolean {
    storyReady.set(false);
    const story = storyList.get(get(activeStory));

    if (!story) {
        return false;
    }

    const {
        achievements: initializeAchievement,
        actions,
        artifacts,
        panels: storyPanels,
        equipments,
        resources,
        rooms,
        setIconText,
        storyEffects,
    } = story;

    addActions(actions, true);
    addRooms(rooms, true);
    addArtifacts(artifacts, true);
    addEquipments(equipments, true);

    runResources.initialize(resources);
    setIconText();

    saveStoryEffects(storyEffects);

    achievements.initialize(initializeAchievement());

    panels = storyPanels;

    /* TODO: do this line only if there are no data in storage */
    startRun();

    storyReady.set(true);
    return true;
}
