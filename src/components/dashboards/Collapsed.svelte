<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { DashboardName } from '../../stores/types';
    import Text from '../Text.svelte';

    const dispatch = createEventDispatcher<{expand: DashboardName}>();

    export let list: DashboardName[] = [];

    const titles: Record<DashboardName, string> = {
        run: 'Run',
        logs: 'Logs',
    };

    function expand(name: DashboardName) {
        dispatch('expand', name);
    }
</script>

<div class="dashboard-collapsed">
    {#each list as name (name)}
    <div class="dashboard-collapsed__item" on:click={() => expand(name)}>
        <Text text={titles[name]} />
        <i class="item__icon fa-solid fa-circle-plus"></i>
    </div>
    {/each}
</div>

<style>
	header {
		font-size: 1.5em;
		text-align: center;
		margin-bottom: 0.5em;
	}

	.dashboard-collapsed {
		display: flex;
        flex-direction: column;
	}

	.dashboard-collapsed__item {
		display: flex;
        flex-direction: row;
        justify-content: space-between;

        cursor: pointer;
	}
    .dashboard-collapsed__item:hover {
        color: var(--color-theme-2);
        border-bottom: 1px solid var(--color-fg-dashboard);
    }
    .dashboard-collapsed__item .item__icon {
        opacity: 0;
        transition: opacity 500ms;
    }
    .dashboard-collapsed__item:hover .item__icon {
        opacity: 1;
    }
</style>
