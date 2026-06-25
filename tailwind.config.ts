import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        abc: {
          50: "#fef5f2",
          100: "#fde8e2",
          200: "#f9cfc0",
          300: "#f5b69e",
          400: "#f09d7c",
          500: "#ea845a",
          600: "#E74C3C",
          700: "#d43f2f",
          800: "#c13627",
          900: "#8b251a",
          950: "#5a190d",
        },
        brand: {
          50: "#fef5f2",
          100: "#fde8e2",
          200: "#f9cfc0",
          300: "#f5b69e",
          400: "#f09d7c",
          500: "#ea845a",
          600: "#E74C3C",
          700: "#d43f2f",
          800: "#c13627",
          900: "#8b251a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};

export default config;
