<script lang="ts">
	import type { LanguageStat } from '$lib/types';

	interface Props {
		languages: LanguageStat[];
	}

	let { languages }: Props = $props();

	// Get top language message
	function getLanguageMessage(topLang: LanguageStat | undefined): { message: string; icon: string } {
		if (!topLang) return { message: "Exploring the code universe", icon: "🌌" };

		const messages: Record<string, { message: string; icon: string }> = {
			JavaScript: { message: "Web Master", icon: "🌐" },
			TypeScript: { message: "Type Safety Champion", icon: "🛡️" },
			Python: { message: "Pythonic Power", icon: "🐍" },
			Java: { message: "Enterprise Grade", icon: "☕" },
			Go: { message: "Speed & Simplicity", icon: "🚀" },
			Rust: { message: "Memory Safe Warrior", icon: "🦀" },
			'C++': { message: "Performance Master", icon: "⚡" },
			Ruby: { message: "Developer Happiness", icon: "💎" },
			PHP: { message: "Web Backbone", icon: "🐘" },
			Swift: { message: "Apple Certified", icon: "🍎" },
			Kotlin: { message: "Modern Android", icon: "📱" },
			Svelte: { message: "Compiler Magic", icon: "✨" }
		};

		return messages[topLang.name] || { message: `${topLang.name} Master`, icon: "💻" };
	}

	const topLangInfo = $derived(getLanguageMessage(languages[0]));
</script>

<div class="languages-slide flex flex-col items-center justify-center max-w-lg mx-auto w-full">
	<p class="text-citypop-cream/60 text-xl mb-3 text-center animate-fade-in font-display">
		Your top languages
	</p>

	<div class="flex items-center gap-3 mb-10 animate-slide-up" style="animation-delay: 0.1s">
		<span class="text-3xl">{topLangInfo.icon}</span>
		<h2 class="text-2xl md:text-3xl font-display font-bold sunset-text">
			{topLangInfo.message}
		</h2>
	</div>

	<!-- Language bars -->
	<div class="w-full space-y-4">
		{#each languages as lang, i}
			<div
				class="language-item animate-slide-up"
				style="animation-delay: {0.2 + i * 0.1}s"
			>
				<div class="flex justify-between items-center mb-2">
					<div class="flex items-center gap-3">
						<div class="rank-number">{i + 1}</div>
						<span class="font-display font-semibold text-citypop-cream">{lang.name}</span>
					</div>
					<span class="text-citypop-cream/70 font-medium">{lang.percentage}%</span>
				</div>
				<div class="h-2 bg-white/5 rounded-full overflow-hidden">
					<div
						class="h-full rounded-full transition-all duration-1000 ease-out animate-grow-width"
						style="background: {lang.color}; --target-width: {lang.percentage}%;"
					></div>
				</div>
			</div>
		{/each}
	</div>

	{#if languages.length === 0}
		<p class="text-citypop-cream/40 text-center mt-8">
			Language data unavailable
		</p>
	{/if}
</div>

<style>
	.language-item {
		padding: 1rem 1.25rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.rank-number {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #FF6B9D, #CE93D8);
		border-radius: 8px;
		font-size: 0.75rem;
		font-weight: 600;
		color: white;
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
		animation: growWidth 1s ease-out forwards;
		animation-delay: 0.5s;
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
