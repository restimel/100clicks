<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { _ } from 'svelte-i18n';
    import { tooltip } from '../helpers/tooltip';
    import { musicVolume, mute, soundVolume } from '../stores/settings';
    import Icon from './Icon.svelte';
    import Languages from './Languages.svelte';
    import { playSound } from '../stores/sound';

    let settingsOpen = false;

    function toggleList() {
        settingsOpen = !settingsOpen;
    }

    function getIconVolume(value: number): string {
        if (value <= 0) {
            return 'fa-solid fa-volume-xmark';
        }
        if (value <= 20) {
            return 'fa-solid fa-volume-off';
        }
        if (value <= 70) {
            return 'fa-solid fa-volume-low';
        }

        return 'fa-solid fa-volume-high';
    }

    function getIconMute(value: boolean): string {
        if (value) {
            return 'fa-solid fa-volume-xmark';
        }

        return 'fa-solid fa-volume-high';
    }
</script>

<div
    class="{$$props.class} settings"
    use:tooltip={$_('component.settings.tooltip')}
    on:click={toggleList}
>
    <Icon icon="fa-solid fa-gears" />
</div>

{#if settingsOpen}
    <aside class="settings-dialog" transition:scale>
        <header>
            {$_('component.settings.header')}
        </header>
        <div class="settings-items">

            <span>
                {$_('component.settings.language')}
            </span>
            <Languages class="settings-item" display="flag" />

            <span>
                {$_('component.settings.mute')}
            </span>
            <span>
                <Icon
                    class="test-sound"
                    icon={getIconMute($mute)}
                    title={$mute ? $_('component.settings.muted') : $_('component.settings.unmuted')}
                    on:click={() => {
                        $mute = !$mute;
                    }}
                />
            </span>

            <span>
                {$_('component.settings.sound')}
            </span>
            <span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    bind:value={$soundVolume}
                    use:tooltip={`${$soundVolume}%`}
                />
                <Icon
                    class="test-sound"
                    icon={getIconVolume($soundVolume)}
                    title={$_('component.settings.test')}
                    on:click={() => {
                        playSound('stuck');
                    }}
                />
            </span>

            <span>
                {$_('component.settings.music')}
            </span>
            <span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    bind:value={$musicVolume}
                    use:tooltip={`${$musicVolume}%`}
                />
                <Icon
                    class="no-test-sound"
                    icon={getIconVolume($musicVolume)}
                    title={$_('component.settings.test')}
                />
            </span>

        </div>

        <label>
            <button class="close" on:click={() => settingsOpen = false}>
                {$_('components.dialog.close')}
            </button>
        </label>
    </aside>
    <aside class="mask" transition:fade></aside>
{/if}

<style>
    .settings-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        width: auto;
        max-width: 95vw;
        max-height: 95vh;
        overflow: auto;
        transform: translate(-50%, -50%);
        z-index: var(--mask-z-index, 1000);

        padding: 1em;
        border: 2px solid var(--color-border-settings);
        border-radius: 1em;
        box-shadow: 1px 2px 10px black;
        background-color: var(--color-bg-settings);
        color: var(--color-fg-settings);
    }
    .mask {
        position: fixed;
        top: 48px;
        left: 0;
        width: 100vw;
        height: calc(100vh - 48px);
        z-index: calc(var(--mask-z-index, 1000) - 10);

        background-color: var(--mask-bg-color);
    }

    header {
        font-size: 1.5em;
        text-align: center;
        color: var(--color-header-settings);
    }

    label {
        display: block;
        text-align: center;
        white-space: nowrap;
    }

    .settings-items {
        display: grid;
        grid-template-columns: max-content max-content;
        gap: 1em;

        margin-top: 1em;
        margin-bottom: 1em;
    }
    :global(.settings-item) {
        display: inline-block;
        cursor: pointer;
    }

    button {
        padding: 0.5em;
        cursor: pointer;
    }

    .close {
        margin: auto;
        margin-top: 1em;
    }

    :global(.test-sound) {
        cursor: pointer;
    }
</style>
