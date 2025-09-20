export const formatCurrency = (value: number, currency = 'COP') =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency }).format(value);
