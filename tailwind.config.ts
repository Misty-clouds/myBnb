import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "primary-text": "var(--primary-text)",
        "secondary-text": "var(--secondary-text)",
        "muted-gray": "var(--muted-gray)",
        "inactive-gray": "var(--inactive-gray)",
        background: "var(--background)",
        "light-gray": "var(--light-gray)",
        "secondary-bg": "var(--secondary-bg)"
      }
    }
  }
} satisfies Config

export default config