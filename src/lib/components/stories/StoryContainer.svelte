<script lang="ts">
	import { createEventDispatcher, type Snippet } from 'svelte';
	import StoryProgress from './StoryProgress.svelte';

	interface Props {
		totalSlides: number;
		currentSlide?: number;
		autoAdvance?: boolean;
		autoAdvanceDelay?: number;
		children: Snippet;
	}

	let {
		totalSlides,
		currentSlide = $bindable(0),
		autoAdvance = false,
		autoAdvanceDelay = 5000,
		children
	}: Props = $props();

	const dispatch = createEventDispatcher();

	let touchStartX = 0;
	let touchEndX = 0;

	function nextSlide() {
		if (currentSlide < totalSlides - 1) {
			currentSlide++;
			dispatch('slideChange', { slide: currentSlide });
		}
	}

	function prevSlide() {
		if (currentSlide > 0) {
			currentSlide--;
			dispatch('slideChange', { slide: currentSlide });
		}
	}

	function goToSlide(index: number) {
		if (index >= 0 && index < totalSlides) {
			currentSlide = index;
			dispatch('slideChange', { slide: currentSlide });
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowRight' || event.key === ' ') {
			nextSlide();
		} else if (event.key === 'ArrowLeft') {
			prevSlide();
		}
	}

	function handleTouchStart(event: TouchEvent) {
		touchStartX = event.touches[0].clientX;
	}

	function handleTouchEnd(event: TouchEvent) {
		touchEndX = event.changedTouches[0].clientX;
		const diff = touchStartX - touchEndX;

		if (Math.abs(diff) > 50) {
			if (diff > 0) {
				nextSlide();
			} else {
				prevSlide();
			}
		}
	}

	function handleClick(event: MouseEvent) {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const clickX = event.clientX - rect.left;
		const width = rect.width;

		// Click on left third goes back, right two-thirds goes forward
		if (clickX < width / 3) {
			prevSlide();
		} else {
			nextSlide();
		}
	}

	// Auto-advance timer
	$effect(() => {
		if (!autoAdvance) return;

		const timer = setInterval(() => {
			if (currentSlide < totalSlides - 1) {
				nextSlide();
			}
		}, autoAdvanceDelay);

		return () => clearInterval(timer);
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<div
	class="story-container relative w-full h-full min-h-screen flex flex-col"
	role="presentation"
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	onclick={handleClick}
>
	<!-- Floating background shapes -->
	<div class="floating-shapes">
		<div class="floating-shape shape-1"></div>
		<div class="floating-shape shape-2"></div>
		<div class="floating-shape shape-3"></div>
	</div>

	<!-- Progress bar -->
	<StoryProgress {totalSlides} {currentSlide} onSegmentClick={goToSlide} />

	<!-- Header -->
	<div class="header-bar px-6 py-3 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<span class="text-citypop-pink font-display font-bold text-lg">CodeRewind</span>
			<span class="text-citypop-cream/40 text-sm">2025</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="w-2 h-2 rounded-full bg-citypop-mint animate-pulse"></span>
			<span class="text-citypop-cream/50 text-xs">Live</span>
		</div>
	</div>

	<!-- Slide content -->
	<div class="flex-1 flex items-center justify-center p-6 md:p-12 relative">
		{@render children()}
	</div>

	<!-- Navigation hints -->
	<div class="absolute bottom-6 left-0 right-0 flex justify-center gap-2 text-citypop-cream/30 text-xs pointer-events-none">
		<span>Tap or use arrows to navigate</span>
	</div>

	<!-- Side navigation indicators -->
	{#if currentSlide > 0}
		<div class="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none hidden md:flex items-center gap-1 text-citypop-cream/20">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</div>
	{/if}
	{#if currentSlide < totalSlides - 1}
		<div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none hidden md:flex items-center gap-1 text-citypop-cream/20">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</div>
	{/if}
</div>

<style>
	.story-container {
		cursor: pointer;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		background: linear-gradient(135deg, #1A1B26 0%, #232536 50%, #1A1B26 100%);
	}

	.floating-shapes {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.floating-shape {
		position: absolute;
		border-radius: 50%;
		filter: blur(100px);
		opacity: 0.3;
	}

	.shape-1 {
		width: 300px;
		height: 300px;
		background: linear-gradient(135deg, #FF6B9D, #CE93D8);
		top: 10%;
		right: -50px;
		animation: float 10s ease-in-out infinite;
	}

	.shape-2 {
		width: 250px;
		height: 250px;
		background: linear-gradient(135deg, #81D4FA, #80CBC4);
		bottom: 20%;
		left: -30px;
		animation: float 12s ease-in-out infinite reverse;
	}

	.shape-3 {
		width: 200px;
		height: 200px;
		background: linear-gradient(135deg, #FFAB91, #FFE082);
		top: 50%;
		right: 20%;
		animation: float 8s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-20px) rotate(3deg); }
	}

	.header-bar {
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(10px);
	}
</style>
