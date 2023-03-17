<script>
	// import welcome from '$lib/images/svelte-welcome.webp';
	// import welcome_fallback from '$lib/images/svelte-welcome.png';
    import Shop from '../components/Shop.svelte';
    import HeaderPanels from '../components/HeaderPanels.svelte';
    import Rooms from '../components/Rooms.svelte';
</script>

<svelte:head>
	<title>100 Cliks</title>
	<meta name="description" content="game 100 clicks" />
</svelte:head>

<section class="game">
	<HeaderPanels />
	<Rooms />
	<Shop />
</section>

<style>
	.game {
		display: grid;
		justify-content: center;
		align-items: center;
		justify-items: center;
		grid-template-rows: max-content 1fr;
		grid-template-columns: 100%;
		max-height: calc(100vh - 50px - 2rem);
	}
	.game :global(> *) {
		max-width: 100%;
		max-height: 100%;
		width: 100%;
		overflow: auto;
	}
</style>
