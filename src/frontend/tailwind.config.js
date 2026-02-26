import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        sonic: {
          blue: "oklch(var(--sonic-blue))",
          gold: "oklch(var(--sonic-gold))",
          red: "oklch(var(--sonic-red))",
          dark: "oklch(var(--sonic-dark))",
          navy: "oklch(var(--sonic-navy))",
          white: "oklch(var(--sonic-white))",
          teal: "oklch(var(--sonic-teal))",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        "sonic-blue": "0 0 20px oklch(0.55 0.26 245 / 0.4), 0 0 40px oklch(0.55 0.26 245 / 0.2)",
        "sonic-gold": "0 0 20px oklch(0.82 0.18 85 / 0.4), 0 0 40px oklch(0.82 0.18 85 / 0.2)",
        "sonic-red": "0 0 20px oklch(0.6 0.23 27 / 0.4), 0 0 40px oklch(0.6 0.23 27 / 0.2)",
        "monitor": "inset 3px 3px 0 oklch(0.5 0.1 265), inset -3px -3px 0 oklch(0.1 0.02 265), 4px 4px 0 oklch(0.05 0.01 265)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pixel-slide-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px oklch(0.55 0.26 245 / 0.3)" },
          "50%": { boxShadow: "0 0 40px oklch(0.55 0.26 245 / 0.6)" },
        },
        "sonic-bounce": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px) rotate(-1deg)" },
          "40%": { transform: "translateX(6px) rotate(1deg)" },
          "60%": { transform: "translateX(-3px)" },
          "80%": { transform: "translateX(3px)" },
        },
        "age-reveal": {
          "0%": { transform: "scale(0.5) rotate(-10deg)", opacity: "0" },
          "60%": { transform: "scale(1.3) rotate(5deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "spin-fast": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pixel-slide-in": "pixel-slide-in 0.3s ease-out forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "sonic-bounce": "sonic-bounce 0.6s ease-in-out infinite",
        "shake": "shake 0.4s ease-in-out",
        "age-reveal": "age-reveal 0.5s ease-out forwards",
        "spin-fast": "spin-fast 0.3s linear infinite",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
