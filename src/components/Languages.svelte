<script lang="ts">
    import { locale, _ } from 'svelte-i18n';
    import { tooltip } from '../helpers/tooltip';
    import { extractLocale, languages } from '../locales/i18n';
    import Portal from './Portal.svelte';

    type Display = 'shortCode' | 'flag';

    export let display: Display = 'shortCode';
    let ref: HTMLDivElement;
    let x = 0;
    let y = 0;

    $: currentLanguage = languages.get($locale ?? 'en') ?? {label: '', svg: ''};

    function clickOutside(evt: MouseEvent) {
        const el = evt.target as HTMLElement;
        if (expandList && el.closest('.expand-language, .select-language')) {
            return;
        }
        expandList = false;
    }

    let expandList = false;
    function toggleList() {
        expandList = !expandList;
        if (expandList) {
            const rect = ref.getBoundingClientRect();
            x = rect.left;
            y = rect.bottom;
        }
    }

    function setlocale(localeId: string) {
        $locale = extractLocale(localeId);
        expandList = false;
    }
</script>

<div
    class="{$$props.class} select-language"
    use:tooltip={currentLanguage.label}
    on:click={toggleList}
    bind:this={ref}
>
    {#if display === 'flag'}
        <span class="flag">
            {@html currentLanguage.svg || $locale}
        </span>
    {:else}
        {$locale}
    {/if}
</div>
{#if expandList}
    <Portal>
        <div class="expand-language" style={`--x: ${x}px; --y: ${y}px;`}>
            {#each Array.from(languages) as [localeId, {label, svg}] (localeId)}
                <div
                    class="language-item"
                    class:active={localeId === $locale}
                    on:click={() => setlocale(localeId)}
                >
                    <span class="flag">
                        {@html svg}
                    </span>
                    <span>
                        {label}
                    </span>
                </div>
            {/each}
        </div>
    </Portal>
{/if}
<svelte:window on:click={clickOutside} />

<style>
    .expand-language {
        position: fixed;
        display: flex;
        flex-direction: column;

        padding: 1em;
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 1px 3px 7px black;
        z-index: calc(var(--mask-z-index, 1000) * 2);

        left: var(--x, 0);
        top: var(--y, 0);
    }

    .language-item {
        cursor: pointer;
        margin: 0.2em;
        display: flex;
        flex-direction: row;
        gap: 1ch;
    }
    .language-item:hover {
        font-weight: bold;
    }
    .flag {
        display: inline-block;
        width: 17px;
    }
    .language-item:hover .flag {
        width: 25px;
    }

    .language-item.active {
        color: var(--color-theme-1);
    }
</style>
