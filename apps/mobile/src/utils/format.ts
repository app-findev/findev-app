import type { Language } from '../i18n/translations';

export function getLocale(language: Language): string {
  return language === 'pt' ? 'pt-BR' : 'en-US';
}

function getCurrencyCode(language: Language): string {
  return language === 'pt' ? 'BRL' : 'USD';
}

export function formatCurrency(value: number, language: Language): string {
  return new Intl.NumberFormat(getLocale(language), {
    style: 'currency',
    currency: getCurrencyCode(language),
  }).format(value);
}

/**
 * Splits a formatted currency value into its currency symbol (including a
 * leading minus sign, when present) and its numeric amount, so the two can
 * be styled independently without losing the sign of negative values.
 */
export function splitCurrency(
  value: number,
  language: Language
): { symbol: string; amount: string } {
  const parts = new Intl.NumberFormat(getLocale(language), {
    style: 'currency',
    currency: getCurrencyCode(language),
  }).formatToParts(value);

  let symbol = '';
  let amount = '';
  for (const part of parts) {
    if (part.type === 'currency' || part.type === 'minusSign' || part.type === 'literal') {
      symbol += part.value;
    } else {
      amount += part.value;
    }
  }
  return { symbol, amount };
}

export function formatDate(date: Date, language: Language): string {
  return date
    .toLocaleDateString(getLocale(language), {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function formatAmountFromCents(cents: number, language: Language): string {
  const value = cents / 100;
  return new Intl.NumberFormat(getLocale(language), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
