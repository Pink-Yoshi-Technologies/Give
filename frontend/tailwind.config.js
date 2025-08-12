/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        backgroundGrey: "#F5F3F3",
        defaultPink: "#F5CCE2",
        lightPink: "rgba(245, 204, 226, 0.4)", // 40% opacity
        defaultYellow: "#FFDD4A",
        lightYellow: "rgba(255, 221, 74, 0.15)", // 15% opacity
        darkGrey: "#D9D9D9",
      },
    },
  },
  plugins: [],
};
