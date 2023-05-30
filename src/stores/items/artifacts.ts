
import type {
    Artifact,
    ArtifactDefinition,
} from '../types';

const artifactList: Map<string, Artifact> = new Map();

function free() {
    return 0n;
}

// const defaultIcon = 'M50 100a50 50 0 1 1 0 -100a50 50 0 1 1 0 100zM50 19a6.5 6.5 0 0 0 0 14a6.5 6.5 0 0 0 0 -14zM50 50a23.5 23.5 0 0 0 0 47.8a47.8 47.8 0 0 0 0 -95.6a23.5 23.5 0 0 1 0 47.8zM50 66.5a6.5 6.5 0 0 0 0 14a6.5 6.5 0 0 0 0 -14z';
export function addArtifacts(artifacts: ArtifactDefinition[]) {
    let idx = 0;
    for (const artifact of artifacts) {
        const id = artifact.id ?? `artifact-${idx}`;
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
            cost: artifact.cost ?? free,
        });
    }
}

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
