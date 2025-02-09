module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    "select-trigger",
    "select-content",
    "select-item",
    // Dersom du har andre dynamiske klasser, kan du gjerne legge dem inn her.
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} 