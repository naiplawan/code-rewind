<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		value: number;
		duration?: number;
		format?: (n: number) => string;
	}

	let { value, duration = 2000, format = (n: number) => Math.round(n).toLocaleString() }: Props = $props();

	const displayValue = tweened(0, {
		duration: 2000,
		easing: cubicOut
	});

	$effect(() => {
		displayValue.set(value, { duration });
	});
</script>

<span class="tabular-nums">{format($displayValue)}</span>
