<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    let ref: HTMLDivElement;
    let portal: HTMLDivElement;

    onMount(() => {
        portal = document.createElement('div');
        portal.className = 'portal';
        document.body.appendChild(portal);
        portal.appendChild(ref);
    });

    onDestroy(() => {
        document.body.removeChild(portal);
    });
</script>

<div class="portal-internal">
    <div bind:this={ref}>
        <slot></slot>
    </div>
</div>

<style>
    .portal-internal {
        display: none;
    }
</style>
