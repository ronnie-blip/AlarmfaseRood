/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d10",
        panel: "#0f1319",
        text: "#e7e9ee",
        muted: "#aab1bf",
        red: "#ff2d2d",
        red2: "#ff4a4a"
      }
    },
  },
  plugins: [],
};
