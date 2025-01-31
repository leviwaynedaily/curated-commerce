import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'open-sans': ['Open Sans', 'sans-serif'],
        'dancing': ['Dancing Script', 'cursive'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "#4e5651", // Updated to new brand dark color
        primary: {
          DEFAULT: "#699276", // Updated to new brand green
          foreground: "#ffffff",
          hover: "#5a8167", // Slightly darker variant
        },
        secondary: {
          DEFAULT: "#f5c98f", // Updated to new brand peach
          foreground: "#4e5651", // Updated to new brand dark
        },
        success: {
          DEFAULT: "#699276", // Using brand green for success
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#F1F0FB",
          foreground: "#8E9196",
        },
        accent: {
          DEFAULT: "#bda27a", // New warm accent color
          foreground: "#4e5651", // Updated to new brand dark
        },
        brand: {
          green: "#699276",
          peach: "#f5c98f",
          tan: "#bda27a",
          gray: "#857c65",
          dark: "#4e5651",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "#4e5651", // Updated to new brand dark
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        popScale: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out",
        slideUp: "slideUp 0.5s ease-out",
        slideDown: "slideDown 0.5s ease-out",
        popScale: "popScale 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;