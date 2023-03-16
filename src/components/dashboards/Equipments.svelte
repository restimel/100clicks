<script lang="ts">
    import { blur, slide } from 'svelte/transition';
    import { _ } from 'svelte-i18n';
    import { tooltip } from '../../helpers/tooltip';
    import { ownEquipments } from '../../stores/run';
    import { getEquipment } from '../../stores/equipments';
    import Icon from '../Icon.svelte';

    import type { Equipment } from '../../stores/equipments';

    $: equipmentList = Array.from($ownEquipments, (name: string) => {
        return getEquipment(name);
    }).filter((map) => !!map) as Equipment[];
</script>

<div class="equipment-dashboard">
	<header>{$_('component.equipments.header')}</header>
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
