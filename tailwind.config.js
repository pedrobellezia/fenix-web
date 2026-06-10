/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,js,ts}',
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        lilac: '#9B72CF',
        'rose-dark': '#E8799F',
        'rose-light': '#FDE8F0',
        mint: '#6FCF97',
        'mint-dark': '#57B883',
      },
    },
  },

  plugins: [],
}