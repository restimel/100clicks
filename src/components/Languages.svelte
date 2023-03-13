<script lang="ts">
    import { locale, _ } from 'svelte-i18n';
    import { tooltip } from '../helpers/tooltip';
	import { extractLocale, languages } from '../locales/i18n';

    $: currentLanguage = languages.get($locale ?? 'en') ?? '';

    let expandList = false;
    function toggleList() {
        expandList = !expandList;
    }

    function setlocale(localeId: string) {
        $locale = extractLocale(localeId);
        expandList = false;
    }
</script>

<div
    class="{$$props.class} select-language"
    use:tooltip={currentLanguage}
    on:click={toggleList}
>
    {$locale}
</div>
{#if expandList}
    <div class="expand-language">
        {#each Array.from(languages) as [localeId, languageName] (localeId)}
            <div
                class="language-item"
                class:active={localeId === $locale}
                on:click={() => setlocale(localeId)}
            >
                {languageName}
            </div>
        {/each}
    </div>
{/if}

<style>
    .select-language {
        cursor: pointer;
    }

    .expand-language {
        position: fixed;
        display: flex;
        flex-direction: column;

        padding: 1em;
        background-color: white;
    }

    .language-item {
        cursor: pointer;
        margin: 0.2em;
    }
    .language-item:hover {
        font-weight: bold;
    }

    .language-item.active {
        color: var(--color-theme-1);
    }
</style>
