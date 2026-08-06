import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { mockExpenses, type Expense } from '../data/mockExpenses';

type ExpensesContextValue = {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
};

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

// Timestamp plus a per-provider counter, so two expenses added within the
// same millisecond still get distinct ids.
let expenseIdSequence = 0;

function createExpenseId(): string {
  expenseIdSequence += 1;
  return `${Date.now()}-${expenseIdSequence}`;
}

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const value = useMemo<ExpensesContextValue>(
    () => ({
      expenses,
      addExpense: (expense) =>
        setExpenses((prev) => [{ ...expense, id: createExpenseId() }, ...prev]),
      updateExpense: (id, updates) =>
        setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e))),
      removeExpense: (id) => setExpenses((prev) => prev.filter((e) => e.id !== id)),
    }),
    [expenses]
  );

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
}
