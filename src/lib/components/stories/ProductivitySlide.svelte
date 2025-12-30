<script lang="ts">
	import { formatHour } from '$lib/services/analytics';

	interface Props {
		mostProductiveDay: string;
		mostProductiveHour: number;
	}

	let { mostProductiveDay, mostProductiveHour }: Props = $props();

	const dayEmojis: Record<string, string> = {
		Sunday: '🌅',
		Monday: '💪',
		Tuesday: '🚀',
		Wednesday: '⚡',
		Thursday: '🔥',
		Friday: '🎉',
		Saturday: '✨'
	};

	function getTimeOfDay(hour: number): { label: string; icon: string } {
		if (hour >= 5 && hour < 12) return { label: 'Morning Coder', icon: '🌅' };
		if (hour >= 12 && hour < 17) return { label: 'Afternoon Warrior', icon: '☀️' };
		if (hour >= 17 && hour < 21) return { label: 'Evening Hacker', icon: '🌆' };
		return { label: 'Night Owl', icon: '🌙' };
	}

	const timeInfo = $derived(getTimeOfDay(mostProductiveHour));
</script>

<div class="productivity-slide flex flex-col items-center justify-center text-center max-w-lg mx-auto">
	<p class="text-citypop-cream/60 text-xl mb-8 animate-fade-in font-display">
		When you code best
	</p>

	<!-- Day card -->
	<div class="stat-card w-full animate-slide-up" style="animation-delay: 0.1s">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-citypop-cream/50 text-sm mb-1">Most productive day</p>
				<p class="text-2xl font-display font-bold text-citypop-cream">{mostProductiveDay}</p>
			</div>
			<div class="stat-icon day">
				<span class="text-3xl">{dayEmojis[mostProductiveDay] || '📅'}</span>
			</div>
		</div>
	</div>

	<!-- Time card -->
	<div class="stat-card w-full animate-slide-up" style="animation-delay: 0.3s">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-citypop-cream/50 text-sm mb-1">Peak coding hour</p>
				<p class="text-2xl font-display font-bold text-citypop-cream">{formatHour(mostProductiveHour)}</p>
				<p class="text-citypop-lavender text-sm mt-1">{timeInfo.label}</p>
			</div>
			<div class="stat-icon time">
				<span class="text-3xl">{timeInfo.icon}</span>
			</div>
		</div>
	</div>

	<!-- Fun message -->
	<div class="insight-badge animate-fade-in" style="animation-delay: 0.5s">
		{#if mostProductiveHour >= 22 || mostProductiveHour <= 4}
			<span class="text-xl">🌙</span>
			<span class="text-citypop-cream">Best code written at midnight</span>
		{:else if mostProductiveDay === 'Saturday' || mostProductiveDay === 'Sunday'}
			<span class="text-xl">🎮</span>
			<span class="text-citypop-cream">Weekend warrior mode</span>
		{:else}
			<span class="text-xl">⚡</span>
			<span class="text-citypop-cream">You've found your rhythm</span>
		{/if}
	</div>
</div>

<style>
	.stat-card {
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 20px;
		margin-bottom: 1rem;
	}

	.stat-icon {
		width: 64px;
		height: 64px;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.stat-icon.day {
		background: linear-gradient(135deg, rgba(129, 212, 250, 0.2), rgba(128, 203, 196, 0.2));
	}

	.stat-icon.time {
		background: linear-gradient(135deg, rgba(206, 147, 216, 0.2), rgba(179, 157, 219, 0.2));
	}

	.insight-badge {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(206, 147, 216, 0.1));
		border: 1px solid rgba(255, 107, 157, 0.2);
		border-radius: 50px;
		margin-top: 1.5rem;
	}

	.animate-fade-in {
		animation: fadeIn 0.6s ease-out forwards;
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

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
