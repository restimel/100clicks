import type {
    ConditionalItem,
} from './types';

export type Artifact = ConditionalItem & {
    type: 'artifact';
    title: string;
    fluff: string;
    icon: string;
    cost: (n: bigint) => bigint;
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
            icon: artifact.icon ?? 'fa-brands fa-codepen',
            isVisible: artifact.isVisible ?? [['artifact', 'TDM']],
            isHidden: artifact.isHidden ?? [['artifact', id]],
            cost: artifact.cost ?? (() => 0n),
        });
    }
}

addArtifacts([{
    id: 'TDM',
    title: 'Temporal Dimensional Machine',
    fluff: 'It transports back in time, always on the same amount of time: a run. But it did not replace the temporal line.',
    // icon: 'fa-solid fa-yin-yang',
    isVisible: [],
}, {
    id: 'vortex',
    title: 'Energy vortex',
    fluff: 'It generates more power through Time.',
    // desc: '+10% :temporalEnergy:',
    isHidden: [],
    cost: (n: bigint) => (n + 1n) * (n + 2n),
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
