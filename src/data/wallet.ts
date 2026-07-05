type LocalizedText = string | { en: string; pt: string };

export type Account = {
  id: string;
  type: 'checking' | 'savings';
  name: LocalizedText;
  subtitle: LocalizedText;
  balance: number;
};

export type Card = {
  id: string;
  name: LocalizedText;
  subtitle: LocalizedText;
  currentInvoice: number;
  limit: number;
};

export const accounts: Account[] = [
  {
    id: 'checking',
    type: 'checking',
    name: { en: 'Checking account', pt: 'Conta corrente' },
    subtitle: 'Banco Nu • •1234',
    balance: 4280.15,
  },
  {
    id: 'savings',
    type: 'savings',
    name: { en: 'Savings', pt: 'Poupança' },
    subtitle: { en: 'Emergency fund', pt: 'Reserva de emergência' },
    balance: 9150.0,
  },
];

export const cards: Card[] = [
  {
    id: 'credit',
    name: { en: 'Credit card', pt: 'Cartão de crédito' },
    subtitle: 'Nubank •••• 8842',
    currentInvoice: 1950.0,
    limit: 3000.0,
  },
];

export function getNetWorth(): number {
  return accounts.reduce((sum, a) => sum + a.balance, 0);
}
