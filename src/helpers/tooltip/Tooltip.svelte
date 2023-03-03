<script lang="ts">
	import Text from '../../components/Text.svelte';
	export let title: string;
	export let x: number;
	export let y: number;
</script>
<aside style="--pos-x: {x}px;--pos-y: {y}px;">
	<Text text={title} />
</aside>

<style>
	aside {
		left: calc(var(--pos-x) + 5px);
		top: calc(var(--pos-y) + 5px);
		border: 1px solid #ddd;
		box-shadow: 1px 1px 1px #ddd;
		background: white;
		border-radius: 4px;
		padding: 4px;
		position: fixed;
	}
</style>
