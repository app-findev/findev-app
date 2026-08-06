export type CategoryKey =
  | 'housing'
  | 'subscriptions'
  | 'transport'
  | 'leisure'
  | 'other';

export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  housing: '#173308',
  subscriptions: '#8fe05a',
  transport: '#4a90d9',
  leisure: '#e08a3c',
  other: '#9aa393',
};

export const CATEGORY_ORDER: CategoryKey[] = [
  'housing',
  'subscriptions',
  'transport',
  'leisure',
  'other',
];
