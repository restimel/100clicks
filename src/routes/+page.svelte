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

<section>
	<Shop />
	<HeaderPanels />
	<Rooms />

</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
