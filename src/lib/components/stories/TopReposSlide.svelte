<script lang="ts">
	import type { RepoStat } from '$lib/types';

	interface Props {
		repos: RepoStat[];
	}

	let { repos }: Props = $props();

	const topThree = $derived(repos.slice(0, 3));
	const medals = ['🥇', '🥈', '🥉'];
	const gradients = [
		'from-citypop-orange to-citypop-yellow',
		'from-citypop-sky to-citypop-lavender',
		'from-citypop-pink to-citypop-coral'
	];
</script>

<div class="repos-slide flex flex-col items-center justify-center max-w-lg mx-auto w-full">
	<p class="text-citypop-cream/60 text-xl mb-3 text-center animate-fade-in font-display">
		Your favorite projects
	</p>

	<h2 class="text-2xl md:text-3xl font-display font-bold mb-10 text-center animate-slide-up gradient-text" style="animation-delay: 0.1s">
		Top Repositories
	</h2>

	<!-- Podium-style display -->
	<div class="w-full space-y-4">
		{#each topThree as repo, i}
			<div
				class="repo-card animate-slide-up"
				style="animation-delay: {0.2 + i * 0.15}s"
			>
				<!-- Rank badge -->
				<div class="rank-medal">
					{medals[i]}
				</div>

				<!-- Repo info -->
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-2 mb-1">
						<h3 class="font-display font-semibold text-lg truncate text-citypop-cream">{repo.name}</h3>
						{#if repo.platform === 'github'}
							<svg class="w-4 h-4 text-citypop-pink" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
							</svg>
						{:else}
							<svg class="w-4 h-4 text-citypop-orange" viewBox="0 0 24 24" fill="currentColor">
								<path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
							</svg>
						{/if}
					</div>
					<p class="text-citypop-cream/50 text-sm">
						{repo.commits.toLocaleString()} commits
					</p>
				</div>

				<!-- Progress indicator -->
				<div class="commit-indicator">
					<div class="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
						<div
							class="h-full rounded-full bg-gradient-to-r {gradients[i]} animate-grow-width"
							style="--target-width: {(repo.commits / topThree[0].commits) * 100}%;"
						></div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if repos.length === 0}
		<p class="text-citypop-cream/40 text-center mt-8 animate-fade-in">
			Repository data unavailable
		</p>
	{/if}
</div>

<style>
	.repo-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 16px;
		transition: all 0.3s ease;
	}

	.repo-card:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 107, 157, 0.2);
		transform: translateX(4px);
	}

	.rank-medal {
		font-size: 1.5rem;
		min-width: 40px;
		text-align: center;
	}

	.animate-fade-in {
		animation: fadeIn 0.6s ease-out forwards;
		opacity: 0;
	}

	.animate-slide-up {
		animation: slideUp 0.6s ease-out forwards;
		opacity: 0;
	}

	.animate-grow-width {
		animation: growWidth 0.8s ease-out forwards;
		animation-delay: 0.6s;
		width: 0;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes growWidth {
		from { width: 0; }
		to { width: var(--target-width); }
	}
</style>
