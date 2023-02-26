<script lang="ts">
	import { clicks, energy, energyMax, lostClicks, run } from '../../stores/run';
	import { hadEnergy, hadLostClick } from '../../stores/achievements';
    import DigitValue from '../DigitValue.svelte';
    import Text from '../Text.svelte';
</script>

<div class="dashboard">
	<header>run #{$run}</header>
	<div class="dashboard-item">
		<label for="click-dashboard">
            <Text text="Click :click:" />:
        </label>
        <output id="click-dashboard">
            <DigitValue value={$clicks} /> / <DigitValue value={100} />
		</output>
	</div>
	{#if $hadEnergy}
		<div class="dashboard-item">
			<label for="energy-dashboard">
				<Text text="Energy :energy:" />:
			</label>
			<output id="energy-dashboard">
				<DigitValue value={$energy} /> / <DigitValue value={$energyMax} />
			</output>
		</div>
	{/if}
	{#if $hadLostClick}
		<div class="dashboard-item">
			<label for="lostClick-dashboard" title="Lost clicks are clicks in previous run which are not able to repeat their actions">
				<Text text="Lost clicks :lostClick:" />:
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
