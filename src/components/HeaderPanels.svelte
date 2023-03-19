<script lang="ts">
    import { flip } from 'svelte/animate';
    import { scale } from 'svelte/transition';
    import { receive, send } from '../helpers/transitionMove';
    import Run from './dashboards/RunDashboard.svelte';
    import Logs from './dashboards/Logs.svelte';
    import Artifacts from './dashboards/Artifacts.svelte';
    import Equipments from './dashboards/Equipments.svelte';
    import Collapsed from './dashboards/Collapsed.svelte';
    import Icon from './Icon.svelte';

    import type { SvelteComponent } from 'svelte';
    import type { DashboardName } from '../stores/types';

    /* list of dashboard that can be displayed
     * (it also set the display order) */
	let displayDashboards: Map<DashboardName, boolean> = new Map([
        ['run', true],
        ['artifacts', true],
        ['equipments', true],
        ['logs', true],
    ]);

    /* list of dashboards that are collapsed */
    let hideDashboards: Set<DashboardName> = new Set();
    $: collapsedDashboards = Array.from(hideDashboards).filter((name) => {
        return hideDashboards.has(name) && displayDashboards.get(name);
    });

    $: expandedDashboard = Array.from(displayDashboards.keys()).filter((dashboard) => {
        return displayDashboards.get(dashboard) && !hideDashboards.has(dashboard);
    });

    const dashboards: Map<DashboardName, typeof SvelteComponent> = new Map([
        ['run', Run],
        ['artifacts', Artifacts],
        ['equipments', Equipments],
        ['logs', Logs],
    ]);

    function reduceDashboard(name: DashboardName) {
        hideDashboards.add(name);
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
        flex-direction: row;
        justify-content: space-around;
    }

    .dashboard-item {
        position: relative;
        width: 300px;
		height: 100px;
		padding: 1em;
		border: 2px solid var(--color-border-dashboard);
		border-top-right-radius: 1em;
		border-top-left-radius: 1em;
		color: var(--color-fg-dashboard);
		background-color: var(--color-bg-dashboard);
		box-shadow: inset 1px 2px 10px var(--color-border-dashboard);
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
