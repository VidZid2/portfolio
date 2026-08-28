/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          green: '#2D7A3E',
          yellow: '#F4C430',
          red: '#C1272D',
          blue: '#1E5BA8',
        },
        brand: {
          green: {
            DEFAULT: '#2D7A3E',
            light: '#3A9B4E',
            dark: '#1F5429',
          },
          yellow: {
            DEFAULT: '#F4C430',
            light: '#F7D858',
            dark: '#D4A520',
          },
          red: {
            DEFAULT: '#C1272D',
            light: '#D63940',
            dark: '#9B1F24',
          },
          blue: {
            DEFAULT: '#1E5BA8',
            light: '#2B6FBF',
            dark: '#164580',
          },
        },
      },
    },
  },
  plugins: [],
}
