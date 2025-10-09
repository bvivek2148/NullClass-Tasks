/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  safelist: [
    // Ensure all gradient and color classes are included
    'bg-gradient-to-br',
    'bg-gradient-to-r',
    'from-blue-500',
    'to-purple-600',
    'from-blue-600',
    'via-purple-600',
    'to-emerald-600',
    'from-orange-500',
    'to-orange-600',
    'from-green-500',
    'to-green-600',
    'from-purple-500',
    'to-purple-600',
    'from-red-500',
    'to-red-600',
    'from-yellow-500',
    'to-yellow-600',
    'hover:scale-105',
    'transform',
    'transition-transform',
  ],
}
