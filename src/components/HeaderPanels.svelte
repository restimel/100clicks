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
    import { playSound } from '../stores/sound';
    import { story } from '../stores/story';
    import { isDisplayed } from '../stores/items';
    import { clicks } from '../stores/run';

    import { onDestroy, type SvelteComponentTyped } from 'svelte';
    import type { BasePanel, Panel, PanelType } from '../stores/types';

    type StoryResource = string;

    type PanelInfo = {
        displayed: boolean;
        panel: Panel<StoryResource>;
    }

    const panels = story.panels;

    /* list of dashboard that can be displayed
     * (it also set the display order) */
	let displayDashboards: Map<string, PanelInfo> = new Map();

    buildDisplayDashboards();
    function buildDisplayDashboards(): Map<string, PanelInfo> {
        let hasChanged = false;

        const dspPanels = new Map(panels.map((panel) => {
            const displayed = isDisplayed(panel);
            const origPanel = displayDashboards.get(panel.id);

            if (origPanel?.displayed !== displayed) {
                hasChanged = true;
            }

            return [panel.id, {
                displayed: displayed,
                panel: panel,
            }];
        }));


        if (hasChanged || dspPanels.size !== displayDashboards.size) {
            displayDashboards = dspPanels;
        }

        return displayDashboards;
    }
    const unsubscribeRun = clicks.subscribe(buildDisplayDashboards);

    /* list of dashboards that are collapsed */
    let hideDashboards: Set<string> = new Set();
    $: collapsedDashboards = Array.from(hideDashboards).filter((id) => {
        return hideDashboards.has(id) && displayDashboards.get(id)?.displayed;
    });

    $: expandedDashboard = Array.from(displayDashboards.keys()).filter((dashboard) => {
        return displayDashboards.get(dashboard)?.displayed && !hideDashboards.has(dashboard);
    });

    type PanelComponent = typeof SvelteComponentTyped<{panel: BasePanel<StoryResource>}>;

    const dashboards: Map<PanelType, PanelComponent> = new Map([
        ['dashboard', Run as PanelComponent],
        ['artifacts', Artifacts as PanelComponent],
        ['equipments', Equipments as PanelComponent],
        ['logs', Logs as PanelComponent],
    ]);

    function reduceDashboard(id: string) {
        hideDashboards.add(id);
        hideDashboards = hideDashboards;
        playSound('click');
    }

    function expandDashboard(evt: CustomEvent<string>) {
        const name = evt.detail;
        hideDashboards.delete(name);
        hideDashboards = hideDashboards;
        playSound('click');
    }

    onDestroy(() => {
        unsubscribeRun();
    });
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
        {@const panel = displayDashboards.get(dashboard)}
        <div class="dashboard-item"
            in:receive={{key: dashboard}}
            out:send={{key: dashboard}}
            animate:flip
        >
            {#if panel}
            <svelte:component this={dashboards.get(panel.panel.panelType)}
                panel={panel.panel}
            />
            <Icon
                icon="fa-solid fa-circle-minus"
                class="reduce"
                on:click={() => reduceDashboard(dashboard)}
            />
            {/if}
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
    .header-panels :global(.reduce):hover {
        color: var(--color-theme-2);
    }
</style>
