<script lang="ts">
    import { _ } from 'svelte-i18n';
    import Text from '../../components/Text.svelte';
    import sounds from '../../credits/sounds';
    import type { License } from '../../stores/types';

    const gameTitle = '100 Clicks';

    function getLicense(license: License): string {
        switch (license) {
            case 'by3': return '[CCBY 3.0](http://creativecommons.org/licenses/by/3.0/)';
            case 'by4': return '[CCBY 4.0](http://creativecommons.org/licenses/by/4.0/)';
            case 'by-nc4': return '[CCBYNC 4.0](http://creativecommons.org/licenses/by-nc/4.0/)';
            case 'cc0': return '[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)';
        }
    }
</script>

<svelte:head>
    <title>{$_('page.about.title', { values: {
        gameTitle,
    }})}</title>
    <meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
    <h1><Text text={$_('page.about.header', { values: { gameTitle }})} /></h1>

    <p>
        { $_('page.about.introduction') }
        <a href="https://svelte.dev" target="_blank">(Svelte)</a>.
    </p>
    <p>
        { $_('page.about.purpose') }
    </p>

    <p class="about">
        <span class="about-item">{ $_('page.about.author') }</span><span>Benoît Mariat</span>
        <span class="about-item">{ $_('page.about.last-release') }</span><span>2023-02-19</span>
        <span class="about-item">{ $_('page.about.license') }</span><span><a href="https://mit-license.org" target="_blank">MIT</a></span>
    </p>
    <h3>{$_('page.about.credit')}</h3>
    <section class="credit">
        {$_('page.about.credit-sound-introduction')}
        <ul>
            {#each Array.from(sounds.values()) as sound (sound.title)}
            {#if sound.title}
            <li>
                <Text
                    text={$_('page.about.sound-credit', { values: {
                        title: sound.title,
                        author: sound.author,
                        site: sound.site,
                        url: sound.url,
                        license: getLicense(sound.license),
                    }})}
                />
            </li>
            {/if}
            {/each}
        </ul>
    </section>
</div>

<style>
    .about {
        display: grid;
        grid-template-columns: max-content max-content;
        column-gap: 1em;
    }

    .about-item {
        font-weight: bold;
    }
</style>
