import { PaymentPayload } from "../types/payment";

export const makePayment = async (
  payload: PaymentPayload,
  signal: AbortSignal
) => {
  const res = await fetch('/api/pay', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!res.ok) {
    throw new Error('Network error');
  }

  return res.json();
};