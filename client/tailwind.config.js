/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eef3ff",
          100: "#d9e4ff",
          200: "#bcd0ff",
          300: "#8eb2ff",
          400: "#5c8aff",
          500: "#3a5ff0",
          600: "#2040e6",
          700: "#1c32c9",
          800: "#1c2ea4",
          900: "#0f1d6b",
          950: "#0a1245"
        },
        violet: {
          500: "#7c3aed",
          600: "#6d28d9"
        },
        accent: {
          green: "#10b981",
          teal: "#06b6d4",
          rose: "#f43f5e",
          amber: "#f59e0b"
        }
      },
      boxShadow: {
        glass: "0 8px 32px rgba(15, 29, 107, 0.12)",
        glow: "0 0 40px rgba(58, 95, 240, 0.25)",
        card: "0 4px 24px rgba(15, 29, 107, 0.08)",
        "card-hover": "0 16px 48px rgba(15, 29, 107, 0.16)"
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0f1d6b 0%, #1c32c9 35%, #3a5ff0 65%, #7c3aed 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))",
        "dark-gradient": "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        shimmer: "shimmer 2s linear infinite"
      }
    }
  },
  plugins: []
};
