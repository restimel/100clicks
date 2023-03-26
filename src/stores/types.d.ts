
export type IconDefinition = {
    /** Example: 'fa-regular fa-hand-pointer' */
    icon: string;
    /** Example: 'fa-stack-2x' */
    size?: string;
    /** Example: 'shrink-8' up-7' */
    transformation?: string;
};
type IconStrDefinition = string | IconDefinition;
export type IconDesc = IconStrDefinition | IconStrDefinition[];

export type ConditionType = 'energy' | 'energyMax' | 'click' | 'lostClicks'
    | 'run';
export type Comparison = [ConditionType, bigint];
export type Condition =
    Comparison
    | ['action', string]
    | ['artifact', string]
    | ['equipment', string]
    | ['isDone', boolean];

export type LogType = 'open' | 'equipment';
export type Log = [LogType, string];

export type ItemType = 'action' | 'room' | 'artifact' | 'equipment';
export type ConditionalItem = {
    id: string;
    type: ItemType;
    isVisible: Condition[];
    isHidden: Condition[];
};

export type DisplayedAction = {
    id: string;
    roomId: string;
    title: string;
    description: string;
    fluff: string;
    cost: Comparison[];
    prerequisites: Array<[string, boolean]>;
    canPayCost: boolean;
};

export type DashboardName = 'run' | 'logs' | 'artifacts' | 'equipments';

export type License = 'cc0' | 'by4' | 'by-nc4' | 'by3';

export type SoundCredit = {
    title: string;
    author: string;
    site: string;
    url: string;
    license: License;
    files: string[];
}

export type SoundAlias = {
    files?: string[];
    alias: Array<string | NamedSoundTrack>;
    id?: string;
    repeat?: number;
}

type SoundEffect = 'fade-in' | 'fade-out';

export type NamedSoundTrack = {
    name: string;
    variant?: number;
    id?: string;
    /** in ms */
    delay?: number;
    repeat?: number;
    /** In percentage, 50 means /2, 200 means ×2 */
    volume?: number;
    /** in ms, maximum time to play */
    duration?: number;
    /** in ms, start at given time */
    start?: number;
    /** Start a new sound right after this one */
    followed?: NamedSoundTrack;
    effect?: SoundEffect | SoundEffect[];
    /* Time in ms when the next is called before the end of current track */
    beforeEnd?: number;
};
export type SoundTrack = Partial<NamedSoundTrack>;

export type ThemeAmbient = {
    musics: NamedSoundTrack[];
    ambients: NamedSoundTrack[];
};