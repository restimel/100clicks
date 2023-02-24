<svelte:head>
	<title>100 Clicks: about</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>About <b>100 Clicks</b></h1>

	<p>
		This is a simple game developed to test
		<a href="https://svelte.dev" target="_blank">Svelte</a>.
	</p>
	<p>
		The goal is to progress in the adventure by clicking on actions. But
		you have only 100 clicks to do so. However after 100 clicks, you
		restart at the beginning but all previous clicks ar still triggering.
		So with all clicks cumulated it is possible to progress though the
		adventure.
	</p>

	<p class="about">
		<span class="about-item">Author</span><span>Benoît Mariat</span>
		<span class="about-item">Last release</span><span>2023-02-19</span>
		<span class="about-item">Licence</span><span><a href="https://mit-license.org" target="_blank">MIT</a></span>
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
