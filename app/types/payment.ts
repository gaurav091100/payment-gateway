export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CURRENCIES = ['INR', 'USD'] as const;
export type Currency = typeof CURRENCIES[number]; 
export interface PaymentFormValues {
  cardNumber: string;
  name: string;
  expiry: string;
  cvv: string;
  amount: string;
  currency: Currency;
}

export interface PaymentPayload extends Omit<PaymentFormValues, 'amount'> {
  amount: number;
  transactionId: string;
}
