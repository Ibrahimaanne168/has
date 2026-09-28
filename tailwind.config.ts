import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f5fa",
          100: "#dbe6f3",
          200: "#bdd2e9",
          300: "#91b5db",
          400: "#6093cb",
          500: "#3d75bb",
          600: "#2b5ca5",
          700: "#224987",
          800: "#1e3e70",
          900: "#0f2744", // Couleur dominante officielle HAS
          950: "#09192e",
          DEFAULT: "#0f2744",
        },
        accent: {
          50: "#fff8f1",
          100: "#feeee2",
          200: "#fcd9c3",
          300: "#fabd98",
          400: "#f69562",
          500: "#f27237",
          600: "#e0521c", // Accent officiel HAS pour CTA & badges
          700: "#ba3d14",
          800: "#943317",
          900: "#782d17",
          DEFAULT: "#e0521c",
        },
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
