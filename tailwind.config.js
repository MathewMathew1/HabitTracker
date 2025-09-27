module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  safelist: ["dark"],
  theme: {
    // ...
  },
  plugins: [require("tailwindcss-animate")],
}