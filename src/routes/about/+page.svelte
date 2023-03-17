<script>
	import { _ } from 'svelte-i18n';
    import Text from '../../components/Text.svelte';

	const gameTitle = '100 Clicks';
</script>

<svelte:head>
	<title>{$_('page.about.title', { values: {
		gameTitle,
	}})}</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1><Text text={$_('page.about.header', { values: { gameTitle }})} /></h1>

	<p>
		{ $_('page.about.introduction') }
		<a href="https://svelte.dev" target="_blank">(Svelte)</a>.
	</p>
	<p>
		{ $_('page.about.purpose') }
	</p>

	<p class="about">
		<span class="about-item">{ $_('page.about.author') }</span><span>Benoît Mariat</span>
		<span class="about-item">{ $_('page.about.last-release') }</span><span>2023-02-19</span>
		<span class="about-item">{ $_('page.about.license') }</span><span><a href="https://mit-license.org" target="_blank">MIT</a></span>
	</p>
</div>

<style>
	.about {
		display: grid;
		grid-template-columns: max-content max-content;
		column-gap: 1em;
	}

	.about-item {
		font-weight: bold;
	}
</style>
