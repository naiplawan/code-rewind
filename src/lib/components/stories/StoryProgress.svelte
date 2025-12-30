<script lang="ts">
	interface Props {
		totalSlides: number;
		currentSlide: number;
		onSegmentClick?: (index: number) => void;
	}

	let { totalSlides, currentSlide, onSegmentClick }: Props = $props();

	function handleClick(index: number, event: MouseEvent) {
		event.stopPropagation();
		onSegmentClick?.(index);
	}
</script>

<div class="story-progress flex gap-1.5 p-4 pb-0">
	{#each Array(totalSlides) as _, index}
		<button
			class="progress-segment h-1.5 flex-1 rounded-full overflow-hidden transition-all duration-300"
			class:active={index === currentSlide}
			class:completed={index < currentSlide}
			onclick={(e) => handleClick(index, e)}
			aria-label="Go to slide {index + 1}"
		>
			<div
				class="progress-fill h-full rounded-full transition-all duration-300"
				class:w-full={index < currentSlide}
				class:w-0={index > currentSlide}
				class:animate-progress={index === currentSlide}
			></div>
		</button>
	{/each}
</div>

<!-- Slide counter -->
<div class="text-center py-3">
	<span class="text-citypop-cream/50 text-sm font-medium">
		{currentSlide + 1} of {totalSlides}
	</span>
</div>

<style>
	.progress-segment {
		min-width: 20px;
		background: rgba(255, 255, 255, 0.1);
	}

	.progress-segment:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.progress-segment.active {
		background: rgba(255, 255, 255, 0.15);
	}

	.progress-segment.completed {
		background: rgba(255, 107, 157, 0.2);
	}

	.progress-fill {
		background: linear-gradient(90deg, #FF6B9D, #CE93D8, #81D4FA);
		background-size: 200% 100%;
		animation: gradientShift 3s ease infinite;
	}

	.animate-progress {
		width: 100%;
		animation: fillProgress 5s linear forwards, gradientShift 3s ease infinite;
	}

	@keyframes fillProgress {
		from { width: 0%; }
		to { width: 100%; }
	}

	@keyframes gradientShift {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}
</style>
