<script lang="ts">
	import { clickAction } from '../stores/currentClick';
    import ActionBox from './ActionBox.svelte';
	import type { DisplayedAction } from '../stores/types';

    export let list: DisplayedAction[];
</script>

<div class="actions">
    {#each list as item}
    <ActionBox
        {...item}
        on:click={clickAction}
    />
    {/each}
</div>

<style>
	.actions {
		display: grid;
        grid-template-columns: repeat(auto-fill, minmax(calc(var(--action-box-width) + 2em), 1fr));
        gap: 1em;
        max-width: 100%;
	}
</style>
