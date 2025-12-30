<script lang="ts">
	import { page } from '$app/stores';

	// Check for error params
	const errorParam = $derived($page.url.searchParams.get('error'));

	const errorMessages: Record<string, string> = {
		github_auth_failed: 'GitHub authentication was cancelled or failed.',
		github_token_failed: 'Failed to get GitHub access token.',
		github_auth_error: 'An error occurred during GitHub authentication.',
		gitlab_auth_failed: 'GitLab authentication was cancelled or failed.',
		gitlab_token_failed: 'Failed to get GitLab access token.',
		gitlab_auth_error: 'An error occurred during GitLab authentication.'
	};

	const displayError = $derived(errorParam ? errorMessages[errorParam] || 'Authentication failed.' : null);
</script>

<svelte:head>
	<title>CodeRewind - Your 2025 Developer Year in Review</title>
	<meta name="description" content="See your GitHub and GitLab stats in a beautiful City Pop-style experience. Discover your commits, top languages, streaks, and developer personality." />
</svelte:head>

<div class="min-h-screen relative overflow-hidden">
	<!-- Floating background shapes -->
	<div class="floating-shapes">
		<div class="floating-shape shape-1"></div>
		<div class="floating-shape shape-2"></div>
		<div class="floating-shape shape-3"></div>
		<div class="floating-shape shape-4"></div>
	</div>

	<!-- Hero Section -->
	<div class="relative">
		<div class="max-w-4xl mx-auto px-6 py-24 md:py-36 text-center">
			<!-- Badge -->
			<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
				<span class="w-2 h-2 rounded-full bg-citypop-pink animate-pulse"></span>
				<span class="text-citypop-cream/80 text-sm font-medium">2025 Year in Review</span>
			</div>

			<!-- Logo/Brand -->
			<h1 class="text-5xl md:text-7xl font-display font-bold mb-6 animate-fade-in gradient-text">
				CodeRewind
			</h1>

			<!-- Decorative bar -->
			<div class="sunset-bar w-32 mx-auto mb-8 animate-scale-in"></div>

			<!-- Tagline -->
			<p class="text-xl md:text-2xl text-citypop-cream mb-4 animate-slide-up font-display" style="animation-delay: 0.1s">
				Your Developer Year in Review
			</p>

			<p class="text-lg text-citypop-cream/60 mb-12 max-w-xl mx-auto animate-slide-up" style="animation-delay: 0.2s">
				Discover your commits, languages, streaks, and unique developer personality in a beautiful visual journey.
			</p>

			<!-- Error message -->
			{#if displayError}
				<div class="glass border border-red-400/30 text-red-300 px-6 py-4 rounded-2xl mb-8 max-w-md mx-auto animate-fade-in">
					<span class="font-medium">{displayError}</span>
				</div>
			{/if}

			<!-- CTA Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style="animation-delay: 0.3s">
				<a href="/auth/github" class="btn-connect github group">
					<svg class="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
					</svg>
					<span>Connect GitHub</span>
				</a>

				<a href="/auth/gitlab" class="btn-connect gitlab group">
					<svg class="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
						<path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
					</svg>
					<span>Connect GitLab</span>
				</a>
			</div>

			<p class="text-citypop-cream/40 text-sm mt-8 animate-fade-in" style="animation-delay: 0.5s">
				Connect one or both platforms to see combined stats
			</p>
		</div>
	</div>

	<!-- Features Section -->
	<div class="max-w-5xl mx-auto px-6 py-24">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-display font-bold mb-4 sunset-text">
				What You'll Discover
			</h2>
			<p class="text-citypop-cream/60">Your year in code, beautifully visualized</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
			<div class="feature-card group">
				<div class="feature-icon bg-gradient-to-br from-citypop-pink to-citypop-coral">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="font-display font-semibold text-citypop-cream mb-2">Total Commits</h3>
				<p class="text-citypop-cream/50 text-sm">See how many commits you shipped across all projects</p>
			</div>

			<div class="feature-card group">
				<div class="feature-icon bg-gradient-to-br from-citypop-sky to-citypop-blue">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
					</svg>
				</div>
				<h3 class="font-display font-semibold text-citypop-cream mb-2">Top Languages</h3>
				<p class="text-citypop-cream/50 text-sm">Discover which languages dominated your coding time</p>
			</div>

			<div class="feature-card group">
				<div class="feature-icon bg-gradient-to-br from-citypop-orange to-citypop-yellow">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				</div>
				<h3 class="font-display font-semibold text-citypop-cream mb-2">Longest Streak</h3>
				<p class="text-citypop-cream/50 text-sm">Find out your longest contribution streak</p>
			</div>

			<div class="feature-card group">
				<div class="feature-icon bg-gradient-to-br from-citypop-purple to-citypop-lavender">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="font-display font-semibold text-citypop-cream mb-2">Dev Personality</h3>
				<p class="text-citypop-cream/50 text-sm">Get your unique developer personality type</p>
			</div>
		</div>
	</div>

	<!-- Preview Section -->
	<div class="max-w-4xl mx-auto px-6 py-24">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-display font-bold mb-4 gradient-text">
				Your Journey Awaits
			</h2>
			<p class="text-citypop-cream/60">Navigate through your stats like flipping through memories</p>
		</div>

		<div class="flex justify-center gap-3 flex-wrap">
			{#each [
				{ icon: '1', label: 'Intro', color: 'from-citypop-pink to-citypop-coral' },
				{ icon: '2', label: 'Commits', color: 'from-citypop-coral to-citypop-orange' },
				{ icon: '3', label: 'Languages', color: 'from-citypop-orange to-citypop-yellow' },
				{ icon: '4', label: 'Repos', color: 'from-citypop-yellow to-citypop-mint' },
				{ icon: '5', label: 'Streak', color: 'from-citypop-mint to-citypop-sky' },
				{ icon: '6', label: 'Time', color: 'from-citypop-sky to-citypop-lavender' },
				{ icon: '7', label: 'Type', color: 'from-citypop-lavender to-citypop-purple' },
				{ icon: '8', label: 'Share', color: 'from-citypop-purple to-citypop-pink' }
			] as item}
				<div class="preview-card">
					<div class="preview-number bg-gradient-to-br {item.color}">{item.icon}</div>
					<p class="text-xs mt-2 text-citypop-cream/70 font-medium">{item.label}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Footer -->
	<footer class="border-t border-white/5 py-12 px-6 mt-8">
		<div class="max-w-4xl mx-auto text-center">
			<p class="text-citypop-cream/40 text-sm">
				Made with <span class="text-citypop-pink">&#10084;</span> · Your data stays private - we only read public contribution data
			</p>
			<p class="text-citypop-cream/20 text-xs mt-4 font-mono">
				CodeRewind v2025
			</p>
		</div>
	</footer>
</div>

<style>
	/* Floating background shapes */
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
		width: 400px;
		height: 400px;
		background: linear-gradient(135deg, #FF6B9D, #CE93D8);
		top: -100px;
		right: -100px;
		animation: float 8s ease-in-out infinite;
	}

	.shape-2 {
		width: 300px;
		height: 300px;
		background: linear-gradient(135deg, #81D4FA, #80CBC4);
		bottom: 20%;
		left: -50px;
		animation: float 10s ease-in-out infinite reverse;
	}

	.shape-3 {
		width: 250px;
		height: 250px;
		background: linear-gradient(135deg, #FFAB91, #FFE082);
		top: 40%;
		right: 10%;
		animation: float 12s ease-in-out infinite;
	}

	.shape-4 {
		width: 200px;
		height: 200px;
		background: linear-gradient(135deg, #B39DDB, #81D4FA);
		bottom: 10%;
		right: 30%;
		animation: float 9s ease-in-out infinite reverse;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0) rotate(0deg); }
		50% { transform: translateY(-30px) rotate(5deg); }
	}

	/* Connect buttons */
	.btn-connect {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.95rem;
		border-radius: 50px;
		transition: all 0.3s ease;
		border: none;
	}

	.btn-connect.github {
		background: linear-gradient(135deg, #FF6B9D, #FF8A80);
		color: white;
		box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
	}

	.btn-connect.github:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 30px rgba(255, 107, 157, 0.4);
	}

	.btn-connect.gitlab {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		color: var(--color-citypop-cream);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.btn-connect.gitlab:hover {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(255, 107, 157, 0.5);
		transform: translateY(-3px);
	}

	/* Feature cards */
	.feature-card {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(20px);
		border-radius: 20px;
		padding: 2rem 1.5rem;
		text-align: center;
		transition: all 0.3s ease;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.feature-card:hover {
		transform: translateY(-5px);
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 107, 157, 0.3);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
	}

	.feature-icon {
		width: 56px;
		height: 56px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 1rem;
		transition: transform 0.3s ease;
	}

	.feature-card:hover .feature-icon {
		transform: scale(1.1);
	}

	/* Preview cards */
	.preview-card {
		width: 80px;
		height: 100px;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.preview-card:hover {
		transform: translateY(-8px);
		border-color: rgba(255, 107, 157, 0.4);
		box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
	}

	.preview-number {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-display);
		font-weight: 700;
		color: white;
		font-size: 1rem;
	}

	/* Animations */
	.animate-fade-in {
		animation: fadeIn 0.6s ease-out forwards;
		opacity: 0;
	}

	.animate-slide-up {
		animation: slideUp 0.6s ease-out forwards;
		opacity: 0;
	}

	.animate-scale-in {
		animation: scaleIn 0.4s ease-out forwards;
		opacity: 0;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes scaleIn {
		from { opacity: 0; transform: scale(0.8); }
		to { opacity: 1; transform: scale(1); }
	}
</style>
