<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { tooltip } from '../../helpers/tooltip';
    import { resources, run } from '../../stores/run';
    import achievements from '../../stores/achievements';
    import DigitValue from '../DigitValue.svelte';
    import Text from '../Text.svelte';
    import { get, writable, type Unsubscriber, type Writable } from 'svelte/store';
    import { onDestroy } from 'svelte';
    import type { DashboardPanel } from '../../stores/types';

    type StoryResource = string;

    export let panel: DashboardPanel<StoryResource>;

    $: dashboard = panel.content;

    type DBItem = {
        id: string;
        condition: boolean;
        detail: string;
        label: string;
        value: bigint;
        valueMax: bigint | undefined;
        decimals: bigint;
    };

    let dashboardList: DBItem[] = [];
    const subscribeList: Unsubscriber[] = [];

    $: clicks = resources.store('clicks');

    $: dashboardList = dashboard.map((item, idx) => {
        const {
            condition,
            detail,
            label,
            value,
            valueMax,
            decimals,
        } = item;

        function getResource(name: bigint | string | undefined): Writable<bigint> | undefined {
            if (typeof name === 'undefined') {
                return writable(0n);
            }
            if (typeof name === 'bigint') {
                return writable(name);
            }
            return resources.store(name);
        }

        const id = `dashboard-${typeof value === 'string' ? value : '-'}-${idx}`;

        const storeValue = getResource(value)!;
        const storeValueMax = getResource(valueMax);

        function conditionValue() {
            return typeof condition === 'boolean' ? condition : achievements.value(condition);
        }

        const dbItem: DBItem = {
            id,
            condition: conditionValue(),
            detail: detail ?? '',
            label: label,
            value: get(storeValue),
            valueMax: storeValueMax && get(storeValueMax),
            decimals: decimals ?? 1n,
        };

        subscribeList.push(storeValue.subscribe((value) => {
            dbItem.value = value;
            dbItem.condition = conditionValue();
            if (dashboardList) {
                dashboardList = dashboardList;
            }
        }));
        if (storeValueMax) {
            subscribeList.push(storeValueMax.subscribe((value) => {
                dbItem.valueMax = value;
                if (dashboardList) {
                    dashboardList = dashboardList;
                }
            }));
        }

        return dbItem;
    });

    $: dashboardListFiltered = dashboardList.filter((item) => {
        return item.condition;
    });

    onDestroy(() => {
        subscribeList.forEach((unsubscribe) => unsubscribe());
    });
</script>

<div class="dashboard">
    <header>
        {#if panel.header}
            <Text text={$_(panel.header)} />
        {:else}
            {$_('component.run-dashboard.header', { values: {
                run: $run.toString(10),
            }})}
        {/if}
    </header>
    <section class="dashboard-list" style={`--nb-columns: ${Math.ceil(dashboardListFiltered.length / 3)}`}>
        {#each dashboardListFiltered as item}
            <div class="dashboard-item">
                <label for={item.id} use:tooltip={$_(item.detail)}>
                    <Text text={$_(item.label)} />:
                </label>
                <output id={item.id}>
                    <DigitValue value={item.value / item.decimals} />
                    {#if item.valueMax}
                        / <DigitValue value={item.valueMax / item.decimals} />
                    {/if}
                </output>
            </div>
        {/each}
    </section>

    {#if !panel.header}
    <svg viewBox="10 10 80 80" xmlns="http://www.w3.org/2000/svg" class="wheel" style={`--clicks:${$clicks}`}>
        <circle cx="50" cy="50" r="30" stroke="#3b170b" stroke-width="3" fill="transparent" />
        <line x1="50" y1="20" x2="50" y2="80" stroke="#3b170b" stroke-width="6" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="#3b170b" stroke-width="6" />
        <line x1="25" y1="25" x2="75" y2="75" stroke="#4a2e0a" stroke-width="4" />
        <line x1="25" y1="75" x2="75" y2="25" stroke="#4a2e0a" stroke-width="4" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="#4a2e0a" stroke-width="1" />
        <line x1="50" y1="10" x2="50" y2="90" stroke="#4a2e0a" stroke-width="1" />
        <circle cx="50" cy="50" r="3" stroke="none" fill="#654321" />
        <circle cx="50" cy="50" r="1" stroke="none" fill="white" />
        <circle cx="50" cy="50" r="30" stroke="#a88e5a" stroke-width="0.5" fill="transparent" />
    </svg>
    {/if}
</div>

<style>
    header {
        font-size: 1.5em;
        text-align: center;
        margin-bottom: 0.5em;
    }

    .dashboard-list {
        column-count: var(--nb-columns);
        min-width: calc(var(--nb-columns) * 150px)
    }

    .dashboard-item {
        display: flex;
        flex-direction: row;
    }

    .dashboard-item > label,
    .dashboard-item > output {
        white-space: nowrap;
    }

    .wheel {
        width: 30px;
        position: absolute;
        bottom: 5px;
        right: 5px;
        transform: rotate(calc(var(--clicks) * 90deg));
        transition: transform 500ms;
    }
</style>
