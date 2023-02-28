<script lang="ts">
	import { spring } from 'svelte/motion';

	export let value: number | bigint;
	let className: string = '';
	export { className as class};
	export let format: (nb: number) => string = formatBigNumber;

	const displayed_count_value = spring();
	$: numberValue = Number(value);
	$: displayed_count_value.set(numberValue);
	$: displayed_count_value0 = Math.floor($displayed_count_value);
	$: displayed_count = format(displayed_count_value0);
	$: displayed_count1 = format(displayed_count_value0 + 1);
	$: offset = modulo($displayed_count_value, 1);
	$: title = numberValue >= 1000 ? formatNumber(numberValue) : '';
	$: size = offset ?
		(offset > 0.5 ? displayed_count1.length : displayed_count.length)
		: displayed_count.length;

	function modulo(nb: number, mod: number) {
		// handle negative numbers
		return ((nb % mod) + mod) % mod;
	}

	function formatNumber(nb: number): string {
		const nbSplit = nb.toString(10).split(/(?<=\d{1,3})(?=(?:\d{3})+$)/);
		return nbSplit.join(',');
	}

	function formatBigNumber(nb: number): string {
		if (nb < 0) {
			return `-${formatBigNumber(-nb)}`;
		}
		if (nb < 1) {
			return '0';
		}
		const suffixes: Array<[number, string]> = [
			[1, ''],
			[1_000, 'k'],
			[1e6, 'M'],
			[1e9, 'G'],
			[1e12, 'T'],
			[1e15, 'P'],
			[1e18, 'E'],
			[1e21, 'Z'],
			[1e24, 'Y'],
			[1e27, 'R'],
			[1e30, 'Q'],
		];
		const idx = suffixes.findIndex(([base]) => nb < base) - 1;
		const [divider, suffix] = suffixes[idx];
		const value = nb / divider;
		const decimals = 10** (2 - Math.floor(Math.log10(value)));
		const truncValue = Math.round(value * decimals) / decimals
		return truncValue + suffix;
	}
</script>

<div class="digitValue {className}" {title}>
	<div class="digitValue-viewport" style={`--digit-length: ${size}ch`}>
		<div class="digitValue-digits" style="transform: translate(0, {100 * offset}%)">
			<strong class="hidden" aria-hidden="true">{displayed_count1}</strong>
			<strong>{displayed_count}</strong>
		</div>
	</div>
</div>

<style>
	.digitValue {
		display: inline-flex;
		align-items: baseline;
	}

	.digitValue-viewport {
		width: var(--digit-length, 1ch);
		height: 1em;
		overflow: hidden;
		text-align: center;
		position: relative;
	}

	.digitValue-viewport strong {
		position: absolute;
		display: flex;
		width: 100%;
		height: 100%;
		font-weight: 400;
		/* color: var(--color-theme-1); */
		align-items: baseline;
		justify-content: center;
	}

	.digitValue-digits {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.hidden {
		top: -100%;
		user-select: none;
	}
</style>
