import type { CategoryKey } from './categories';

export type ExpenseStatus = 'paid' | 'pending';
export type ExpenseTag = 'fixed' | 'installment';

export type Expense = {
  id: string;
  date: Date;
  title: { en: string; pt: string };
  amount: number;
  tag: ExpenseTag;
  status: ExpenseStatus;
  category?: CategoryKey;
  installment?: { current: number; total: number };
};

export const monthlyGoal = 2400;

export const mockExpenses: Expense[] = [
  {
    id: '1',
    date: new Date(2026, 5, 5),
    title: { en: 'Rent', pt: 'Aluguel' },
    amount: 1800,
    tag: 'fixed',
    status: 'paid',
    category: 'housing',
  },
  {
    id: '2',
    date: new Date(2026, 5, 8),
    title: { en: 'Electricity bill', pt: 'Energia elétrica' },
    amount: 234.4,
    tag: 'fixed',
    status: 'paid',
    category: 'housing',
  },
  {
    id: '3',
    date: new Date(2026, 5, 10),
    title: { en: 'Gym', pt: 'Academia' },
    amount: 99.9,
    tag: 'fixed',
    status: 'pending',
    category: 'leisure',
  },
  {
    id: '4',
    date: new Date(2026, 5, 12),
    title: { en: 'Dell laptop', pt: 'Notebook Dell' },
    amount: 450,
    tag: 'installment',
    installment: { current: 3, total: 10 },
    status: 'pending',
    category: 'other',
  },
  {
    id: '5',
    date: new Date(2026, 5, 15),
    title: { en: 'Fiber internet', pt: 'Internet fibra' },
    amount: 120,
    tag: 'fixed',
    status: 'pending',
    category: 'subscriptions',
  },
  {
    id: '6',
    date: new Date(2026, 5, 20),
    title: { en: 'Credit card', pt: 'Cartão de crédito' },
    amount: 380.5,
    tag: 'fixed',
    status: 'pending',
    category: 'transport',
  },
];

export function getSpentTotal(expenses: Expense[]): number {
  return expenses.filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
}

export function getPendingTotal(expenses: Expense[]): number {
  return expenses.filter((e) => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
}
