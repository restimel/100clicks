<script lang="ts">
    import { flip } from 'svelte/animate';
    import { scale } from 'svelte/transition';
    import { receive, send } from '../helpers/transitionMove';
    import Run from './dashboards/RunDashboard.svelte';
    import Logs from './dashboards/Logs.svelte';
    import Artifacts from './dashboards/Artifacts.svelte';
    import Collapsed from './dashboards/Collapsed.svelte';
    import Icon from './Icon.svelte';

    import type { SvelteComponent } from 'svelte';
    import type { DashboardName } from '../stores/types';

    /* list of dashboard that can be displayed */
	let displayDashboards: Map<DashboardName, boolean> = new Map([
        ['run', true],
        ['artifacts', true],
        ['logs', true],
    ]);

    /* list of dashboards that are collapsed */
    let hideDashboards: Map<DashboardName, boolean> = new Map();
    $: collapsedDashboards = Array.from(hideDashboards.keys()).filter((name) => {
        return hideDashboards.get(name) && displayDashboards.get(name);
    });

    $: expandedDashboard = Array.from(displayDashboards.keys()).filter((dashboard) => {
        return displayDashboards.get(dashboard) && !hideDashboards.get(dashboard);
    });

    const dashboards: Map<DashboardName, typeof SvelteComponent> = new Map([
        ['run', Run],
        ['artifacts', Artifacts],
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
    {#if collapsedDashboards.length}
        <div class="dashboard-item"
            transition:scale
        >
            <Collapsed list={collapsedDashboards} on:expand={expandDashboard} />
        </div>
    {/if}
    {#each expandedDashboard as dashboard (dashboard)}
        <div class="dashboard-item"
            in:receive={{key: dashboard}}
            out:send={{key: dashboard}}
            animate:flip
        >
            <svelte:component this={dashboards.get(dashboard)} />
            <Icon
                icon="fa-solid fa-circle-minus"
                class="reduce"
                on:click={() => reduceDashboard(dashboard)}
            />
        </div>
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

    .header-panels :global(.reduce) {
        position: absolute;
        top: 1em;
        right: 1em;
        cursor: pointer;
    }
    .reduce:hover {
        color: var(--color-theme-2);
    }
</style>
