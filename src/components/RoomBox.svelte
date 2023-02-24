<script lang="ts">
    import Actions from './Actions.svelte';
    import Text from './Text.svelte';
    import {
        accessibleList as actions,
    } from '../stores/currentClick';
    import type { Room } from '../stores/rooms';

    export let room: Room;

    $: actionList = $actions.filter(({roomId}) => roomId === room.id);
    $: style = `--color-room:${room.color}; --color-bg-room:${room.bgColor};
    --room-size:${actionList.length + 1};`

</script>

<div
    class="room-box"
    {style}
>
	<div class="room-box__title">
        <Text text={room.title} />
    </div>
    <div class="room-box__fluff">
        <Text text={room.fluff} />
	</div>
    <div class="room-box__actions">
        <Actions list={actionList} />
    </div>
</div>

<style>
	.room-box {
        position: relative;
        /* cursor: not-allowed; */
        /* user-select: none; */
        width: calc(var(--action-box-width) + 4em);
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
</style>
