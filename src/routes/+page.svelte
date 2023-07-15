<script>
    import { get } from 'svelte/store';
    // import welcome from '$lib/images/svelte-welcome.webp';
    // import welcome_fallback from '$lib/images/svelte-welcome.png';
    import Cheat from '../components/Cheat.svelte';
    import HeaderPanels from '../components/HeaderPanels.svelte';
    import Rooms from '../components/Rooms.svelte';
    import Shop from '../components/Shop.svelte';

    import { startStory, storyReady } from '../stores/story';

    if (!get(storyReady)) {
        startStory();
    }
</script>

<svelte:head>
    <title>100 Clicks</title>
    <meta name="description" content="game 100 clicks" />
</svelte:head>

{#if $storyReady}
<section class="game">
    <HeaderPanels />
    <Rooms />
    <Shop />
    <Cheat />
</section>
{:else}
<section class="menu-story">
    ...
</section>
{/if}

<style>
    .game {
        display: grid;
        justify-content: center;
        align-items: center;
        justify-items: center;
        grid-template-rows: max-content 1fr;
        grid-template-columns: 100%;
        max-height: calc(100vh - 50px - 2rem);
        flex: 1;
    }
    .game :global(> :not(aside)) {
        max-width: 100%;
        max-height: 100%;
        width: 100%;
    }
</style>
