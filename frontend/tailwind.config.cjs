/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,scss}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#00a37a",
        "background-light": "#ffffff",
        "background-muted": "#f8fafc",
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.75rem",
        "lg": "1rem",
        "xl": "1.25rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
