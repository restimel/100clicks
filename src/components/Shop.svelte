<script lang="ts">
    import { artifacts, type Artifact } from '../stores/artifacts';
    import { isDisplayed } from '../stores/items';
	import { ownArtifacts, run, runOver, startRun, temporalEnergy } from '../stores/run';
    import DigitValue from './DigitValue.svelte';
    import Text from './Text.svelte';

    const temporalDecimals = 100n;

    let artifactList: Artifact[] = [];
    $: continueRun = $ownArtifacts.has('TDM');
    $: titleRun = !continueRun ? 'You should own a temporal machine to run again' : '';
    $: artifactInitialList = $runOver ? (artifactList = Array.from(artifacts.values()).filter(isDisplayed)) : [];

    let message = '';
    let timer = 0;

    function updateList() {
        console.log('updateList', artifactInitialList);
        artifactList = artifactInitialList.filter(isDisplayed);
        console.log('updateList', artifactList);
    }

    function nextRun() {
        startRun();
    }

    function buy(artifact: Artifact) {
        const id = artifact.id;
        const nb = $ownArtifacts.get(id) ?? 0n;
        const cost = artifact.cost(nb) * temporalDecimals;
        if ($temporalEnergy < cost) {
            clearTimeout(timer);
            message = `You don't have enough temporal energy. You should get ${(cost - $temporalEnergy) / temporalDecimals} more.`;
            timer = window.setTimeout(() => message = '', 5000);
        }
        $temporalEnergy -= cost;
        ownArtifacts.add(id);
        updateList();
    }
</script>

{#if $runOver}
<div class="shop">
	<header>End of run #{$run}</header>
    <div class="fluff">
        You are tired. You have to stop there! But you discover some odd artifacts:
    </div>
    {#if $temporalEnergy > 0n}
        <label class="shop-currency">
            <Text text="Temporal energy :temporalEnergy:" />:
            <output>
                <DigitValue value={$temporalEnergy} />
            </output>
        </label>
    {/if}
	<div class="shop-list">
        {#each artifactList as artifact}
        {@const nb = $ownArtifacts.get(artifact.id) ?? 0n}
        {@const cost = artifact.cost(nb)}
		    <div class="shop-item" on:click={buy.bind(null, artifact)}>
                <header>
                    <Text text={artifact.title} />
                </header>
                <p class="shop-item__fluff">
                    <Text text={artifact.fluff} />
                </p>
                <button class="shop-item__cost">
                    {#if cost === 0n}
                        Free
                    {:else}
                        <Text text="{cost}:temporalEnergy:" />
                    {/if}
                </button>
            </div>
        {/each}
        {#if artifactList.length === 0}
            <p class="empty-shop">
                There are no more artifacts. Come back later.
            </p>
        {/if}
	</div>
    {#if message}
        <div class="message">{message}</div>
    {/if}
    <div class="next-run">
        <button disabled={!continueRun} title={titleRun} on:click={nextRun}>
            Wake up for next run
        </button>
    </div>
</div>
<div class="mask"></div>
{/if}

<style>
	.shop {
        position: fixed;
        top: 50%;
        left: 50%;
        max-width: 95vw;
        max-height: 95vh;
        transform: translate(-50%, -50%);
        z-index: 1000;

        padding: 1em;
		border: 2px solid var(--color-theme-2);
		box-shadow: 1px 2px 10px black;
		background-color: var(--color-bg-1);
		border-radius: 1em;
	}
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 990;

        background-color: #CCCCCCCC;
    }

	header {
		font-size: 1.5em;
		text-align: center;
		margin-bottom: 0.5em;
	}

    .fluff {
        font-size: 0.9em;
        font-style: italic;
    }

	.shop-list {
		display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-content: center;
        flex-wrap: wrap;
        margin: 0.5em 0;
	}

    .shop-item {
        width: 200px;
        height: 200px;
        border: 1px solid var(--color-theme-2);
        background: var(--color-bg-0);
        padding: 0.5em;
        box-shadow: 0 1px 3px #000000;

        display: grid;
        grid-template-rows: max-content 1fr max-content;
        grid-template-areas: "title" "fluff" "cost";

        font-size: 0.8em;
    }

    .shop-item header {
        grid-area: title;
    }

    .shop-item__fluff {
        grid-area: fluff;
        font-style: italic;
        font-size: 0.9em;
    }

    .shop-item__cost {
        grid-area: cost;
    }

    .empty-shop {
        font-size: 1.4em;
        opacity: 0.5;
        text-shadow: 0px 1px 10px #666666;
    }

    .next-run {
        text-align: center;
    }
</style>
