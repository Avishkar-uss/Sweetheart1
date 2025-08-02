import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: "class", // enables dark mode via a CSS class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{ts,tsx}",
  ],
 safelist: [
  // Sidebar layout
  'flex', 'flex-col', 'space-y-4', 'items-center', 'gap-3', 'px-4', 'py-2',
  'rounded-lg', 'hover:bg-pink-100', 'dark:hover:bg-pink-700',
  'text-gray-700', 'dark:text-gray-300', 'w-full', 'transition-all',
  
  // Message box and background
  'bg-white/70', 'dark:bg-gray-800/50', 'backdrop-blur-2xl', 'rounded-3xl',
  'shadow-lg', 'border', 'border-white/30', 'dark:border-gray-700',
  
  // Inner love message box
  'bg-white/90', 'dark:bg-gray-900/70', 'border-pink-200', 'dark:border-pink-700',
  'rounded-2xl', 'shadow-xl', 'p-8', 'text-xl', 'sm:text-2xl',
  
  // Countdown timer
  'bg-white/90', 'dark:bg-gray-800/60', 'rounded-xl', 'shadow-lg',
  'px-6', 'py-4', 'inline-block', 'border-pink-100', 'dark:border-pink-900',
  
  // Text color fallbacks
  'text-gray-900', 'text-gray-800', 'text-gray-600', 'text-pink-700',
  'text-gray-100', 'text-gray-300', 'text-white', 'dark:text-white',

  // Animations
  'animate-pulse-love', 'animate-fade-in', 'animate-floating-heart',
  'animate-bounce-huge', 'animate-hug-explosion', 'animate-heart-float',
  'animate-soft-ping', 'animate-ping'
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


