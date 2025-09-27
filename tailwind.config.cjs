/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary - Marrón rojizo oscuro (#5C2D2D)
        primary: {
          50: '#FBF7F7',   // Muy claro para fondos sutiles
          100: '#F7EFEF',  // Fondos de tarjetas claras
          200: '#EBDADA',  // Bordes y elementos decorativos
          300: '#D4B8B8',  // Estados hover suaves
          400: '#B8908E',  // Elementos interactivos suaves
          500: '#5C2D2D',  // Color principal ⭐
          600: '#4A2424',  // Hover de botones principales
          700: '#3C1D1D',  // Texto sobre fondos claros
          800: '#2E1616',  // Títulos y texto de alta jerarquía
          900: '#1F0F0F',  // Máximo contraste
          950: '#140A0A',  // Negro alternativo
        },
        // Secondary - Rojo terracota (#A34C3E)
        secondary: {
          50: '#FDF9F8',   // Muy claro
          100: '#FBF2F0',  // Fondos sutiles
          200: '#F5DDD8',  // Elementos decorativos
          300: '#E8BAB0',  // Estados hover suaves
          400: '#D18D7E',  // Elementos interactivos
          500: '#A34C3E',  // Color secundario ⭐
          600: '#8B3F33',  // Hover de botones secundarios
          700: '#723328',  // Texto sobre fondos claros
          800: '#5A281E',  // Texto de énfasis
          900: '#3D1B14',  // Máximo contraste
          950: '#2A120E',  // Negro alternativo
        },
        // Accent - Naranja anaranjado (#FFB74C)
        accent: {
          50: '#FFFCF5',   // Muy claro
          100: '#FFF8E6',  // Fondos sutiles
          200: '#FFECB8',  // Elementos decorativos
          300: '#FFDB85',  // Estados hover suaves
          400: '#FFC952',  // Elementos interactivos
          500: '#FFB74C',  // Color de acento ⭐
          600: '#E6A343',  // Hover de elementos de acento
          700: '#CC8F3A',  // Texto sobre fondos claros
          800: '#B37B31',  // Texto de énfasis
          900: '#805728',  // Contraste alto
          950: '#4D341A',  // Negro alternativo
        },
        // Neutral - Gris claro (#F0F0F0) y variaciones
        neutral: {
          50: '#FAFAFA',   // Casi blanco
          100: '#F0F0F0',  // Color neutro principal ⭐
          200: '#E5E5E5',  // Bordes y divisores
          300: '#D4D4D4',  // Estados deshabilitados
          400: '#A3A3A3',  // Texto placeholder
          500: '#737373',  // Texto secundario
          600: '#525252',  // Texto del cuerpo
          700: '#404040',  // Encabezados
          800: '#262626',  // Texto de alta jerarquía
          900: '#171717',  // Texto de máximo contraste
          950: '#0A0A0A',  // Negro puro
        },
        // Success - Usando tonos verdes compatibles
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },
        // Warning - Usando la paleta de acento para advertencias
        warning: {
          50: '#FFFCF5',
          100: '#FFF8E6',
          200: '#FFECB8',
          300: '#FFDB85',
          400: '#FFC952',
          500: '#FFB74C',  // Mismo que accent
          600: '#E6A343',
          700: '#CC8F3A',
          800: '#B37B31',
          900: '#805728',
          950: '#4D341A',
        },
        // Error - Usando la paleta secundaria para errores
        error: {
          50: '#FDF9F8',
          100: '#FBF2F0',
          200: '#F5DDD8',
          300: '#E8BAB0',
          400: '#D18D7E',
          500: '#A34C3E',  // Mismo que secondary
          600: '#8B3F33',
          700: '#723328',
          800: '#5A281E',
          900: '#3D1B14',
          950: '#2A120E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 50px -12px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
