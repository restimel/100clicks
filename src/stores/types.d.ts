import type { Writable } from 'svelte/store';

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

export type ConditionType<StoryResource> = StoryResource | 'click' | 'lostClicks'
    | 'run';
export type ConditionSpecialType = 'achievement' | 'action' | 'artifact'
    | 'equipment' | 'isDone';
export type Comparison<StoryResource> = [ConditionType<StoryResource>, bigint];
export type Condition<StoryResource> =
    Comparison<Exclude<StoryResource, ConditionSpecialType>>
    | ['achievement', string]
    | ['action', string]
    | ['artifact', string]
    | ['equipment', string]
    | ['isDone', boolean];

export type LogType = 'open' | 'equipment' | 'resource';
export type Log = [LogType, string];

export type ItemType = 'action' | 'room' | 'artifact' | 'equipment' | 'panel';
export type ConditionalItem<StoryResource> = {
    id: string;
    type: ItemType;
    isVisible: boolean | Condition<StoryResource>[];
    isHidden: boolean | Condition<StoryResource>[];
};

/* {{{ ConditionalItem objects */

export type Room<StoryResource> = ConditionalItem<StoryResource> & {
    type: 'room';
    title: string;
    fluff: string;
    color: string;
    bgColor: string;
};

export type RoomDefinition<StoryResource> = Partial<Room<StoryResource>>;


export type Action<StoryResource> = ConditionalItem<StoryResource> & {
    type: 'action';
    title: string;
    description: string;
    fluff: string;
    cost: Comparison<StoryResource>[];
    requirements: Condition<StoryResource>[];
    roomId: string;
    sound?: SoundTrack;
    action: (click: bigint) => Log | void;
};
export type ActionDefinition<StoryResource> = Partial<Action<StoryResource>>;


export type Equipment<StoryResource> = ConditionalItem<StoryResource> & {
    type: 'equipment';
    title: string;
    fluff: string;
    icon: IconDesc;
};
export type EquipmentDefinition<StoryResource> = Partial<Equipment<StoryResource>>;


export type Artifact<StoryResource> = ConditionalItem<StoryResource> & {
    type: 'artifact';
    title: string;
    fluff: string;
    desc: string;
    icon: IconDesc;
    usable: boolean;
    cost: (current: bigint, total: bigint) => bigint;
};
export type ArtifactDefinition<StoryResource> = Partial<Artifact<StoryResource>>;

/* }}} */
/* {{{ Panels */

export type DashboardItem = {
    condition: string | boolean;
    label: string;
    detail?: string;
    value: string | bigint;
    valueMax?: string | bigint;
};

export type PanelType = 'dashboard' | 'logs' | 'artifacts' | 'equipments';

type BasePanel<StoryResource> = ConditionalItem<StoryResource> & {
    type: 'panel',
    panelType: PanelType;
    header: string;
}

type DashboardPanel<StoryResource> = BasePanel<StoryResource> & {
    panelType: 'dashboard';
    content: DashboardItem[];
};

type LogsPanel<StoryResource> = BasePanel<StoryResource> & {
    panelType: 'logs';
};

type ArtifactsPanel<StoryResource> = BasePanel<StoryResource> & {
    panelType: 'artifacts';
};

type EquipmentsPanel<StoryResource> = BasePanel<StoryResource> & {
    panelType: 'equipments';
};

export type Panel<StoryResource> = DashboardPanel<StoryResource>
    | LogsPanel<StoryResource> | ArtifactsPanel<StoryResource>
    | EquipmentsPanel<StoryResource>;

/* }}} */

export type ResourcesDefinition<StoryResource> = Array<StoryResource | [StoryResource, bigint | Writable<bigint>]>;
export type AchievementDefinition = [string, Writable<boolean>];

export type StoryEffects = {
    /* triggered when run is started */
    startRun?: (runValue: bigint) => void;

    /* triggered when run is ended */
    endRun?: (runValue: bigint) => void;

    /* Triggered after an action effect */
    endAction?: (click: bigint) => void;
};

export type ShopDescription = {
    /** Description of the end of a run */
    fluff: string;
    /** To tell how much money is available */
    currentMoney: string;
    /** Text displayed on continue button when it is disabled because there is still no TDM artifact */
    disabledContinueRun: string;
    /** Text displayed when there is not enough resources to buy shop item */
    notEnoughCurrency: string;
    /** Text displayed when there is no more artifact to buy */
    emptyShop: string;
    /** Text displayed on button to start new run */
    runAgain: string;
};

export type Story<StoryResource> = {
    /** unique id */
    id: string;

    /** title of the story: should be translated */
    name: string;
    /** description of the story: should be translated */
    description: string;

    /** texts displayed in shop: should be translated */
    shopDescription: ShopDescription;

    actions: ActionDefinition<StoryResource>[];
    artifacts: ArtifactDefinition<StoryResource>[];
    equipments: EquipmentDefinition<StoryResource>[];
    rooms: RoomDefinition<StoryResource>[];
    achievements: () => AchievementDefinition[];

    resources: ResourcesDefinition<StoryResource>;
    setIconText: () => void;

    panels: Panel<StoryResource>[];

    storyEffects: StoryEffects;
};

export type DisplayedAction<StoryResource> = {
    id: string;
    roomId: string;
    title: string;
    description: string;
    fluff: string;
    cost: Comparison<StoryResource>[];
    prerequisites: Array<[string, boolean]>;
    canPayCost: boolean;
};

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