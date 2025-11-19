/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  // ✅ Added for theme switching
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        // ⭐ Keeping your original neon medical palette
        mm: {
          50: '#eaf7ff',
          100: '#c9f0ff',
          200: '#9fe6ff',
          300: '#66d9ff',
          400: '#33c9f0',
          500: '#06b6d4',
          600: '#0493b0',
          700: '#037186',
          800: '#025064',
          900: '#01313f',
        },

        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },

        transparent: "transparent",
      },

      // backgrounds (mesh + transparent overrides)
      backgroundColor: {
        DEFAULT: "transparent",
        transparent: "transparent",
      },

      backgroundImage: {
        "mm-mesh":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",

        glass: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        none: "none",
      },

      backdropBlur: {
        xs: "2px",
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "30px",
      },

      boxShadow: {
        "mm-glow": "0 8px 40px rgba(6,182,212,0.10)",
        "mm-neon": "0 0 30px rgba(6,182,212,0.14), inset 0 0 12px rgba(6,182,212,0.04)",
        "mm-glass": "0 6px 30px rgba(2,6,12,0.6), 0 0 30px rgba(6,182,212,0.03)",
        "mm-glass-lg": "0 10px 40px rgba(6,6,10,0.6)",
        neon: "0 0 20px rgba(6,182,212,0.6)",
        "neon-cyan": "0 0 25px rgba(6,182,212,0.7)",
      },

      borderRadius: {
        mm: "1.25rem",
      },

      // ⭐ merging ALL animations + new ones
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.8s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        spin: "spin 1s linear infinite",
      },
    },
  },

  corePlugins: {
    preflight: true,
  },

  plugins: [],
};
