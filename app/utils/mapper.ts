import { PaymentFormValues, PaymentPayload } from "../types/payment";

export const mapToPaymentPayload = (
  form: PaymentFormValues,
  transactionId: string
): PaymentPayload => {
  return {
    cardNumber: form.cardNumber,
    name: form.name,
    expiry: form.expiry,
    cvv: form.cvv,
    amount: Number(form.amount), 
    currency: form.currency,
    transactionId,
  };
};