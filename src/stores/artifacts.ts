
import { $t } from '../locales/i18n';
import type {
    ConditionalItem, IconDesc,
} from './types';

export type Artifact = ConditionalItem & {
    type: 'artifact';
    title: string;
    fluff: string;
    desc: string;
    icon: IconDesc;
    usable: boolean;
    cost: (current: bigint, total: bigint) => bigint;
};
type ArtifactDefinition = Partial<Artifact>;

const artifactList: Map<string, Artifact> = new Map();

// const defaultIcon = 'M50 100a50 50 0 1 1 0 -100a50 50 0 1 1 0 100zM50 19a6.5 6.5 0 0 0 0 14a6.5 6.5 0 0 0 0 -14zM50 50a23.5 23.5 0 0 0 0 47.8a47.8 47.8 0 0 0 0 -95.6a23.5 23.5 0 0 1 0 47.8zM50 66.5a6.5 6.5 0 0 0 0 14a6.5 6.5 0 0 0 0 -14z';
function addArtifacts(artifacts: ArtifactDefinition[]) {
    let idx = 0;
    for (const artifact of artifacts) {
        const id = artifact.id ?? `room-${idx}`;
        idx++;
        artifactList.set(id, {
            id,
            type: 'artifact',
            title: artifact.title ?? '',
            fluff: artifact.fluff ?? '',
            desc: artifact.desc ?? '',
            icon: artifact.icon ?? 'fa-brands fa-codepen',
            usable: artifact.usable ?? false,
            isVisible: artifact.isVisible ?? [['artifact', 'TDM']],
            isHidden: artifact.isHidden ?? [['artifact', id]],
            cost: artifact.cost ?? (() => 0n),
        });
    }
}

addArtifacts([{
    id: 'TDM',
    title: $t('artifact.tdm.title'),
    fluff: $t('artifact.tdm.fluff'),
    icon: 'fa-solid fa-clock-rotate-left',
    isVisible: [],
}, {
    id: 'vortex',
    title: $t('artifact.vortex.title'),
    fluff: $t('artifact.vortex.fluff'),
    desc: $t('artifact.vortex.desc'),
    isHidden: [],
    cost: (n: bigint) => (n + 1n) * (n + 2n),
}, {
    id: 'double',
    title: $t('artifact.double.title'),
    icon: [{
        icon: 'fa-solid fa-hand-pointer fa-inverse',
        transformation: 'right-6 grow-8',
    }, {
        icon: 'fa-solid fa-hand-pointer',
        size: 'fa-stack-2x',
        transformation: 'left-6',
    }],
    fluff: $t('artifact.double.fluff'),
    desc: $t('artifact.double.desc'),
    isHidden: [],
    cost: (n: bigint) => 5n * (n + 1n),
    usable: true,
}, {
    id: 'past',
    title: $t('artifact.past.title'),
    icon: [{
        icon: 'fa-solid fa-hand-pointer',
        transformation: 'shrink-3',
    }, {
        icon: 'fa-solid fa-rotate-left',
        size: 'fa-stack-2x',
        transformation: 'left-6',
    }],
    fluff: $t('artifact.past.fluff'),
    desc: $t('artifact.past.desc'),
    isHidden: [],
    isVisible: [['artifact', 'double']],
    cost: (n: bigint, t: bigint) => t + 5n * (n + 1n),
    usable: true,
}]);

export const artifacts = artifactList;

export function getArtifact(id: string): Artifact | undefined {
    if (artifactList.has(id)) {
        return artifactList.get(id);
    }

    const searchValue = id.toLowerCase();
    for (const artifact of artifactList.values()) {
        if (artifact.title.toLowerCase() === searchValue) {
            return artifact;
        }
    }
    return;
}
