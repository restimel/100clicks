<script>
	import { _ } from 'svelte-i18n';
    import Text from '../../components/Text.svelte';

	const gameTitle = '100 Clicks';
</script>

<svelte:head>
	<title>{ $_('page.howto.title') }</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1><Text text={ $_('page.howto.header', { values: { gameTitle }}) } /></h1>

	<p>
		<Text text={ $_('page.howto.explanation') } />
	</p>
	<p>
		{ $_('page.howto.explanation2') }
	</p>
	<p>
		<Text text={ $_('page.howto.explanation3') } />
	</p>
</div>
