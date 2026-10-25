/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#FFFFFF',
        bg: '#141218',
        surface: '#221F2B',
        deep: '#1A1723',
        line: '#332E3F',
        muted: '#A9A1BC',
        primary: '#9E7FFF',
        secondary: '#38bdf8',
        accent: '#f472b6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        sand: '#E4C88A',
        olive: '#93A97E',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'Tajawal', 'system-ui', 'sans-serif'],
        display: ['Tajawal', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      spacing: {
        13: '3.25rem',
        18: '4.5rem',
      },
      boxShadow: {
        glow: '0 18px 60px -18px rgba(158,127,255,0.6)',
        'glow-sm': '0 10px 30px -12px rgba(158,127,255,0.5)',
        card: '0 30px 80px -40px rgba(0,0,0,0.95)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        brand: 'linear-gradient(-120deg, #9E7FFF 0%, #38bdf8 55%, #f472b6 100%)',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-14px,0)' },
        },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(3%,-4%,0) scale(1.06)' },
          '66%': { transform: 'translate3d(-3%,3%,0) scale(0.97)' },
        },
        sheen: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        popin: {
          '0%': { opacity: '0', transform: 'translateY(14px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        floaty: 'floaty 7s ease-in-out infinite',
        drift: 'drift 22s ease-in-out infinite',
        sheen: 'sheen 2.6s ease-in-out infinite',
        popin: 'popin 0.45s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};
