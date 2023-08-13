<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { logs } from '../../stores/currentClick';
    import { getAction } from '../../stores/items/actions';
    import Text from '../Text.svelte';

    import type { Log, LogsPanel } from '../../stores/types';
    import { slide } from 'svelte/transition';
    import { getEquipment } from '../../stores/items/equipments';

    type StoryResource = string;

    export let panel: LogsPanel<StoryResource>;

    function sentence([type, value]: Log): string {
        switch (type) {
            case 'open': {
                const action = getAction(value);
                const name = $_(action?.title || value);
                return $_('component.logs.action-complete', { values: {
                    name,
                }});
            }
            case 'equipment': {
                const equipment = getEquipment(value);
                const name = $_(equipment?.title || value);
                return $_('component.logs.equipment-found', { values: {
                    name,
                }});
            }
            case 'resource': {
                const [resource, val] = value.split('|');
                return $_('component.logs.resource-increase', { values: {
                    resource,
                    value: +val > 0 ? `+${val}` : val,
                }});
            }
            default:
                return `:warning: type "${type}"" not managed`;
        }
    }
</script>

<div class="log-dashboard">
    <header>
        {#if panel.header}
            <Text text={$_(panel.header)} />
        {:else}
            {$_('component.logs.header')}
        {/if}
    </header>
    {#each $logs as log (log)}
        <div class="log-dashboard__item" transition:slide>
            <Text text={($_) && sentence(log)} />
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
