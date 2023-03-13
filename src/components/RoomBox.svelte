<script lang="ts">
    import { blur, slide } from 'svelte/transition';
    import { _ } from 'svelte-i18n';
    import Actions from './Actions.svelte';
    import Text from './Text.svelte';
    import {
        accessibleList as actions,
    } from '../stores/currentClick';
    import type { Room } from '../stores/rooms';
    import Icon from './Icon.svelte';

    export let room: Room;
    let expand = true;

    $: actionList = $actions.filter(({roomId}) => roomId === room.id);
    $: style = `--color-room:${room.color}; --color-bg-room:${room.bgColor};
        --room-size:${actionList.length + 1};`;
    $: caretClass = expand ? 'fa-caret-down' : 'fa-caret-right';

    function changeExpand() {
        expand = !expand;
    }
</script>

<div class="room-box-cell">
    <div
        class="room-box"
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
        position: relative;
        max-width: 100%;
    }

	.room-box {
        /* cursor: not-allowed; */
        /* user-select: none; */
        width: calc(var(--action-box-width) + 2em);
        max-width: 100%;

        min-height: 30px;
        padding: 0.5em 1em;
        border: 2px solid var(--color-room, var(--color-theme-2));
        background-color: var(--color-bg-room, var(--color-bg-0));
        color: var(--color-room, var(--color-text));
        box-shadow: 0 3px 10px #000000FF;

        display: grid;
        grid-template-rows: max-content 1fr max-content max-content;
        grid-template-areas: "title" "fluff" "actions";
        gap: 0.5em;
        grid-row: auto / span var(--room-size);
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
