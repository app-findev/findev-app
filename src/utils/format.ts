import type { Language } from '../i18n/translations';

export function formatCurrency(value: number, language: Language): string {
  if (language === 'pt') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
