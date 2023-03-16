<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { flip } from 'svelte/animate';
    import { _ } from 'svelte-i18n';
    import { emptyArray } from '../../helpers/common';
    import { receive, send } from '../../helpers/transitionMove';
    import Icon from '../Icon.svelte';
    import Text from '../Text.svelte';
    import type { DashboardName } from '../../stores/types';

    const dispatch = createEventDispatcher<{expand: DashboardName}>();


    export let list: DashboardName[] = emptyArray;

    $: titles = {
        run: $_('component.run-dashboard.title'),
        logs: $_('component.logs.header'),
        artifacts: $_('component.artifacts.header'),
        equipments: $_('component.equipments.header'),
    } as Record<DashboardName, string>;

    function expand(name: DashboardName) {
        dispatch('expand', name);
    }
</script>

<div class="dashboard-collapsed">
    {#each list as name (name)}
    <div
        class="dashboard-collapsed__item"
        on:click={() => expand(name)}
        in:receive={{key: name}}
        out:send={{key: name}}
        animate:flip
    >
        <Text text={titles[name]} />
        <Icon icon="fa-solid fa-circle-plus" class="item__icon" />
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
    .dashboard-collapsed__item :global(.item__icon) {
        opacity: 0;
        transition: opacity 500ms;
    }
    .dashboard-collapsed__item:hover :global(.item__icon) {
        opacity: 1;
    }
</style>
