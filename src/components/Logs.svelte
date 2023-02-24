<script lang="ts">
    import { logs } from '../stores/currentClick';
    import { getAction } from '../stores/actions';
    import Text from './Text.svelte';

    import type { Log } from '../stores/types';

    function sentence([type, value]: Log): string {
        switch (type) {
            case 'open':
                const action = getAction(value);
                const name = action?.title || value;
                return `"${name}" has been done`;
        }
    }
</script>

<div class="log-dashboard">
	<header>Logs</header>
    {#each $logs as log}
	<div class="log-dashboard__item">
        <Text text={sentence(log)} />
	</div>
    {/each}
</div>

<style>
	.log-dashboard {
		width: 300px;
		height: 100px;
		padding: 1em;
		margin: 1em;
		border: 2px solid var(--color-fg-dashboard);
		border-top-right-radius: 1em;
		border-top-left-radius: 1em;
		color: var(--color-fg-dashboard);
		background-color: var(--color-bg-dashboard);
		box-shadow: inset 1px 2px 10px var(--color-fg-dashboard);
	}

	header {
		font-size: 1.5em;
		text-align: center;
		margin-bottom: 0.5em;
	}

	.log-dashboard__item {
		display: flex;
        flex-direction: row;
	}
</style>
