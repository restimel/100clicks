<script lang="ts">
	import {
        accessibleRooms as rooms,
    } from '../stores/currentClick';
    import RoomBox from './RoomBox.svelte';

</script>

<div class="rooms">
    {#each $rooms as room (room.id)}
        <RoomBox
            {room}
        />
    {/each}
</div>

<style>
	.rooms {
		display: grid;
        /* Add padding ×2 + padding of container ×2 */
        grid-template-columns: repeat(auto-fill, minmax(calc(var(--action-box-width) + 4em), 1fr));
        gap: 1em;
        max-width: 100%;
        grid-auto-flow: dense;
        align-items: start;
	}
</style>
