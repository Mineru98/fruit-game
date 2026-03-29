/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fruit: {
          1: '#FF6B6B',
          2: '#4ECDC4',
          3: '#FFE66D',
          4: '#A8E6CF',
          5: '#FF8B94',
          6: '#B8B8FF',
          7: '#FFDAC1',
          8: '#E2F0CB',
          9: '#C7CEEA',
          10: '#FF9AA2',
          11: '#2E8B57'
        }
      }
    },
  },
  plugins: [],
}
