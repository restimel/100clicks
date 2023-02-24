<script lang="ts">
	import {
        // accessibleList as actions,
        accessibleRooms as rooms,
    } from '../stores/currentClick';
    import RoomBox from './RoomBox.svelte';

</script>

<div class="rooms">
    {#each $rooms as room}
    <RoomBox
        {room}
    />
    {/each}
</div>

<style>
	.rooms {
		display: grid;
        grid-template-columns: repeat(auto-fill, minmax(calc(var(--action-box-width) + 2em), 1fr));
        gap: 1em;
        max-width: 100%;
        grid-auto-flow: dense;
        align-items: start;
	}
</style>
