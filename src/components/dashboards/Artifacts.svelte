<script lang="ts">
    import { blur, slide } from 'svelte/transition';
    import { _ } from 'svelte-i18n';
    import { emptyArray } from '../../helpers/common';
    import { tooltip } from '../../helpers/tooltip';
    import { ownArtifacts } from '../../stores/run';
    import { getArtifact } from '../../stores/items/artifacts';
    import { useArtifact, usingArtifact } from '../../stores/currentClick';
    import DigitValue from '../DigitValue.svelte';
    import Icon from '../Icon.svelte';

    import { playSound } from '../../stores/sound';
    import type { Artifact } from '../../stores/types';

    let passiveArtifact: Array<{artifact: Artifact; count: bigint}> = emptyArray;
    let activeArtifact: Array<{artifact: Artifact; count: bigint}> = emptyArray;
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
	<header>{$_('component.artifacts.header')}</header>
    {#if activeArtifact.length}
    <div>
        <span
            class="artifact-type"
            on:click={() => {
                playSound('click');
                consumableHidden = !consumableHidden}
            }
        >
            {$_('component.artifacts.consumable')}
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
                        use:tooltip={$_('component.artifacts.tooltip-details', { values: {
                            title: $_(artifact.title),
                            desc: $_(artifact.desc),
                            count: count.toString(10),
                        }})}
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
            on:click={() => {
                playSound('click');
                passiveHidden = !passiveHidden;
            }}
        >
            {$_('component.artifacts.passive')}
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
                        use:tooltip={$_('component.artifacts.tooltip-details', { values: {
                            title: $_(artifact.title),
                            desc: $_(artifact.desc),
                            count: count.toString(10),
                        }})}
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
        min-width: 1.2em;
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
