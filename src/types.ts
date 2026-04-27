export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  note: string;
}

export type Currency = 'USD' | 'BDT' | 'INR';

export interface UserProfile {
  name: string;
  currency: Currency;
}

export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Utilities', 'Other'],
};

export const TIPS = [
  "Track every penny – even small expenses add up over time.",
  "Set a monthly budget for different categories to avoid overspending.",
  "Consider the '50/30/20' rule: 50% for needs, 30% for wants, 20% for savings.",
  "Avoid impulse purchases by waiting 24 hours before buying non-essentials.",
  "Review your subscriptions regularly and cancel what you don't use.",
  "Cooking at home is often 3x cheaper than eating out.",
  "Build an emergency fund covering 3-6 months of expenses.",
];
