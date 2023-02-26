<script lang="ts">
    import Run from './dashboards/RunDashboard.svelte';
    import Logs from './dashboards/Logs.svelte';
    import Collapsed from './dashboards/Collapsed.svelte';

    import type { DashboardName } from '../stores/types';
    import type { SvelteComponent } from 'svelte';

    /* list of dashboard that can be displayed */
	let displayDashboards: Map<DashboardName, boolean> = new Map([
        ['run', true],
        ['logs', true],
    ]);

    /* list of dashboards that are collapsed */
    let hideDashboards: Map<DashboardName, boolean> = new Map();
    $: collapsedDashboards = Array.from(hideDashboards.keys()).filter((name) => {
        return hideDashboards.get(name) && displayDashboards.get(name);
    });

    const dashboards: Map<DashboardName, typeof SvelteComponent> = new Map([
        ['run', Run],
        ['logs', Logs],
    ]);

    function reduceDashboard(name: DashboardName) {
        hideDashboards.set(name, true);
        hideDashboards = hideDashboards;
    }

    function expandDashboard(evt: CustomEvent<DashboardName>) {
        const name = evt.detail;
        hideDashboards.delete(name);
        hideDashboards = hideDashboards;
    }
</script>

<div class="header-panels">
    <div class="dashboard-item">
        <Collapsed list={collapsedDashboards} on:expand={expandDashboard} />
    </div>
    {#each Array.from(displayDashboards) as [dashboard, displayed] (dashboard)}
    {#if displayed && !hideDashboards.get(dashboard)}
        <div class="dashboard-item">
            <svelte:component this={dashboards.get(dashboard)} />
            <div class="reduce fa-solid fa-circle-minus" on:click={() => reduceDashboard(dashboard)}></div>
        </div>
    {/if}
    {/each}
</div>

<style>
    .header-panels {
        display: flex;
        flex-direction: rows;
    }

    .dashboard-item {
        position: relative;
        width: 300px;
		height: 100px;
		padding: 1em;
		border: 2px solid var(--color-fg-dashboard);
		border-top-right-radius: 1em;
		border-top-left-radius: 1em;
		color: var(--color-fg-dashboard);
		background-color: var(--color-bg-dashboard);
		box-shadow: inset 1px 2px 10px var(--color-fg-dashboard);
    }

    .reduce {
        position: absolute;
        top: 1em;
        right: 1em;
        cursor: pointer;
    }
    .reduce:hover {
        color: var(--color-theme-2);
    }
</style>
