<script lang="ts">
	import { onMount } from 'svelte';
	import type { UserStats, User } from '$lib/types';
	import StoryContainer from '$lib/components/stories/StoryContainer.svelte';
	import IntroSlide from '$lib/components/stories/IntroSlide.svelte';
	import CommitsSlide from '$lib/components/stories/CommitsSlide.svelte';
	import LanguagesSlide from '$lib/components/stories/LanguagesSlide.svelte';
	import TopReposSlide from '$lib/components/stories/TopReposSlide.svelte';
	import StreakSlide from '$lib/components/stories/StreakSlide.svelte';
	import ProductivitySlide from '$lib/components/stories/ProductivitySlide.svelte';
	import PersonalitySlide from '$lib/components/stories/PersonalitySlide.svelte';
	import SummarySlide from '$lib/components/stories/SummarySlide.svelte';

	let stats: UserStats | null = $state(null);
	let githubUser: User | null = $state(null);
	let gitlabUser: User | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let currentSlide = $state(0);

	const totalSlides = 8;

	onMount(async () => {
		try {
			const response = await fetch('/api/stats');
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch stats');
			}

			stats = data.stats;
			githubUser = data.users?.github;
			gitlabUser = data.users?.gitlab;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Something went wrong';
		} finally {
			loading = false;
		}
	});

	const primaryUser = $derived(githubUser || gitlabUser);
</script>

<svelte:head>
	<title>Your 2025 CodeRewind | {primaryUser?.name || 'Developer'}</title>
</svelte:head>

{#if loading}
	<div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
		<!-- Floating background shapes -->
		<div class="floating-shapes">
			<div class="floating-shape shape-1"></div>
			<div class="floating-shape shape-2"></div>
		</div>

		<!-- Loading content -->
		<div class="loading-card animate-fade-in">
			<div class="loader-ring mb-6">
				<div class="loader-inner"></div>
			</div>
			<h2 class="text-2xl font-display font-bold gradient-text mb-2">Loading your story</h2>
			<p class="text-citypop-cream/60">Analyzing your 2025 journey...</p>
		</div>

		<!-- Progress bar -->
		<div class="progress-container animate-fade-in" style="animation-delay: 0.3s">
			<div class="progress-bar-loading"></div>
		</div>
	</div>
{:else if error}
	<div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6">
		<!-- Floating background shapes -->
		<div class="floating-shapes">
			<div class="floating-shape shape-1"></div>
			<div class="floating-shape shape-2"></div>
		</div>

		<!-- Error card -->
		<div class="error-card animate-fade-in">
			<div class="error-icon mb-4">
				<svg class="w-12 h-12 text-citypop-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
			</div>
			<h2 class="text-xl font-display font-bold text-citypop-cream mb-2">Something went wrong</h2>
			<p class="text-citypop-cream/60 mb-6 text-center">{error}</p>
			<a href="/" class="btn-primary">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				<span>Return Home</span>
			</a>
		</div>
	</div>
{:else if stats}
	<StoryContainer {totalSlides} bind:currentSlide>
		{#if currentSlide === 0}
			<IntroSlide {githubUser} {gitlabUser} />
		{:else if currentSlide === 1}
			<CommitsSlide
				totalCommits={stats.totalCommits}
				githubCommits={stats.githubStats?.commits}
				gitlabCommits={stats.gitlabStats?.commits}
			/>
		{:else if currentSlide === 2}
			<LanguagesSlide languages={stats.topLanguages} />
		{:else if currentSlide === 3}
			<TopReposSlide repos={stats.topRepos} />
		{:else if currentSlide === 4}
			<StreakSlide
				longestStreak={stats.longestStreak}
				longestStreakStart={stats.longestStreakStart}
				longestStreakEnd={stats.longestStreakEnd}
				currentStreak={stats.currentStreak}
			/>
		{:else if currentSlide === 5}
			<ProductivitySlide
				mostProductiveDay={stats.mostProductiveDay}
				mostProductiveHour={stats.mostProductiveHour}
			/>
		{:else if currentSlide === 6}
			<PersonalitySlide personality={stats.personality} />
		{:else if currentSlide === 7}
			<SummarySlide {stats} user={primaryUser} />
		{/if}
	</StoryContainer>
{/if}

<style>
	.floating-shapes {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.floating-shape {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.4;
	}

	.shape-1 {
		width: 300px;
		height: 300px;
		background: linear-gradient(135deg, #FF6B9D, #CE93D8);
		top: 20%;
		right: -50px;
		animation: float 8s ease-in-out infinite;
	}

	.shape-2 {
		width: 250px;
		height: 250px;
		background: linear-gradient(135deg, #81D4FA, #80CBC4);
		bottom: 20%;
		left: -30px;
		animation: float 10s ease-in-out infinite reverse;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-20px); }
	}

	.loading-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 2rem;
	}

	.loader-ring {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: linear-gradient(135deg, #FF6B9D, #CE93D8, #81D4FA);
		padding: 3px;
		animation: spin 1.5s linear infinite;
	}

	.loader-inner {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: #1A1B26;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	.progress-container {
		width: 200px;
		height: 4px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 2px;
		overflow: hidden;
		margin-top: 2rem;
	}

	.progress-bar-loading {
		height: 100%;
		background: linear-gradient(90deg, #FF6B9D, #CE93D8, #81D4FA);
		border-radius: 2px;
		animation: loading 2s ease-in-out infinite;
	}

	@keyframes loading {
		0% { width: 0%; transform: translateX(0); }
		50% { width: 70%; }
		100% { width: 100%; transform: translateX(0); }
	}

	.error-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 2.5rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 24px;
		max-width: 400px;
		width: 100%;
	}

	.error-icon {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: rgba(255, 138, 128, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-primary {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1.5rem;
		background: linear-gradient(135deg, #FF6B9D, #FF8A80);
		color: white;
		border-radius: 50px;
		font-family: var(--font-display);
		font-weight: 600;
		transition: all 0.3s ease;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(255, 107, 157, 0.3);
	}

	.animate-fade-in {
		animation: fadeIn 0.6s ease-out forwards;
		opacity: 0;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
