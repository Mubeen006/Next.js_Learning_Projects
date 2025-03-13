/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0)', opacity: 1 },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: 0 }
        },
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: 0.5 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(-100vh)', opacity: 0 }
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 }
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      },
      animation: {
        'confetti': 'confetti 5s linear forwards',
        'float-up': 'float-up 8s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.7s ease-out forwards',
        'pulse-slow': 'pulse-slow 3s infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite'
      },
      transitionDuration: {
        '3000': '3000ms',
      }
    },
  },
  plugins: [],
};
