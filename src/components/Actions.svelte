<script lang="ts">
    import { flip } from 'svelte/animate';
    import { clickAction } from '../stores/currentClick';
    import ActionBox from './ActionBox.svelte';
    import type { DisplayedAction } from '../stores/types';

    type StoryResource = string;

    export let list: DisplayedAction<StoryResource>[];
</script>

<div class="actions">
    {#each list as item (item.id)}
        <div class="wrapper" animate:flip|local={{duration: 400}}>
            <ActionBox
                {...item}
                on:click={clickAction}
            />
        </div>
    {/each}
</div>

<style>
    .actions {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(calc(var(--action-box-width) + 2em), 1fr));
        gap: 1em;
        max-width: 100%;
    }
    .wrapper {
        max-width: 100%;
    }
</style>
