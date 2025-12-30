<script lang="ts">
	import type { UserStats, User } from '$lib/types';
	import { toPng } from 'html-to-image';

	interface Props {
		stats: UserStats;
		user: User | null;
	}

	let { stats, user }: Props = $props();

	let cardElement: HTMLDivElement;
	let isDownloading = $state(false);
	let copySuccess = $state(false);

	async function downloadCard() {
		if (!cardElement || isDownloading) return;

		isDownloading = true;
		try {
			const dataUrl = await toPng(cardElement, {
				quality: 1,
				pixelRatio: 2,
				backgroundColor: '#1A1B26'
			});

			const link = document.createElement('a');
			link.download = `coderewind-2025-${user?.username || 'dev'}.png`;
			link.href = dataUrl;
			link.click();
		} catch (error) {
			console.error('Failed to generate image:', error);
		} finally {
			isDownloading = false;
		}
	}

	async function copyToClipboard() {
		if (!cardElement) return;

		try {
			const dataUrl = await toPng(cardElement, {
				quality: 1,
				pixelRatio: 2,
				backgroundColor: '#1A1B26'
			});

			const blob = await (await fetch(dataUrl)).blob();
			await navigator.clipboard.write([
				new ClipboardItem({ 'image/png': blob })
			]);

			copySuccess = true;
			setTimeout(() => (copySuccess = false), 2000);
		} catch (error) {
			console.error('Failed to copy:', error);
		}
	}

	function shareToTwitter() {
		const text = `My 2025 CodeRewind:\n${stats.totalCommits.toLocaleString()} commits\nTop lang: ${stats.topLanguages[0]?.name || 'Code'}\n${stats.longestStreak} day streak\n${stats.personality.title}\n\nGet yours at coderewind.dev`;
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
		window.open(url, '_blank');
	}

	function shareToLinkedIn() {
		const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://coderewind.dev')}`;
		window.open(url, '_blank');
	}
</script>

<div class="summary-slide flex flex-col items-center justify-center max-w-lg mx-auto w-full">
	<p class="text-citypop-cream/60 text-xl mb-6 text-center animate-fade-in font-display">
		Your 2025 in Review
	</p>

	<!-- Shareable Card -->
	<div
		bind:this={cardElement}
		class="summary-card animate-scale-in"
		style="animation-delay: 0.2s"
	>
		<!-- Header -->
		<div class="card-header">
			{#if user?.avatarUrl}
				<img src={user.avatarUrl} alt={user.name} class="avatar" />
			{/if}
			<div class="user-info">
				<p class="font-display font-semibold text-citypop-cream">{user?.name || 'Developer'}</p>
				<p class="text-citypop-cream/50 text-sm">@{user?.username}</p>
			</div>
			<div class="year-badge">
				<span class="text-citypop-pink font-display font-bold">2025</span>
			</div>
		</div>

		<!-- Stats grid -->
		<div class="stats-grid">
			<div class="stat-box">
				<p class="stat-value gradient-text">{stats.totalCommits.toLocaleString()}</p>
				<p class="stat-label">Commits</p>
			</div>
			<div class="stat-box">
				<p class="stat-value text-citypop-sky">{stats.longestStreak}</p>
				<p class="stat-label">Day Streak</p>
			</div>
			<div class="stat-box">
				<p class="stat-value text-citypop-lavender">{stats.totalPRs}</p>
				<p class="stat-label">PRs</p>
			</div>
			<div class="stat-box">
				<p class="stat-value text-citypop-orange text-xl">{stats.topLanguages[0]?.name || '-'}</p>
				<p class="stat-label">Top Lang</p>
			</div>
		</div>

		<!-- Personality badge -->
		<div class="personality-badge">
			<span class="text-2xl">{stats.personality.icon}</span>
			<span class="font-display font-semibold text-citypop-cream">{stats.personality.title}</span>
		</div>

		<!-- Branding -->
		<p class="text-center text-citypop-cream/30 text-xs mt-4">coderewind.dev</p>
	</div>

	<!-- Action buttons -->
	<div class="actions-grid animate-slide-up" style="animation-delay: 0.5s">
		<button onclick={downloadCard} disabled={isDownloading} class="action-btn primary">
			{#if isDownloading}
				<span class="animate-pulse">...</span>
			{:else}
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
				</svg>
			{/if}
			<span>Download</span>
		</button>

		<button onclick={copyToClipboard} class="action-btn secondary">
			{#if copySuccess}
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			{:else}
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
				</svg>
			{/if}
			<span>{copySuccess ? 'Copied!' : 'Copy'}</span>
		</button>

		<button onclick={shareToTwitter} class="action-btn secondary">
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
				<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
			</svg>
			<span>Share</span>
		</button>

		<button onclick={shareToLinkedIn} class="action-btn secondary">
			<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
				<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
			</svg>
			<span>LinkedIn</span>
		</button>
	</div>
</div>

<style>
	.summary-card {
		padding: 1.5rem;
		background: linear-gradient(135deg, rgba(35, 37, 54, 0.95), rgba(26, 27, 38, 0.95));
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 24px;
		width: 100%;
		backdrop-filter: blur(20px);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		margin-bottom: 1rem;
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 2px solid rgba(255, 107, 157, 0.5);
	}

	.user-info {
		flex: 1;
	}

	.year-badge {
		padding: 0.25rem 0.75rem;
		background: rgba(255, 107, 157, 0.1);
		border-radius: 50px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.stat-box {
		padding: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 16px;
		text-align: center;
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 1;
		margin-bottom: 0.25rem;
	}

	.stat-label {
		font-size: 0.75rem;
		color: rgba(255, 248, 231, 0.5);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.personality-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(206, 147, 216, 0.1));
		border-radius: 12px;
	}

	.actions-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
		margin-top: 1.5rem;
		width: 100%;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.875rem 1rem;
		border-radius: 12px;
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.875rem;
		transition: all 0.3s ease;
		border: none;
	}

	.action-btn.primary {
		background: linear-gradient(135deg, #FF6B9D, #FF8A80);
		color: white;
	}

	.action-btn.primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(255, 107, 157, 0.3);
	}

	.action-btn.secondary {
		background: rgba(255, 255, 255, 0.05);
		color: var(--color-citypop-cream);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.action-btn.secondary:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 107, 157, 0.3);
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.animate-fade-in {
		animation: fadeIn 0.6s ease-out forwards;
		opacity: 0;
	}

	.animate-scale-in {
		animation: scaleIn 0.6s ease-out forwards;
		opacity: 0;
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
		from { transform: scale(0.9); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
