<script lang="ts">
    import { logs } from '../../stores/currentClick';
    import { getAction } from '../../stores/actions';
    import Text from '../Text.svelte';

    import type { Log } from '../../stores/types';
    import { slide } from 'svelte/transition';

    function sentence([type, value]: Log): string {
        switch (type) {
            case 'open':
                const action = getAction(value);
                const name = action?.title || value;
                return `"${name}" has been completed`;
        }
    }
</script>

<div class="log-dashboard">
	<header>Logs</header>
    {#each $logs as log (log)}
	<div class="log-dashboard__item" transition:slide>
        <Text text={sentence(log)} />
	</div>
    {/each}
</div>

<style>
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
