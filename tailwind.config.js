/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for Creastilo brand
        primary: {
          50: '#e0f7ff',
          100: '#b3eaff',
          200: '#80ddff',
          300: '#4dd0ff',
          400: '#26c5ff',
          500: '#40d4f7', // Main cyan
          600: '#00a8e8',
          700: '#007bb5',
          800: '#005582',
          900: '#003050',
        },
        secondary: {
          50: '#f5e6ff',
          100: '#e6b3ff',
          200: '#d780ff',
          300: '#c84dff',
          400: '#bb26ff',
          500: '#8b5cf6', // Main purple
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          pink: '#ec4899',
          green: '#22c55e',
          yellow: '#fbbf24',
        },
        dark: {
          bg: '#030014',
          card: '#0f1423',
          panel: '#151c2f',
          hover: '#1a2332',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(64, 212, 247, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'slide-in-from-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        }
      }
    },
  },
  plugins: [],
}
