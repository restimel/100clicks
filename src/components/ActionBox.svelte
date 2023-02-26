<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { scale } from 'svelte/transition';
    import type { Comparison } from '../stores/types';
    import DigitValue from './DigitValue.svelte';
    import Text from './Text.svelte';

    export let id: string;
    export let title: string;
    export let description: string;
    export let fluff: string;
    export let cost: Comparison[];
    export let prerequisites: Array<[string, boolean]>;
    export let canPayCost: boolean;

    const trigger = createEventDispatcher<{click: string}>();

    $: missingRequires = prerequisites.filter(([,isSatisfied]) => !isSatisfied).length;
    $: nbRequirementDone = prerequisites.length - missingRequires;
    $: isActive = canPayCost && missingRequires === 0;

    function clicked() {
        if (missingRequires === 0) {
            trigger('click', id);
        }
    }
</script>

<div
    class="action-box"
    class:active={isActive}
    on:click={clicked}
    transition:scale|local={{duration: 200}}
>
	<div class="action-box__title">
        <Text text={title} />
    </div>
    {#if prerequisites.length > 0}
    <div class="requirement">
        Require:
        <span
            class:requirement-missing={missingRequires > 0}
            class:requirement-satisfied={missingRequires === 0}
        >
            ( {nbRequirementDone} / {prerequisites.length})
            </span>
        <ul class="requirement-list">
            {#each prerequisites as [desc, isSatisfied]}
            <li
                class:requirement-missing={!isSatisfied}
                class:requirement-satisfied={isSatisfied}
            >
                <Text text={desc} />
            </li>
            {/each}
        </ul>
    </div>
    {/if}
	<div class="action-box__description">
        <Text text={description} />
	</div>
	<div class="action-box__fluff">
        {fluff}
	</div>
    <div class="cost" title="cost" class:requirement-missing={!canPayCost}>
        {#each cost as [type, value]}
            <DigitValue value={value} /><Text text={`:${type}:`} />
        {/each}
    </div>
</div>

<style>
	.action-box {
        position: relative;
        cursor: not-allowed;
        user-select: none;
        width: var(--action-box-width);
        min-height: 50px;
        padding: 0.5em 1em;
        border: 2px solid var(--color-theme-2);
        background-color: var(--color-bg-2);
        color: var(--color-text-disabled);
        box-shadow: 0 3px 10px #00000066;

        display: grid;
        grid-template-rows: max-content 1fr max-content max-content;
        grid-template-areas: "title" "requirement" "description" "fluff";
        gap: 0.5em;
	}
    .action-box.active {
        cursor: pointer;
        background-color: var(--color-bg-0);
        color: var(--color-text);
        box-shadow: 0 3px 10px #000000FF;
    }
    .action-box.active:active {
        background-color: var(--color-bg-2);
    }

    .action-box__title {
        text-align: center;
        font-size: 1.5em;
        grid-area: title;
    }

    .requirement {
        font-size: 0.7em;
        grid-area: requirement;
    }
    .requirement-list {
        margin-block-start: 0;
    }
    .requirement-missing {
        color: var(--color-missing);
    }
    .requirement-satisfied {
        color: var(--color-satisfied);
    }

    .action-box__description {
        grid-area: description;
        text-align: center;
    }

    .action-box__fluff {
        grid-area: fluff;
        text-align: justify;
        font-size: 0.9em;
        font-style: italic;
    }

    .cost {
        position: absolute;
        font-size: 0.6em;
        top: 0.2em;
        right: 0.2em;
    }
</style>
