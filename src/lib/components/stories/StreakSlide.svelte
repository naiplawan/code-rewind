<script lang="ts">
	import AnimatedNumber from '$lib/components/ui/AnimatedNumber.svelte';

	interface Props {
		longestStreak: number;
		longestStreakStart: string;
		longestStreakEnd: string;
		currentStreak: number;
	}

	let { longestStreak, longestStreakStart, longestStreakEnd, currentStreak }: Props = $props();

	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	function getStreakMessage(days: number): { message: string; icon: string } {
		if (days > 100) return { message: "Legendary Status", icon: "👑" };
		if (days > 60) return { message: "Unstoppable Force", icon: "🔥" };
		if (days > 30) return { message: "Monthly Momentum", icon: "💪" };
		if (days > 14) return { message: "Two Week Warrior", icon: "⚡" };
		if (days > 7) return { message: "Week Dominator", icon: "🌟" };
		if (days > 0) return { message: "Streak Started", icon: "✨" };
		return { message: "Ready to Begin", icon: "🎯" };
	}

	const streakInfo = $derived(getStreakMessage(longestStreak));
</script>

<div class="streak-slide flex flex-col items-center justify-center text-center max-w-lg mx-auto">
	<p class="text-citypop-cream/60 text-xl mb-4 animate-fade-in font-display">
		Your longest streak
	</p>

	<!-- Flame visualization -->
	<div class="flame-ring mb-6 animate-scale-in" style="animation-delay: 0.2s">
		<div class="flame-inner">
			<span class="text-5xl">🔥</span>
		</div>
	</div>

	<!-- Big number -->
	<div class="text-7xl md:text-8xl font-display font-bold mb-2 animate-scale-in sunset-text" style="animation-delay: 0.3s">
		<AnimatedNumber value={longestStreak} />
	</div>

	<p class="text-2xl md:text-3xl font-display font-semibold mb-4 animate-slide-up text-citypop-cream" style="animation-delay: 0.4s">
		days
	</p>

	<!-- Date range -->
	{#if longestStreakStart && longestStreakEnd}
		<p class="text-citypop-cream/50 mb-8 animate-fade-in" style="animation-delay: 0.5s">
			{formatDate(longestStreakStart)} - {formatDate(longestStreakEnd)}
		</p>
	{/if}

	<!-- Achievement badge -->
	<div class="achievement-badge animate-fade-in" style="animation-delay: 0.6s">
		<span class="text-2xl">{streakInfo.icon}</span>
		<span class="font-display font-semibold text-citypop-cream">{streakInfo.message}</span>
	</div>

	<!-- Current streak -->
	{#if currentStreak > 0}
		<div class="current-streak animate-slide-up" style="animation-delay: 0.7s">
			<div class="flex items-center gap-2">
				<span class="text-citypop-mint">Current streak:</span>
				<span class="font-display font-bold text-citypop-mint text-xl">{currentStreak} days</span>
				<span class="w-2 h-2 rounded-full bg-citypop-mint animate-pulse"></span>
			</div>
		</div>
	{/if}
</div>

<style>
	.flame-ring {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		background: linear-gradient(135deg, rgba(255, 204, 128, 0.2), rgba(255, 138, 128, 0.2));
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.flame-ring::before {
		content: '';
		position: absolute;
		inset: -3px;
		border-radius: 50%;
		background: linear-gradient(135deg, #FFCC80, #FF8A80, #FF6B9D);
		z-index: -1;
		opacity: 0.5;
		animation: pulse 2s ease-in-out infinite;
	}

	.flame-inner {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: rgba(26, 27, 38, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.5; transform: scale(1); }
		50% { opacity: 0.8; transform: scale(1.05); }
	}

	.achievement-badge {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, rgba(255, 204, 128, 0.1), rgba(255, 138, 128, 0.1));
		border: 1px solid rgba(255, 204, 128, 0.2);
		border-radius: 50px;
		margin-bottom: 1.5rem;
	}

	.current-streak {
		padding: 0.75rem 1.25rem;
		background: rgba(165, 214, 167, 0.1);
		border: 1px solid rgba(165, 214, 167, 0.2);
		border-radius: 50px;
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
		from { transform: scale(0.5); opacity: 0; }
		to { transform: scale(1); opacity: 1; }
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
