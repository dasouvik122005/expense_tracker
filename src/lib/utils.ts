import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Currency } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const locales = {
    USD: 'en-US',
    BDT: 'en-BD',
    INR: 'en-IN',
  };

  return new Intl.NumberFormat(locales[currency], {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
