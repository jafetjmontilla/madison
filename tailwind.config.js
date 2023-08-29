const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './layouts/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      "body": ['Montserrat', ...defaultTheme.fontFamily.sans],
      "display": ['Poppins', ...defaultTheme.fontFamily.sans],
      "title": ['Italiana', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        primary: "#59A5F1",
        secondary: "#87F3B5",
        tertiary: "#57669B",
        "color-base": "#E6E6E6",
      },
    },
  },
  // corePlugins: {
  //   preflight: false,
  // },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('tailwind-scrollbar-hide')
  ],
}
