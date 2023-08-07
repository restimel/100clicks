<script lang="ts">
    import { blur, slide } from 'svelte/transition';
    import { _ } from 'svelte-i18n';
    import { tooltip } from '../../helpers/tooltip';
    import { ownEquipments } from '../../stores/run';
    import { getEquipment } from '../../stores/items/equipments';
    import Icon from '../Icon.svelte';
    import Text from '../Text.svelte';

    import type { Equipment, EquipmentsPanel } from '../../stores/types';

    type StoryResource = string;

    export let panel: EquipmentsPanel<StoryResource>;

    $: equipmentList = Array.from($ownEquipments, (name: string) => {
        return getEquipment(name);
    }).filter((map) => !!map) as Equipment<StoryResource>[];
</script>

<div class="equipment-dashboard">
    <header>
        {#if panel.header}
            <Text text={$_(panel.header)} />
        {:else}
            {$_('component.equipments.header')}
        {/if}
    </header>
    <div class="equipment-dashboard__item-list" transition:slide>
        {#each equipmentList as equipment (equipment.id)}
            <div
                class="equipment-dashboard__item"
                use:tooltip={$_('component.equipments.tooltip-details', { values: {
                    title: $_(equipment.title),
                    fluff: $_(equipment.fluff),
                }})}
                transition:blur
            >
                <Icon icon={equipment.icon} />
            </div>
        {/each}
    </div>
</div>

<style>
	header {
		font-size: 1.5em;
		text-align: center;
	}

	.equipment-dashboard__item-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5em;
        align-content: space-around;
        align-items: flex-end;
        justify-content: flex-start;
	}

    .equipment-dashboard__item {
        cursor: default;
        min-width: 1.2em;
    }
</style>
