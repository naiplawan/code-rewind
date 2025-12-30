<script lang="ts">
	import AnimatedNumber from '$lib/components/ui/AnimatedNumber.svelte';

	interface Props {
		totalCommits: number;
		githubCommits?: number;
		gitlabCommits?: number;
	}

	let { totalCommits, githubCommits = 0, gitlabCommits = 0 }: Props = $props();

	// Fun comparisons based on commit count
	function getComparison(commits: number): { title: string; icon: string } {
		if (commits > 2000) return { title: "Commit Legend", icon: "🏆" };
		if (commits > 1000) return { title: "Coding Machine", icon: "⚡" };
		if (commits > 500) return { title: "Senior Pusher", icon: "🚀" };
		if (commits > 200) return { title: "Consistent Coder", icon: "💪" };
		if (commits > 100) return { title: "Quality Shipper", icon: "✨" };
		return { title: "Every Commit Counts", icon: "🌟" };
	}

	const comparison = $derived(getComparison(totalCommits));
</script>

<div class="commits-slide flex flex-col items-center justify-center text-center max-w-lg mx-auto">
	<p class="text-citypop-cream/60 text-xl mb-6 animate-fade-in font-display">
		In 2025, you pushed
	</p>

	<div class="commit-display text-7xl md:text-8xl font-display font-bold gradient-text mb-2 animate-scale-in">
		<AnimatedNumber value={totalCommits} />
	</div>

	<p class="text-3xl md:text-4xl font-display font-semibold mb-10 animate-slide-up text-citypop-cream" style="animation-delay: 0.2s">
		commits
	</p>

	<!-- Platform breakdown -->
	{#if githubCommits > 0 || gitlabCommits > 0}
		<div class="flex gap-4 mb-10 animate-fade-in" style="animation-delay: 0.4s">
			{#if githubCommits > 0}
				<div class="platform-stat">
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
					</svg>
					<span class="font-semibold">{githubCommits.toLocaleString()}</span>
				</div>
			{/if}
			{#if gitlabCommits > 0}
				<div class="platform-stat gitlab">
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
						<path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
					</svg>
					<span class="font-semibold">{gitlabCommits.toLocaleString()}</span>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Achievement badge -->
	<div class="achievement-badge animate-fade-in" style="animation-delay: 0.6s">
		<span class="text-2xl">{comparison.icon}</span>
		<span class="font-display font-semibold text-citypop-cream">{comparison.title}</span>
	</div>
</div>

<style>
	.platform-stat {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background: rgba(255, 107, 157, 0.1);
		border: 1px solid rgba(255, 107, 157, 0.2);
		border-radius: 50px;
		color: #FF6B9D;
	}

	.platform-stat.gitlab {
		background: rgba(255, 171, 145, 0.1);
		border-color: rgba(255, 171, 145, 0.2);
		color: #FFAB91;
	}

	.achievement-badge {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, rgba(255, 204, 128, 0.1), rgba(255, 171, 145, 0.1));
		border: 1px solid rgba(255, 204, 128, 0.2);
		border-radius: 16px;
	}

	.animate-fade-in {
		animation: fadeIn 0.6s ease-out forwards;
		opacity: 0;
	}

	.animate-scale-in {
		animation: scaleIn 0.6s ease-out forwards;
	}

	.animate-slide-up {
		animation: slideUp 0.6s ease-out forwards;
		opacity: 0;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes scaleIn {
		from { transform: scale(0.5); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
