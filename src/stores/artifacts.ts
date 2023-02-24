import type {
    ConditionalItem,
} from './types';

export type Artifact = ConditionalItem & {
    type: 'artifact';
    title: string;
    fluff: string;
    cost: (n: bigint) => bigint;
};
type ArtifactDefinition = Partial<Artifact>;

const artifactList: Map<string, Artifact> = new Map();

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
    isVisible: [],
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
