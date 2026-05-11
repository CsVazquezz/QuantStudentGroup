import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        canvas: "#070A10",
        tec: {
          50:  "#e6eef7",
          100: "#c0d4ef",
          200: "#97b9e4",
          300: "#6d9dd8",
          400: "#4a83cd",
          500: "#2668c3",
          600: "#0039a6",   // official Tec de Monterrey blue (PMS 281)
          700: "#00308b",
          800: "#002670",
          900: "#001855",
          DEFAULT: "#0039a6",
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "spin-slow": "spin 1.2s linear infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
