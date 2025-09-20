export const colors = {
  // Colores primarios inspirados en paisajes colombianos
  primary: {
    50: '#F0FDF4',   // Verde muy claro
    100: '#DCFCE7',  // Verde claro
    200: '#BBF7D0',  // Verde suave
    300: '#86EFAC',  // Verde medio
    400: '#4ADE80',  // Verde brillante
    500: '#10B981',  // Verde esmeralda (principal)
    600: '#059669',  // Verde oscuro
    700: '#047857',  // Verde profundo
    800: '#065F46',  // Verde muy oscuro
    900: '#064E3B',  // Verde casi negro
  },

  // Colores secundarios - Terracota (tierra colombiana)
  secondary: {
    50: '#FEF2F2',   // Terracota muy claro
    100: '#FEE2E2',  // Terracota claro
    200: '#FECACA',  // Terracota suave
    300: '#FCA5A5',  // Terracota medio
    400: '#F87171',  // Terracota brillante
    500: '#DC2626',  // Terracota (principal)
    600: '#B91C1C',  // Terracota oscuro
    700: '#991B1B',  // Terracota profundo
    800: '#7F1D1D',  // Terracota muy oscuro
    900: '#7C2D12',  // Terracota casi negro
  },

  // Colores de acento - Dorado (oro precolombino)
  accent: {
    50: '#FFFBEB',   // Dorado muy claro
    100: '#FEF3C7',  // Dorado claro
    200: '#FDE68A',  // Dorado suave
    300: '#FCD34D',  // Dorado medio
    400: '#FBBF24',  // Dorado brillante
    500: '#F59E0B',  // Dorado (principal)
    600: '#D97706',  // Dorado oscuro
    700: '#B45309',  // Dorado profundo
    800: '#92400E',  // Café tierra
    900: '#78350F',  // Café oscuro
  },

  // Colores complementarios
  coral: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',  // Coral principal
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  sky: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',  // Azul cielo principal
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },

  // Grises naturales
  gray: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },

  // Estados del sistema
  success: {
    light: '#10B981',
    DEFAULT: '#059669',
    dark: '#047857',
  },

  warning: {
    light: '#F59E0B',
    DEFAULT: '#D97706',
    dark: '#B45309',
  },

  error: {
    light: '#EF4444',
    DEFAULT: '#DC2626',
    dark: '#B91C1C',
  },

  info: {
    light: '#3B82F6',
    DEFAULT: '#2563EB',
    dark: '#1D4ED8',
  },
} as const;

// Gradientes personalizados
export const gradients = {
  hero: 'bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500',
  sunset: 'bg-gradient-to-r from-coral-500 via-accent-400 to-secondary-400',
  emerald: 'bg-gradient-to-r from-primary-600 to-primary-400',
  earth: 'bg-gradient-to-br from-accent-800 via-secondary-600 to-coral-600',
  sky: 'bg-gradient-to-br from-sky-400 via-sky-500 to-primary-500',
  card: 'bg-gradient-to-br from-white to-gray-50',
  overlay: 'bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent',
} as const;