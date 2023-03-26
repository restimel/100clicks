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
        run: $run.toString(10),
    }})}</header>
    <div class="dashboard-item">
        <label for="click-dashboard">
            <Text text={$_('resources.click--icon')} />:
        </label>
        <output id="click-dashboard">
            <DigitValue value={$clicks} /> / <DigitValue value={100} />
        </output>
    </div>
    {#if $hadEnergy}
        <div class="dashboard-item">
            <label for="energy-dashboard">
                <Text text={$_('resources.energy--icon')} />:
            </label>
            <output id="energy-dashboard">
                <DigitValue value={$energy} /> / <DigitValue value={$energyMax} />
            </output>
        </div>
    {/if}
    {#if $hadLostClick}
        <div class="dashboard-item">
            <label for="lostClick-dashboard" use:tooltip={$_('resources.lost-click--details')}>
                <Text text={$_('resources.lost-click--icon')} />:
            </label>
            <output id="lostClick-dashboard">
                <DigitValue value={$lostClicks} />
            </output>
        </div>
    {/if}

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

    .wheel {
        width: 30px;
        position: absolute;
        bottom: 5px;
        right: 5px;
        transform: rotate(calc(var(--clicks) * 90deg));
        transition: transform 500ms;
    }
</style>
