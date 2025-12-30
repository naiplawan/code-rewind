/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// City Pop palette - soft, warm, nostalgic
				citypop: {
					// Primary sunset/sky colors
					pink: '#FF6B9D',
					coral: '#FF8A80',
					peach: '#FFAB91',
					orange: '#FFCC80',
					yellow: '#FFE082',

					// Sky and water
					sky: '#81D4FA',
					blue: '#90CAF9',
					lavender: '#B39DDB',
					purple: '#CE93D8',

					// Neutral/base
					cream: '#FFF8E7',
					sand: '#F5E6D3',
					warm: '#FFEFD5',

					// Accents
					mint: '#A5D6A7',
					teal: '#80CBC4',

					// Dark tones (for text/contrast)
					navy: '#2D3A4F',
					dark: '#1E2832',
					charcoal: '#37474F'
				},
				// Keep accent for compatibility
				accent: {
					green: '#A5D6A7',
					purple: '#CE93D8',
					blue: '#81D4FA',
					orange: '#FFAB91',
					pink: '#FF6B9D'
				},
				// Dark backgrounds with warm tint
				dark: {
					DEFAULT: '#1A1B26',
					card: '#232536',
					lighter: '#2E3047'
				}
			},
			fontFamily: {
				// Clean, elegant fonts for City Pop
				display: ['Outfit', 'system-ui', 'sans-serif'],
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace']
			},
			animation: {
				'fade-in': 'fadeIn 0.6s ease-out',
				'slide-up': 'slideUp 0.6s ease-out',
				'scale-in': 'scaleIn 0.4s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'gradient': 'gradient 8s ease infinite',
				'glow-pulse': 'glowPulse 3s ease-in-out infinite'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				scaleIn: {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				gradient: {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				glowPulse: {
					'0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 157, 0.3)' },
					'50%': { boxShadow: '0 0 40px rgba(255, 107, 157, 0.5)' }
				}
			},
			backgroundImage: {
				'sunset-gradient': 'linear-gradient(135deg, #FF6B9D 0%, #FFAB91 25%, #FFE082 50%, #81D4FA 75%, #B39DDB 100%)',
				'sky-gradient': 'linear-gradient(180deg, #81D4FA 0%, #FF6B9D 50%, #FFAB91 100%)',
				'warm-gradient': 'linear-gradient(135deg, #FF6B9D 0%, #CE93D8 50%, #81D4FA 100%)'
			},
			boxShadow: {
				'glow-pink': '0 0 20px rgba(255, 107, 157, 0.4)',
				'glow-blue': '0 0 20px rgba(129, 212, 250, 0.4)',
				'glow-purple': '0 0 20px rgba(206, 147, 216, 0.4)',
				'soft': '0 4px 20px rgba(0, 0, 0, 0.1)',
				'card': '0 8px 32px rgba(0, 0, 0, 0.12)'
			}
		}
	},
	plugins: []
};
