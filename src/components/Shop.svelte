<script lang="ts">
    import { flip } from 'svelte/animate';
    import { fade, scale, slide } from 'svelte/transition';
    import { _ } from 'svelte-i18n'
    import { emptyArray } from '../helpers/common';
    import { tooltip } from '../helpers/tooltip';
    import { artifacts } from '../stores/items/artifacts';
    import { isDisplayed } from '../stores/items';
	import {
        ownArtifacts,
        resources,
        run,
        runOver,
        startRun,
        totalOwnArtifacts,
    } from '../stores/run';
    import DigitValue from './DigitValue.svelte';
    import Icon from './Icon.svelte';
    import Text from './Text.svelte';
    import { playSound, stopAmbient, stopSound } from '../stores/sound';
    import type { Artifact } from '../stores/types';

    const currencyDecimals = 100n;
    const shopCurrency = resources.store('shopCurrency')!;

    let artifactList: Artifact<string>[] = emptyArray;
    $: continueRun = $ownArtifacts.has('TDM');
    $: titleRun = !continueRun ? $_('component.shop.disabled-continue-run') : '';
    $: artifactInitialList = $runOver ? (artifactList = Array.from(artifacts.values()).filter(isDisplayed)) : emptyArray;
    $: if ($runOver) {
        playSound('clockTicks', {id: 'runOver'});
        stopAmbient();
    }

    let message = '';
    let timer = 0;

    function updateList() {
        artifactList = artifactInitialList.filter(isDisplayed);
    }

    function nextRun() {
        if (continueRun) {
            startRun();
            stopSound('runOver');
        }
    }

    function buy(artifact: Artifact<string>) {
        const id = artifact.id;
        const nb = $ownArtifacts.get(id) ?? 0n;
        const total = $totalOwnArtifacts.get(id) ?? 0n;
        const cost = artifact.cost(nb, total) * currencyDecimals;
        const canPay = resources.pay('shopCurrency', cost);

        if (!canPay) {
            clearTimeout(timer);
            message = $_('component.shop.not-enough-TE', {
                values: { missing: Number((cost - resources.value('shopCurrency')) / currencyDecimals), },
            });
            timer = window.setTimeout(() => message = '', 5000);
            playSound('error');
            return;
        }
        ownArtifacts.add(id);
        updateList();
    }
</script>

{#if $runOver}
<aside class="shop" transition:scale>
	<header>{ $_('component.shop.end-of-run', {values: {run: $run.toString(10)}}) }</header>
    <div class="fluff">
        {$_('component.shop.fluff')}
    </div>
    {#if $shopCurrency > 0n}
        <label class="shop-currency">
            <Text text={$_('resources.temporal-energy--icon')} />:
            <output>
                <DigitValue value={$shopCurrency / currencyDecimals} />
            </output>
        </label>
    {/if}
	<div class="shop-list">
        {#each artifactList as artifact (artifact.id)}
        {@const nb = $ownArtifacts.get(artifact.id) ?? 0n}
        {@const total = $totalOwnArtifacts.get(artifact.id) ?? 0n}
        {@const cost = artifact.cost(nb, total)}
		    <div
                class="shop-item"
                class:disabled={(cost * currencyDecimals) > $shopCurrency}
                on:click={buy.bind(null, artifact)}
                out:slide={{ duration: 200 }}
                animate:flip={{duration: 400}}
            >
                <header>
                    <Text text={$_(artifact.title)} />
                </header>
                <!-- <svg class="shop-item__illustration" viewBox="0 0 100 100" aria-hidden="true">
                    <path d={artifact.icon} />
                </svg> -->
                <Icon
                    class="shop-item__illustration"
                    icon={artifact.icon}
                />
                <p class="shop-item__fluff">
                    <Text text={$_(artifact.fluff)} />
                </p>
                <button class="shop-item__cost">
                    {#if cost === 0n}
                        {$_('resources.cost-free')}
                    {:else}
                        <Text text="{cost}:shopCurrency:" />
                    {/if}
                </button>
                {#if nb}
                    <div class="shop-item__owned">×<DigitValue value={nb} /></div>
                {/if}
            </div>
        {/each}
        {#if artifactList.length === 0}
            <p class="empty-shop" transition:fade>
                {$_('component.shop.no-artifacts')}
            </p>
        {/if}
	</div>
    {#if message}
        <div class="message" transition:fade>{message}</div>
    {/if}
    <div class="next-run">
        <button class:disabled={!continueRun} use:tooltip={titleRun} on:click={nextRun}>
            {$_('component.shop.run-again')}
        </button>
    </div>
</aside>
<aside class="mask" transition:fade></aside>
{/if}

<style>
    .shop {
        position: fixed;
        top: 50%;
        left: 50%;
        width: auto;
        max-width: 95vw;
        max-height: 95vh;
        overflow: auto;
        transform: translate(-50%, -50%);
        z-index: var(--mask-z-index, 1000);

        padding: 1em;
        border: 2px solid var(--color-fg-shop);
	    border-radius: 1em;
        box-shadow: 1px 2px 10px black;
        background-color: var(--color-bg-shop);
        color: var(--color-fg-shop);
        background-image: radial-gradient(
            50% 50% at 50% 50%,
            rgba(255, 255, 255, 0.45) 0%,
            rgba(255, 255, 255, 0) 100%
        );
    }
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: calc(var(--mask-z-index, 1000) - 10);

        background-color: var(--mask-bg-color);
    }

    header {
        font-size: 1.5em;
        text-align: center;
    }

    .fluff {
        font-size: 0.9em;
        font-style: italic;
        margin: 1em 0;
    }

    .shop-list {
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-content: center;
        flex-wrap: wrap;
        margin: 0.5em 0;
        gap: 0.5em;
        min-height: var(--shop-box-size);
    }

    .shop-item {
        position: relative;
        width: var(--shop-box-size);
        height: var(--shop-box-size);
        border: 1px solid var(--color-fg-shop);
        background: var(--color-bg-artifact);
        color: var(--color-text);
        padding: 0.5em;
        box-shadow: 0 1px 3px #000000;

        display: grid;
        grid-template-rows: max-content 40px minmax(0, 1fr) max-content;
        grid-template-areas: "title" "illustration" "fluff" "cost";
        row-gap: 5px;;

        font-size: 0.8em;

        cursor: pointer;
    }
    .shop-item.disabled {
        cursor: not-allowed;
        background-color: var(--color-bg-artifact--disabled);
        opacity: 0.5;
    }

    .shop-item header {
        grid-area: title;
    }

    .shop-item :global(.shop-item__illustration) {
        grid-area: illustration;
        font-size: 40px;
        justify-self: center;
        height: 100%;
    }

    .shop-item__fluff {
        grid-area: fluff;
        font-style: italic;
        font-size: 0.9em;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
    }

    .shop-item__cost {
        grid-area: cost;
    }

    .shop-item__owned {
        position: absolute;
        top: 23%;
        right: 10%;
    }

    .empty-shop {
        position: absolute;
        top: 25%;

        font-size: 1.4em;
        opacity: 0.5;
        text-shadow: 0px 1px 10px #666666;
    }

    .next-run {
        text-align: center;
    }

    .message {
        color: var(--color-missing);
        font-size: 0.9em;
        margin: 0.5em 0;
    }

    button {
        padding: 0.5em;
    }
</style>
