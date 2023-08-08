<script lang="ts">
    import { blur } from 'svelte/transition';
    import { get } from 'svelte/store';
    import { _ } from 'svelte-i18n';
    import Portal from './Portal.svelte';
    import Text from './Text.svelte';
    import { page } from '$app/stores';
    import { stopStory, storyReady } from '../stores/story';

    export let base: string;
    export let link: string;

    let ref: HTMLDivElement;
    let x = 0;
    let y = 0;
    let openDialog = false;

    function clickOutside(evt: MouseEvent) {
        const el = evt.target as HTMLElement;
        if (expandList && el.closest('.expand-game, .play-game')) {
            return;
        }
        expandList = false;
    }

    function gameRunning(): boolean {
        return get(storyReady);
    }

    function hasAnItem(): boolean {
        return gameRunning();
    }

    let expandList = false;
    function toggleList() {
        if ($page.url.pathname !== link || !hasAnItem()) {
            expandList = false;
            return;
        }
        expandList = !expandList;
        if (expandList) {
            const rect = ref.getBoundingClientRect();
            x = rect.left;
            y = rect.bottom;
        }
    }

    function applyChangeStory() {
        openDialog = false;
        expandList = false;
        stopStory();
    }

    function changeStory() {
        openDialog = true;
        expandList = false;
    }
</script>

<div
    class="{$$props.class} play-game"
    on:click={toggleList}
    bind:this={ref}
>
    <a href={base + link}>{ $_('component.header.game') }</a>
</div>
{#if openDialog}
    <Portal>
        <div class="mask"
            transition:blur={{duration: 400}}
        ></div>
        <dialog
            class="confirm-dialog"
            open={openDialog}
            transition:blur={{duration: 500}}
        >
            <header>
                { $_('component.header.confirm-change-game.title') }
            </header>
            <p>
                <Text text={$_('component.header.confirm-change-game.content')} />
            </p>
            <footer>
                <button on:click={ applyChangeStory }>
                    { $_('components.dialog.confirm') }
                </button>
                <button on:click={ () => {openDialog = false; } }>
                    { $_('components.dialog.cancel') }
                </button>
            </footer>
        </dialog>
    </Portal>
{/if}
{#if expandList}
    <Portal>
        <div class="expand-game" style={`--x: ${x}px; --y: ${y}px;`}>
            <ul class="game-list-action">
                {#if gameRunning()}
                    <li class="game-item">
                        <div on:click={changeStory}>
                            { $_('page.game.actions.change-story') }
                        </div>
                    </li>
                {/if}
            </ul>
        </div>
    </Portal>
{/if}
<svelte:window on:click={clickOutside} />

<style>
    .expand-game {
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

    .game-list-action {
        margin: 0;
        padding: 0;
    }

    .game-item {
        display: block;
        cursor: pointer;
    }
    .game-item:hover {
        color: var(--color-theme-1);
    }

    .confirm-dialog {
        position: fixed;
        top: 35%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        max-width: 95vw;
        max-height: 95vh;
        z-index: var(--mask-z-index, 1000);
        text-align: center;
        padding: 1em;
        border: 2px solid var(--color-fg-shop);
        border-radius: 1em;
        box-shadow: 1px 2px 10px black;
        color: var(--color-fg-shop);
        background-color: var(--color-bg-shop);
        background-image: radial-gradient( 50% 50% at 50% 50%, #ffffff73 0%, rgba(255, 255, 255, 0) 100% );
    }
    .confirm-dialog button {
        padding: 0.5em;
        border: 1px solid var(--color-fg-shop);
        background: var(--color-bg-artifact);
        color: var(--color-text);
        box-shadow: 0 1px 3px #000000;
    }
    .confirm-dialog button:hover {
        background-color: var(--color-bg-artifact--selected);
        color: var(--color-text-selected);
    }
    .confirm-dialog header {
        font-size: 2em;
        margin: 10px;
    }

    .mask {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(100, 100, 100, 0.5);
    }
</style>
