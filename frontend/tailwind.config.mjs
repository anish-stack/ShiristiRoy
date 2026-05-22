/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        // Brand: lavender + sage + dusty blue + warm ivory
        brand: {
          lavender: { 50: '#F6F2FA', 100: '#ECE3F4', 200: '#D7C5E8', 300: '#BFA3D7', 400: '#A688C4', 500: '#8A6CAE', 600: '#7C6AA8', 700: '#665587', 800: '#534670', 900: '#3F365A' },
          sage:     { 50: '#F2F5EF', 100: '#E2EADD', 200: '#C7D5BD', 300: '#AAC09B', 400: '#9AAE92', 500: '#7E9479', 600: '#65775F', 700: '#4F5D4B', 800: '#3D483B', 900: '#2E372C' },
          blue:     { 50: '#EFF3F8', 100: '#DBE5EE', 200: '#B6C8DA', 300: '#90AAC4', 400: '#6E89A7', 500: '#587392', 600: '#475D78', 700: '#384A60', 800: '#2C3A4C', 900: '#1F2A37' },
          ivory:    { DEFAULT: '#FBF7F0', dark: '#F2EBDD' },
          ink:      { DEFAULT: '#2E2A33', muted: '#5C5664' },
        },
        // Shadcn semantic
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        border: 'hsl(var(--border))', input: 'hsl(var(--input))', ring: 'hsl(var(--ring))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: { 'fade-up': 'fade-up 0.6s ease-out both' },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
