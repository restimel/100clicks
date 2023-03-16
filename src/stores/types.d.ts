
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

type DashboardName = 'run' | 'logs' | 'artifacts' | 'equipments';
