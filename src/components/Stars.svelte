<script lang="ts">
    export let value: number;

    $: starValue = Math.max(5, Math.min(0, Math.round(value)));
    $: stars = (new Array(starValue)).fill('⭐').join('');
</script>

<span class="stars">
    {stars}
</span>

<style>
</style>
