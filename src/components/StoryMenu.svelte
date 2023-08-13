<script lang="ts">
    import { fade } from 'svelte/transition';
    import { _ } from 'svelte-i18n';
    import { tooltip } from '../helpers/tooltip';
    import {
        activeStory,
        startStory,
        storyList,
    } from '../stores/story';
    import { playSound } from '../stores/sound';

    let selectedStory = '';
    let message = '';

    $: listStory = Array.from(storyList.values());

    function chooseStory(id: string) {
        message = '';
        selectedStory = id;
    }

    function start() {
        message = '';

        if (!selectedStory) {
            playSound('error');
            message = $_('menu.story.errorSelected');
            return;
        }
        activeStory.set(selectedStory);

        if (!startStory()) {
            playSound('error');
            message = $_('menu.story.errorStart');
        }
    }
</script>

<dialog
    class="story-menu"
    open
>
    <header>
        {$_('menu.story.header')}
    </header>

    {#each listStory as story}
        <button
            class:selected={selectedStory === story.id}
            use:tooltip={$_(story.description)}
            on:click={() => chooseStory(story.id)}
        >
            {$_(story.name)}
            <span class="story-version">
                {story.version}
            </span>
        </button>
    {/each}

    <button
        class="story-start"
        class:disabled={!selectedStory}
        on:click={start}
    >
        {$_('menu.story.start')}
    </button>
    {#if message}
        <p class="error" in:fade out:fade>
            {message}
        </p>
    {/if}
</dialog>

<style>
.story-menu {
    position: fixed;
    top: 50%;
    left: 50%;
    width: auto;
    max-width: 95vw;
    max-height: 95vh;
    overflow: auto;
    transform: translate(-50%, -50%);
    z-index: var(--mask-z-index, 1000);
    text-align: center;

    padding: 1em;
    border: 2px solid var(--color-fg-shop);
    border-radius: 1em;
    box-shadow: 1px 2px 10px black;
    background-color: var(--color-bg-shop);
    color: var(--color-fg-shop);
    background-image: radial-gradient(
        50% 50% at 50% 50%,
        rgba(255, 255, 255, 0.45) 0%,
        rgba(255, 255, 255, 0) 100%
    );
}

.story-menu > header {
    font-size: 2em;
    text-align: center;
    margin: 10px;
}

.story-menu > button {
    position: relative;
    display: block;
    width: 100%;
    padding: 0.5em;
    margin-bottom: 0.5em;

    border: 1px solid var(--color-fg-shop);
    background: var(--color-bg-artifact);
    color: var(--color-text);
    box-shadow: 0 1px 3px #000000;
}
.story-menu > button.selected {
    background-color: var(--color-bg-artifact--selected);
    color: var(--color-text-selected);
}

.story-menu > button.story-start {
    width: 50%;
    transform: translate(50%);
    margin-top: 1em;
    margin-bottom: 0;
}
.story-menu > button.story-start.disabled {
    cursor: not-allowed;
    background-color: var(--color-bg-artifact--disabled);
    opacity: 0.5;
}

.story-version {
    font-size: 0.5em;
    font-style: italic;
    position: absolute;
    bottom: 0.5em;
    right: 1em;
}

.story-menu > .error {
    font-size: 0.8em;
    font-style: italic;
    color: var(--color-error);
}
</style>
