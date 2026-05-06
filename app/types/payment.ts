export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

export interface PaymentFormValues {
  cardNumber: string;
  name: string;
  expiry: string;
  cvv: string;
  amount: string;
  currency: 'INR' | 'USD';
}

export interface PaymentPayload extends Omit<PaymentFormValues, 'amount'> {
  amount: number;
  transactionId: string;
}
