
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#216447',
          dark: '#173D32',
          active: '#286B56',
        },
        surface: {
          page: '#F8F9F7',
          card: '#FFFFFF',
        },
        text: {
          primary: '#172333',
          muted: '#526176',
        },
        type: {
          feature: '#216447',
          bug: '#991B1B',
        },
        due: {
          safe: '#216447',
          today: '#80340F',
          warning: '#68500D',
          overdue: '#991B1B',
          neutral: '#64748B',
        },
        column: {
          todo: '#F2EAF2',
          progress: '#EDF1F5',
          review: '#F1EDFA',
          done: '#E8F7EE',
        },
      },
    },
  },
  plugins: [],
};
