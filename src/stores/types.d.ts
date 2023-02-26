
export type ConditionType = 'energy' | 'energyMax' | 'click' | 'lostClicks'
    | 'run';
export type Comparison = [ConditionType, bigint];
export type Condition =
    Comparison
    | ['action', string]
    | ['artifact', string]
    | ['isDone', boolean];

export type LogType = 'open';
export type Log = [LogType, string];

export type ItemType = 'action' | 'room' | 'artifact';
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

type DashboardName = 'run' | 'logs';
