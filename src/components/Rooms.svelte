<script lang="ts">
    import { onDestroy, afterUpdate } from 'svelte';
    import { ResizeObserver } from '../helpers/Browser';
	import {
        accessibleRooms as rooms,
    } from '../stores/currentClick';
    import type { Room } from '../stores/rooms';
    import RoomBox from './RoomBox.svelte';

    type RoomRef = {
        id: string;
        room: Room;
        /* index in $rooms */
        idx: number;
        /* column position */
        column: number;
        /* x-coordinate in the parent container */
        x: number;
        /* y-coordinate in the parent container */
        y: number;
        /* element's height */
        height: number;
        /* wrapper element related to this room */
        elRef: HTMLDivElement | null;
    };

    const columnSize = 342;
    const gap = 10;
    let elWidth: number = 0;
    let elHeight: number = 0;
    let element: HTMLDivElement;
    let nbColumns = 0;
    let columnWidth = elWidth / nbColumns;
    let padding = 0;
    let missingRef = false;

    /* List of all wrapper elements (for binding) */
    let elementsRef: HTMLDivElement[] = [];
    const mapRef = new WeakMap<HTMLDivElement, string>();

    let roomRefs = new Map<string, RoomRef>();
    $: (() => {
        const refs = new Map<string, RoomRef>();
        let changed = false;
        $rooms.forEach((room, idx) => {
            let roomRef = roomRefs.get(room.id);
            if (!roomRef) {
                changed = true;
                roomRef = {
                    id: room.id,
                    room: room,
                    height: 30,
                    idx: idx,
                    column: 0,
                    x: 0,
                    y: 0,
                    elRef: null,
                };
            } else {
                if (roomRef.idx !== idx) {
                    changed = true;
                    roomRef.idx = idx;
                }
            }

            refs.set(room.id, roomRef);
        });

        /* check for removed room */
        roomRefs.forEach((roomRef) => {
            if (!refs.has(roomRef.id)) {
                changed = true;
                /* stop observation */
                if (roomRef.elRef) {
                    resizeObserver.unobserve(roomRef.elRef);
                }
            }
        });

        roomRefs = refs;
        if (changed) {
            if (updateHeightRefs()) {
                updatePosition();
            }
        }
    })();

    function refreshSize() {
        if (!element) {
            return;
        }

        const {width, height} = element.getBoundingClientRect();
        elWidth = width;
        elHeight = height;
        nbColumns = Math.floor(width / (columnSize + gap));
        columnWidth = width / nbColumns;
        padding = (columnWidth - columnSize - gap) / 2;
        updateColumnPositions();
    }

    const resizeObserver = new ResizeObserver(function(entries) {
        for (const entry of entries) {
            const height = entry.contentRect.height;

            const id = mapRef.get(entry.target as HTMLDivElement)!;
            const roomRef = roomRefs.get(id);
            if (roomRef) {
                roomRef.height = height;
                updatePosition();
            }
        }
    });

    function updateHeightRefs(): boolean {
        let changed = false;
        missingRef = false;
        roomRefs.forEach((roomRef) => {
            const ref = elementsRef[roomRef.idx];
            if (!ref) {
                if (roomRef.elRef) {
                    resizeObserver.unobserve(roomRef.elRef);
                }
                missingRef = true;
                return;
            }

            if (ref !== roomRef.elRef) {
                changed = true;
                if (roomRef.elRef) {
                    resizeObserver.unobserve(roomRef.elRef);
                }
                roomRef.elRef = ref;
                mapRef.set(ref, roomRef.id);
                resizeObserver.observe(ref);

                const { height } = ref.getBoundingClientRect();
                roomRef.height = height;
            }
        });

        if (changed) {
            roomRefs = roomRefs;
        }

        return changed;
    }

    function getMinIndex(arr: number[]): number {
        let minValue = arr[0];
        let minIdx = 0;
        const length = arr.length;
        for (let idx = 1; idx < length; idx++) {
            if (arr[idx] < minValue) {
                minValue = arr[idx];
                minIdx = idx;
            }
        }
        return minIdx;
    }
    function dispatchColumns(ids: string[], nbColumns: number, offsetColumn: number): boolean {
        const columnSum = new Array<number>(nbColumns).fill(0);
        let changed = false;

        for (const id of ids) {
            const idx = getMinIndex(columnSum);
            const ref = roomRefs.get(id)!;
            const valY = columnSum[idx];
            const column = idx + offsetColumn;
            const valX = column * columnWidth + padding;

            if (ref.y !== valY) {
                ref.y = valY;
                changed = true;
            }
            if (ref.column !== column) {
                ref.column = column;
                changed = true;
            }
            if (ref.x !== valX) {
                ref.x = valX;
                changed = true;
            }
            columnSum[idx] += ref.height + gap;
        }
        return changed;
    }
    function updateColumnPositions(): boolean {
        if (nbColumns === 0) {
            return false;
        }
        const ids = $rooms.map((room) => room.id);
        let nbDispatchColumn = nbColumns;
        let offsetColumn = 0;

        const itemsLength = ids.length;
        const diff = nbDispatchColumn - itemsLength;
        if (diff > 1) {
            offsetColumn = Math.floor(diff / 2);
            nbDispatchColumn -= offsetColumn * 2;
        }

        if (dispatchColumns(ids, nbDispatchColumn, offsetColumn)) {
            roomRefs = roomRefs;
            return true;
        }
        return false;
    }

    let positionTimer = 0;
    function updatePosition() {
        if (positionTimer) {
            /* debounce */
            return;
        }
        clearTimeout(positionTimer);
        positionTimer = setTimeout(() => {
            positionTimer = 0;
            updateColumnPositions();
        }, 100) as unknown as number;
    }

    let resizeTimer = 0;
    let resizeTimer2 = 0;
    function resize() {
        clearTimeout(resizeTimer);
        if (!resizeTimer2) {
            resizeTimer2 = setTimeout(() => {
                /* preview if debounce is too long */
                resizeTimer2 = 0;
                refreshSize();
            }, 1000) as unknown as number;
        }
        resizeTimer = setTimeout(() => {
            /* Debounce */
            clearTimeout(resizeTimer2);
            refreshSize();
            resizeTimer2 = 0;
        }, 300) as unknown as number;
    }

    resize();

    afterUpdate(() => {
        if (missingRef) {
            updateHeightRefs();
        }
    });

    onDestroy(() => {
        /* stop observing */
        roomRefs.forEach((roomRef) => {
            if (roomRef.elRef) {
                resizeObserver.unobserve(roomRef.elRef);
            }
        });
    });
</script>

<svelte:window on:resize={resize}></svelte:window>
<div
    class="rooms-columns"
    bind:this={element}
>
    {#each $rooms as room, idx ('room-' + room.id)}
        {@const ref = roomRefs.get(room.id)}
        {#if ref}
            <div class="wrapper-room"
                bind:this={elementsRef[idx]}
                style={`--x: ${ref.x}px; --y: ${ref.y}px;`}
            >
                <RoomBox
                    {room}
                />
            </div>
        {/if}
    {/each}
</div>

<style>
    .rooms-columns {
        height: 100%;
        overflow-y: auto;
        overflow-x: clip;

        position: relative;
    }

    .wrapper-room {
        position: absolute;
        left: var(--x);
        top: var(--y);
        transition: left 200ms, top 200ms;
    }
</style>
