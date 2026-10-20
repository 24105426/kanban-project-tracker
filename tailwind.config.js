/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Tweak in M6 (tag-style) and M8 (due-tint)
        feature: '#10B981', // emerald
        bug: '#DC2626',     // crimson
        // Pastel colours
        brand: {
          primary: '#F6E6A8',
          accent: '#DDD1F3',
        },
        surface: {
          page: '#FFFDF5',
          card: '#FFFFFF',
        },
        text: {
          primary: '#38342F',
          muted: '#70695F',
        },
        type: {
          feature: '#B9A4E3',
          bug: '#E9A6B6',
        },
        due: {
          safe: '#A9D6B8',
          warning: '#E7BD62',
          overdue: '#D97785',
          neutral: '#B6B0AA',
        },
        column: {
          todo: '#F6E6A8',
          progress: '#DDD1F3',
          review: '#F3D5DE',
          done: '#D4E9DB',
        },
      },
    },
  },
  plugins: [],
};
