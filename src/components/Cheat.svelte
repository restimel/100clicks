<script lang="ts">
    import { browser, dev } from '$app/environment';
    import { onDestroy, onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { fade, scale } from 'svelte/transition';
	import {
        clicks, ownArtifacts, ownEquipments, resources,
    } from '../stores/run';
    import { applyAction } from '../stores/currentClick';
    import { artifacts } from '../stores/items/artifacts';
    import { equipments } from '../stores/items/equipments';

    let cheatOpen = false;
    let artifactId = '';
    let equipmentId = '';
    let resourceName = '';
    let resourceValue = 0;

    function endRun() {
        let protection = 110;
        while (get(clicks) < 100n && --protection) {
            applyAction('dynamo');
        }
        if (!protection) {
            console.warn('Estas problema por fari la dinamo agon.');
        }
    }

    function applyArtifact() {
        if (artifacts.has(artifactId)) {
            ownArtifacts.add(artifactId);
        }
    }
    function applyEquipment() {
        if (equipments.has(equipmentId)) {
            ownEquipments.add(equipmentId);
        }
    }
    function applyresource() {
        resources.add(resourceName, BigInt(resourceValue));
    }

    function listener(event: MouseEvent) {
        const ctrl = event.ctrlKey;
        if (ctrl) {
            cheatOpen = true;
            event.preventDefault();
        }
    }

    onMount(() => {
        if (browser && dev) {
            const el = document.querySelector('.github');
            el?.addEventListener('contextmenu', listener as any);
        }
    });
    onDestroy(() => {
        if (browser) {
            /* remove listener */
            const el = document.querySelector('.github');
            el?.removeEventListener('contextmenu', listener as any);
        }
    });
</script>


{#if cheatOpen}
<aside class="cheat" transition:scale>
	<header>Fraŭdi</header>
    <label><button on:click={endRun}>Iri al la fino de la vico</button></label>
    <label>
        Artefakto
        <input bind:value={artifactId} />
        <button on:click={applyArtifact}>Apliki</button>
    </label>
    <label>
        Ekipaĵo
        <input bind:value={equipmentId} />
        <button on:click={applyEquipment}>Apliki</button>
    </label>
     <label>
        Rimedo
        <input bind:value={resourceName} />
        <input type="number" bind:value={resourceValue} />
        <button on:click={applyresource}>Apliki</button>
    </label>

    <label>
        <button class="close" on:click={() => cheatOpen = false}>Fermi</button>
    </label>
</aside>
<aside class="mask" transition:fade></aside>
{/if}

<style>
    .cheat {
        position: fixed;
        top: 50%;
        left: 50%;
        width: auto;
        max-width: 95vw;
        max-height: 95vh;
        overflow: auto;
        transform: translate(-50%, -50%);
        z-index: calc(var(--mask-z-index, 1000) + 100);

        padding: 1em;
        border: 2px solid var(--color-fg-shop);
	    border-radius: 1em;
        box-shadow: 1px 2px 10px black;
        background-color: var(--color-bg-shop);
        color: var(--color-fg-shop);
    }
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: calc(var(--mask-z-index, 1000) + 90);

        background-color: var(--mask-bg-color);
    }

    header {
        font-size: 1.5em;
        text-align: center;
    }

    label {
        display: block;
        text-align: center;
    }

    button {
        padding: 0.5em;
        cursor: pointer;
    }

    .close {
        margin: auto;
        margin-top: 1em;
    }
</style>
