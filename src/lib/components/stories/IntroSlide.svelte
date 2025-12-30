<script lang="ts">
	import type { User } from '$lib/types';

	interface Props {
		githubUser: User | null;
		gitlabUser: User | null;
	}

	let { githubUser, gitlabUser }: Props = $props();

	const primaryUser = $derived(githubUser || gitlabUser);
	const hasMultiplePlatforms = $derived(githubUser && gitlabUser);
</script>

<div class="intro-slide flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-fade-in">
	<!-- Avatar -->
	{#if primaryUser?.avatarUrl}
		<div class="relative mb-8 animate-scale-in" style="animation-delay: 0.2s">
			<div class="avatar-glow">
				<img
					src={primaryUser.avatarUrl}
					alt={primaryUser.name}
					class="w-28 h-28 rounded-full object-cover"
				/>
			</div>
			{#if hasMultiplePlatforms}
				<div class="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
					<span class="platform-badge github">
						<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
						</svg>
					</span>
					<span class="platform-badge gitlab">
						<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
						</svg>
					</span>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Welcome text -->
	<p class="text-citypop-cream/60 text-lg mb-2 animate-slide-up" style="animation-delay: 0.3s">
		Welcome back,
	</p>

	<h1 class="text-4xl md:text-5xl font-display font-bold mb-3 animate-slide-up gradient-text" style="animation-delay: 0.4s">
		{primaryUser?.name || 'Developer'}
	</h1>

	<p class="text-citypop-lavender text-lg mb-10 animate-slide-up" style="animation-delay: 0.5s">
		@{primaryUser?.username}
	</p>

	<!-- Year badge -->
	<div class="animate-scale-in" style="animation-delay: 0.7s">
		<div class="year-badge">
			<span class="text-citypop-cream font-display font-semibold">Your 2025</span>
			<span class="sunset-text font-display font-bold">CodeRewind</span>
		</div>
	</div>

	<!-- Subtitle -->
	<p class="text-citypop-cream/40 mt-10 text-sm animate-fade-in" style="animation-delay: 0.9s">
		Tap to continue
	</p>
</div>

<style>
	.avatar-glow {
		padding: 4px;
		background: linear-gradient(135deg, #FF6B9D, #CE93D8, #81D4FA);
		border-radius: 50%;
		box-shadow: 0 0 40px rgba(255, 107, 157, 0.3);
	}

	.avatar-glow img {
		border: 3px solid #1A1B26;
	}

	.platform-badge {
		padding: 6px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(10px);
	}

	.platform-badge.github {
		background: rgba(255, 107, 157, 0.9);
		color: white;
	}

	.platform-badge.gitlab {
		background: rgba(255, 171, 145, 0.9);
		color: white;
	}

	.year-badge {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(20px);
		border-radius: 50px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.animate-slide-up {
		animation: slideUp 0.6s ease-out forwards;
		opacity: 0;
	}

	.animate-scale-in {
		animation: scaleIn 0.5s ease-out forwards;
		opacity: 0;
	}

	.animate-fade-in {
		animation: fadeIn 0.6s ease-out forwards;
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes scaleIn {
		from { opacity: 0; transform: scale(0.9); }
		to { opacity: 1; transform: scale(1); }
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
</style>
