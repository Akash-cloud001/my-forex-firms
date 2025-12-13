/**
 * Payment Method Options for Step 9 (Payments)
 * Values are stored as lowercase identifiers for backend consistency
 */

// Payment Methods (Deposit)
export const PAYMENT_METHOD_VALUES = [
    'bank_transfer',
    'credit_debit_cards',
    'crypto',
    'e_wallet',
    'apple_pay',
    'google_pay',
    'upi',
    'skrill',
    'paypal',
    'astro_pay',
    'other',
] as const;

export type PaymentMethodValue = typeof PAYMENT_METHOD_VALUES[number];

export const PAYMENT_METHOD_OPTIONS = [
    { label: 'Bank Transfer / Wire', value: 'bank_transfer' },
    { label: 'Credit/Debit Cards', value: 'credit_debit_cards' },
    { label: 'Crypto', value: 'crypto' },
    { label: 'E-Wallet', value: 'e_wallet' },
    { label: 'Apple Pay', value: 'apple_pay' },
    { label: 'Google Pay', value: 'google_pay' },
    { label: 'UPI', value: 'upi' },
    { label: 'Skrill', value: 'skrill' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Astro Pay', value: 'astro_pay' },
    { label: 'Other', value: 'other' },
] as const;

// Payout Methods (Withdrawal)
export const PAYOUT_METHOD_VALUES = [
    'bank_transfer',
    'crypto',
    'e_wallet',
    'rise',
    'other',
] as const;

export type PayoutMethodValue = typeof PAYOUT_METHOD_VALUES[number];

export const PAYOUT_METHOD_OPTIONS = [
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'Crypto', value: 'crypto' },
    { label: 'E-Wallet', value: 'e_wallet' },
    { label: 'Rise', value: 'rise' },
    { label: 'Other', value: 'other' },
] as const;
