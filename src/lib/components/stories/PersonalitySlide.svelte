<script lang="ts">
	import type { DeveloperPersonality } from '$lib/types';

	interface Props {
		personality: DeveloperPersonality;
	}

	let { personality }: Props = $props();

	const typeGradients: Record<string, string> = {
		'night-owl': 'from-citypop-purple to-citypop-lavender',
		'early-bird': 'from-citypop-orange to-citypop-yellow',
		'polyglot': 'from-citypop-sky to-citypop-teal',
		'specialist': 'from-citypop-blue to-citypop-lavender',
		'team-player': 'from-citypop-pink to-citypop-coral',
		'marathon-runner': 'from-citypop-mint to-citypop-teal',
		'sprinter': 'from-citypop-coral to-citypop-orange',
		'architect': 'from-citypop-lavender to-citypop-sky'
	};

	const gradient = $derived(typeGradients[personality.type] || 'from-citypop-pink to-citypop-purple');
</script>

<div class="personality-slide flex flex-col items-center justify-center text-center max-w-lg mx-auto">
	<p class="text-citypop-cream/60 text-xl mb-8 animate-fade-in font-display">
		Based on your patterns...
	</p>

	<!-- Personality reveal card -->
	<div class="personality-card animate-scale-in" style="animation-delay: 0.2s">
		<!-- Icon with gradient background -->
		<div class="icon-wrapper bg-gradient-to-br {gradient}">
			<span class="text-5xl animate-bounce-in" style="animation-delay: 0.4s">{personality.icon}</span>
		</div>

		<!-- Title -->
		<p class="text-citypop-cream/50 text-sm mb-2 mt-6">You are</p>
		<h2 class="text-2xl md:text-3xl font-display font-bold mb-4 gradient-text">
			{personality.title}
		</h2>

		<!-- Description -->
		<div class="description-box">
			<p class="text-citypop-cream/80 leading-relaxed">
				{personality.description}
			</p>
		</div>
	</div>

	<!-- Share prompt -->
	<div class="share-prompt animate-fade-in" style="animation-delay: 0.6s">
		<span class="text-citypop-cream/40">Share your developer type</span>
		<svg class="w-4 h-4 text-citypop-cream/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
		</svg>
	</div>
</div>

<style>
	.personality-card {
		padding: 2rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 24px;
		width: 100%;
		max-width: 320px;
	}

	.icon-wrapper {
		width: 100px;
		height: 100px;
		border-radius: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		box-shadow: 0 10px 40px rgba(255, 107, 157, 0.2);
	}

	.description-box {
		padding: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 12px;
		text-align: left;
	}

	.share-prompt {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 2rem;
	}

	.animate-fade-in {
		animation: fadeIn 0.6s ease-out forwards;
		opacity: 0;
	}

	.animate-scale-in {
		animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
		opacity: 0;
	}

	.animate-bounce-in {
		animation: bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
		opacity: 0;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes scaleIn {
		from { transform: scale(0.8); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}

	@keyframes bounceIn {
		0% { transform: scale(0); opacity: 0; }
		50% { transform: scale(1.2); }
		100% { transform: scale(1); opacity: 1; }
	}
</style>
