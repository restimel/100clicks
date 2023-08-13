<script lang="ts">
    import { fade } from 'svelte/transition';
    import { _ } from 'svelte-i18n';
    import Text from './Text.svelte';
    import { tooltip } from '../helpers/tooltip';
    import {
        stopStory,
        storyDesc,
    } from '../stores/story';
    import { playSound, stopAmbient } from '../stores/sound';
    import DigitValue from './DigitValue.svelte';
    import Stars from './Stars.svelte';

    let total = 0;

    $: stats = (total = 0, $storyDesc.gameOver.score.map((stat) => {
        const value = BigInt(typeof stat.value === 'function' ? stat.value() : stat.value);
        const score = stat.score(value);
        total += score;

        return {
            label: stat.label,
            detail: stat.detail,
            value: value / (stat.decimals ?? 1n),
            score,
        };
    }));

    stopAmbient();

    function end() {
        stopStory();
    }
</script>

<dialog
    class="story-end"
    open
>
    <header>
        {$_('gameover.title')}
    </header>

    <p class="fluff">
        {$_($storyDesc.gameOver.fluff)}
    </p>

    <h3>{$_('gameover.stats.title')}</h3>
    <div class="score">
        <div class="score-header">
            {$_('gameover.stats.label')}
        </div>
        <div class="score-header">
            {$_('gameover.stats.value')}
        </div>
        <div class="score-header">
            {$_('gameover.stats.score')}
        </div>

        {#each stats as stat}
            <div class="score-item" use:tooltip={stat.detail || ''}>
                <Text text={$_(stat.label)} />
            </div>
            <div class="score-item">
                <DigitValue value={stat.value} />
            </div>
            <div class="score-item">
                <Stars value={stat.score} />
            </div>
        {/each}
        <div class="score-total">
            {$_('gameover.stats.total')}
        </div>
        <div class="score-total">
        </div>
        <div class="score-total">
            <Stars value={total} />
        </div>
    </div>

    <button
        class="story-game-over"
        on:click={end}
    >
        {$_('gameover.end')}
    </button>
</dialog>

<style>
.story-end {
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

.story-end > header {
    font-size: 3em;
    text-align: center;
    margin: 10px;
}

.story-end > button {
    display: inline-block;
    width: 50%;
    padding: 0.5em;
    margin-bottom: 0.5em;

    border: 1px solid var(--color-fg-shop);
    background: var(--color-bg-artifact);
    color: var(--color-text);
    box-shadow: 0 1px 3px #000000;
}

.fluff {
    font-style: italic;
}

.score {
    display: grid;
    grid-template-columns: 1fr max-content max-content;
    gap: 5px;
    margin-bottom: 1em;
}

.score-header {
    font-weight: bold;
}

.score-item {
    justify-self: start;
}

.score-total {
    justify-self: start;
    text-align: start;
    border-top: 2px dashed var(--color-fg-shop);
    padding-top: 0.2em;
    font-weight: bold;
    width: 100%;
}
</style>
