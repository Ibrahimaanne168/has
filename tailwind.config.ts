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
        saphir: {
          DEFAULT: "#1e40af",
          light: "#3b82f6",
          dark: "#0f172a",
          soft: "#eff6ff",
        },
        amberGold: {
          DEFAULT: "#f97316",
          light: "#fb923c",
          dark: "#ea580c",
          soft: "#fff7ed",
        },
        slateBorder: "#e2e8f0",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)",
        lift: "0 16px 32px -4px rgba(15, 23, 42, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
