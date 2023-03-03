<script lang="ts">
    import { blur, slide } from 'svelte/transition';
    import { tooltip } from '../../helpers/tooltip';
    import { ownArtifacts } from '../../stores/run';
    import { getArtifact } from '../../stores/artifacts';
    import { useArtifact, usingArtifact } from '../../stores/currentClick';
    import DigitValue from '../DigitValue.svelte';

    import type { Artifact } from '../../stores/artifacts';
    import Icon from '../Icon.svelte';

    let passiveArtifact: Array<{artifact: Artifact; count: bigint}> = [];
    let activeArtifact: Array<{artifact: Artifact; count: bigint}> = [];
    $: {
        passiveArtifact = [];
        activeArtifact = [];
        $ownArtifacts.forEach((nb, artifactId) => {
            const artifact = getArtifact(artifactId)!;
            const item = {
                artifact: artifact,
                count: nb,
            };
            if (artifact?.usable) {
                activeArtifact.push(item);
            } else {
                passiveArtifact.push(item);
            }
        });
    }

    let consumableHidden = false;
    let passiveHidden = false;
</script>

<div class="artifact-dashboard">
	<header>Artifacts</header>
    {#if activeArtifact.length}
    <div>
        <span
            class="artifact-type"
            on:click={() => consumableHidden = !consumableHidden}
        >
            Consumable
            {#if consumableHidden}
                <span transition:blur>
                    (<DigitValue value={activeArtifact.length} />)
                </span>
            {/if}
        </span>
        {#if !consumableHidden}
            <div class="artifact-dashboard__item-list" transition:slide>
                {#each activeArtifact as {artifact, count} (artifact.id)}
                {@const isUsed = $usingArtifact.has(artifact.id)}
                    <div
                        class="artifact-dashboard__item active-artifact"
                        class:usingArtifact={isUsed}
                        use:tooltip={`${artifact.title}\n${artifact.desc}\n\nowned: ${count}`}
                        transition:blur
                        on:click={() => useArtifact(artifact.id)}
                    >
                        <Icon icon={artifact.icon} />
                        {#if count > 1}
                            <span transition:blur>
                                ×<DigitValue value={count} />
                            </span>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    {/if}
    <div>
        <span
            class="artifact-type"
            on:click={() => passiveHidden = !passiveHidden}
        >
            Passive
            {#if passiveHidden}
                <span transition:blur>
                    (<DigitValue value={passiveArtifact.length} />)
                </span>
            {/if}
        </span>
        {#if !passiveHidden}
            <div class="artifact-dashboard__item-list" transition:slide>
                {#each passiveArtifact as {artifact, count} (artifact.id)}
                    <div
                        class="artifact-dashboard__item passive-artifact"
                        use:tooltip={`${artifact.title}\n${artifact.desc}\n\nowned: ${count}`}
                        transition:blur
                    >
                        <Icon icon={artifact.icon} />
                        {#if count > 1}
                            ×<DigitValue value={count} />
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
	header {
		font-size: 1.5em;
		text-align: center;
	}

	.artifact-dashboard__item-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5em;
        align-content: space-around;
        align-items: flex-end;
        justify-content: flex-start;
	}

    .artifact-dashboard__item {
        cursor: default;
    }

    .active-artifact {
        cursor: pointer;
    }
    .active-artifact:hover {
        color: var(--color-theme-2);
    }

    .usingArtifact {
        color: var(--color-theme-1);
    }

    .artifact-type {
        cursor: pointer;
    }
</style>
