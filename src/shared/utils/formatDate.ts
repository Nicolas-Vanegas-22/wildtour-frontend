/**
 * Native JavaScript date formatting utilities
 * Provides consistent date formatting across the application without external dependencies
 */

type RelativeTimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

/**
 * Formats a date as relative time (e.g., "hace 2 horas", "en 3 días")
 * Uses native Intl.RelativeTimeFormat API
 */
export function formatRelativeTime(date: Date | string, locale: string = 'es-CO'): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  // Define time intervals in seconds
  const intervals: Array<[RelativeTimeUnit, number]> = [
    ['year', 31536000], // 365 * 24 * 60 * 60
    ['month', 2629746], // 365.24 * 24 * 60 * 60 / 12
    ['week', 604800],   // 7 * 24 * 60 * 60
    ['day', 86400],     // 24 * 60 * 60
    ['hour', 3600],     // 60 * 60
    ['minute', 60],
    ['second', 1]
  ];

  // Find the appropriate interval
  for (const [unit, secondsInUnit] of intervals) {
    const interval = Math.floor(Math.abs(diffInSeconds) / secondsInUnit);

    if (interval >= 1) {
      const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
      return formatter.format(diffInSeconds > 0 ? -interval : interval, unit);
    }
  }

  // Handle "just now" case
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  return formatter.format(0, 'second');
}

/**
 * Formats a date in absolute format (e.g., "15 de marzo de 2024")
 * Uses native Intl.DateTimeFormat API, consistent with existing patterns in the codebase
 */
export function formatAbsoluteDate(
  date: Date | string,
  locale: string = 'es-CO',
  options?: Intl.DateTimeFormatOptions
): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(targetDate);
}

/**
 * Formats a date with time (e.g., "15 de marzo de 2024, 14:30")
 * Consistent with MyBookings.tsx pattern
 */
export function formatDateWithTime(
  date: Date | string,
  locale: string = 'es-CO'
): string {
  return formatAbsoluteDate(date, locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formats a date in short format (e.g., "15 mar 2024")
 * Consistent with Favorites.tsx pattern
 */
export function formatShortDate(
  date: Date | string,
  locale: string = 'es-CO'
): string {
  return formatAbsoluteDate(date, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Utility to check if a date is today
 */
export function isToday(date: Date | string): boolean {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return (
    targetDate.getDate() === today.getDate() &&
    targetDate.getMonth() === today.getMonth() &&
    targetDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Utility to check if a date is yesterday
 */
export function isYesterday(date: Date | string): boolean {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    targetDate.getDate() === yesterday.getDate() &&
    targetDate.getMonth() === yesterday.getMonth() &&
    targetDate.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Smart date formatter that uses relative time for recent dates and absolute for older ones
 */
export function formatSmartDate(date: Date | string, locale: string = 'es-CO'): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

  // Use relative time for dates within the last week
  if (diffInDays <= 7 && diffInDays >= 0) {
    return formatRelativeTime(targetDate, locale);
  }

  // Use absolute format for older dates
  return formatShortDate(targetDate, locale);
}