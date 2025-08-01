import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: "class", // enables dark mode via a CSS class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{ts,tsx}", // if you have shared components
  ],
  theme: {
    extend: {
      colors: {
        romantic: {
          light: "#ffe4ec",
          DEFAULT: "#ffb6c1",
          dark: "#ff69b4",
        },
        rose: {
          100: "#ffeef3",
          200: "#ffd7e5",
          300: "#fbb1c6",
        },
        darkPink: "#7a2a52",
      },
      fontFamily: {
        romantic: ["'Quicksand'", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 1s ease-out",
        "pulse-love": "pulseLove 2s infinite",
        "bounce-huge": "bounceHuge 1s ease-in-out infinite",
        "heart-float": "heartFloat 3s ease-in-out infinite",
        "hug-explosion": "hugExplosion 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        pulseLove: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        bounceHuge: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-30px)" },
        },
        heartFloat: {
          "0%": { transform: "translateY(0)", opacity: 1 },
          "100%": { transform: "translateY(-80px)", opacity: 0 },
        },
        hugExplosion: {
          "0%": { transform: "scale(0.5)", opacity: 0.7 },
          "100%": { transform: "scale(2)", opacity: 0 },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    plugin(function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    }),
  ],
};

export default config;

