<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { tooltip } from '../../helpers/tooltip';
	import { clicks, energy, energyMax, lostClicks, run } from '../../stores/run';
	import { hadEnergy, hadLostClick } from '../../stores/achievements';
    import DigitValue from '../DigitValue.svelte';
    import Text from '../Text.svelte';
</script>

<div class="dashboard">
	<header>{$_('component.run-dashboard.header', { values: {
		run: Number($run),
	}})}</header>
	<div class="dashboard-item">
		<label for="click-dashboard">
            <Text text={$_('ressources.click--icon')} />:
        </label>
        <output id="click-dashboard">
            <DigitValue value={$clicks} /> / <DigitValue value={100} />
		</output>
	</div>
	{#if $hadEnergy}
		<div class="dashboard-item">
			<label for="energy-dashboard">
				<Text text={$_('ressources.energy--icon')} />:
			</label>
			<output id="energy-dashboard">
				<DigitValue value={$energy} /> / <DigitValue value={$energyMax} />
			</output>
		</div>
	{/if}
	{#if $hadLostClick}
		<div class="dashboard-item">
			<label for="lostClick-dashboard" use:tooltip={$_('ressources.lost-click--details')}>
				<Text text={$_('ressources.lost-click--icon')} />:
			</label>
			<output id="lostClick-dashboard">
				<DigitValue value={$lostClicks} />
			</output>
		</div>
	{/if}
</div>

<style>
	header {
		font-size: 1.5em;
		text-align: center;
		margin-bottom: 0.5em;
	}

	.dashboard-item {
		display: flex;
        flex-direction: row;
	}
</style>
