<script lang="ts">
    import { blur, slide } from 'svelte/transition';
    import { _ } from 'svelte-i18n';
    import Actions from './Actions.svelte';
    import Text from './Text.svelte';
    import {
        accessibleList as actions,
    } from '../stores/currentClick';
    import Icon from './Icon.svelte';
    import { playSound } from '../stores/sound';
    import type { Room } from '../stores/types';

    export let room: Room<string>;
    let expand = true;

    $: actionList = $actions.filter(({roomId}) => roomId === room.id);
    $: style = `--color-room:${room.color}; --color-bg-room:${room.bgColor};
        --room-size:${actionList.length + 1};`;
    $: caretClass = expand ? 'fa-caret-down' : 'fa-caret-right';

    function changeExpand() {
        expand = !expand;
        playSound('click');
    }
</script>

<div class="room-box-cell">
    <div
        class="room-box"
        class:collapsed={!expand}
        {style}
        transition:blur={{duration: 400}}
    >
        <div class="room-box__title">
            <Text text={$_(room.title)} />
        </div>
        {#if expand}
        <div class="room-box__fluff" transition:slide>
            <Text text={$_(room.fluff)} />
        </div>
        <div class="room-box__actions" transition:slide>
            <Actions list={actionList} />
        </div>
        {/if}
        <Icon
            icon="fa-solid {caretClass}"
            class="room_box-caret"
            on:click={changeExpand}
        />
    </div>
</div>

<style>
    .room-box-cell {
        max-width: 100%;
        width: 100%;
    }

    .room-box {
        position: relative;
        width: calc(var(--action-box-width) + 2em);
        max-width: 100%;
        min-height: 30px;
        padding: 0.5em 1em;
        margin: auto;

        border: 2px solid var(--color-room, var(--color-theme-2));
        background-color: var(--color-bg-room, var(--color-bg-0));
        background-image: radial-gradient(
            50% 50% at 50% 50%,
            rgba(255, 255, 255, 0.45) 0%,
            rgba(0, 0, 0, 0.1) 100%
        );
        color: var(--color-room, var(--color-text));
        box-shadow: 0 3px 10px #000000FF;

        display: grid;
        grid-template-rows: max-content 1fr max-content max-content;
        grid-template-areas: "title" "fluff" "actions";
        gap: 0.5em;
        grid-row: auto / span var(--room-size);
        align-content: center;
        align-items: center;
    }
    .room-box.collapsed {
        grid-template-rows: max-content;
        grid-template-columns: 1fr;
    }

    .room-box__title {
        text-align: center;
        font-size: 1.5em;
        grid-area: title;
    }

    .room-box__fluff {
        grid-area: fluff;
        text-align: justify;
        font-size: 0.9em;
        font-style: italic;
    }

    .room-box__actions {
        grid-area: actions;
    }

    .room-box-cell :global(.room_box-caret) {
        position: absolute;
        top: 1em;
        right: 1em;
        cursor: pointer;
    }
</style>
