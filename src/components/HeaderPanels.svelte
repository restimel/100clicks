<script>
    import Dashboard from '../components/Dashboard.svelte';
    import Logs from '../components/Logs.svelte';
</script>

<div class="header-panels">
    <Dashboard />
    <Logs />
</div>

<style>
    .header-panels {
        display: flex;
        flex-direction: rows;
    }
</style>
