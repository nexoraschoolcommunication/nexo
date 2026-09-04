import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: "#0B0F17",     // primary background
        obsidian: "#111827",  // panel background
        zinc: "#27272A",      // borders
        blue: "#2563EB",      // primary action
        cyan: "#06B6D4",      // accent / highlight
        ink: {
          100: "#F4F5F7",
          400: "#9CA3AF",
          500: "#71717A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        // Geometric only — no full/pill radii used anywhere in components.
        md: "8px",
        lg: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
