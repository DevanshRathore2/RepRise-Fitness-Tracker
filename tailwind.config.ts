import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0a0d3a",
        background: "#0a0d3a",
        foreground: "#ffffff",
        card: {
          DEFAULT: "rgba(30, 35, 83, 0.75)",
          foreground: "#ffffff",
        },
        border: "rgba(255, 255, 255, 0.12)",
        "muted-foreground": "#9ca3af",
        primary: {
          DEFAULT: "#5865f2",
          hover: "#4752c4",
          light: "#7983f5",
        },
        blurple: "#5865f2",
        "discord-green": "#35ed7e",
        "discord-magenta": "#38bdf8",
        "discord-link": "#00b0f4",
        "sky-blue": "#38bdf8",
        brand: {
          50: "#eef0fd",
          100: "#e0e3fc",
          200: "#c7ccfa",
          300: "#a5aef7",
          400: "#7983f5",
          500: "#5865f2", // Discord Blurple
          600: "#4752c4",
          700: "#3c45a5",
          800: "#2a3070",
          900: "#1e2353",
        },
        surface: {
          canvas: "#0a0d3a",
          indigo: "#1e2353",
          onyx: "#23272a",
          black: "#000000",
          card: "#1e2353",
          border: "#23272a",
          subtle: "rgba(30, 35, 83, 0.4)",
          50: "#1e2353",
          100: "#23272a",
          200: "#2c3136",
        },
        ink: {
          DEFAULT: "#ffffff",
          dark: "#000000",
          muted: "#8e9297",
        },
        macro: {
          protein: "#00b0f4", // Link cyan
          carbs: "#35ed7e",   // Electric green
          fats: "#38bdf8",    // Sky blue
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xs: "6px",
        sm: "12px",
        md: "14px",
        lg: "16px",
        xl: "40px",
        pill: "50px",
        jumbo: "120px",
        full: "9999px",
      },
      boxShadow: {
        float: "0 3px 68px rgba(69, 42, 124, 0.25)",
        blurple: "0 0 25px rgba(88, 101, 242, 0.4)",
        green: "0 0 25px rgba(53, 237, 126, 0.4)",
        magenta: "0 0 25px rgba(56, 189, 248, 0.4)",
      },
      animation: {
        marquee: "marquee var(--duration, 20s) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration, 20s) linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap, 1rem)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap, 1rem)))" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
