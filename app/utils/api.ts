import { PaymentPayload } from "../types/payment";

export type PaymentApiResponse =
  | { status: "success"; transactionId: string }
  | { status: "failed"; reason?: string; transactionId: string }
  | { status: "timeout"; transactionId: string };

export const makePayment = async (
  payload: PaymentPayload,
  signal: AbortSignal
): Promise<PaymentApiResponse> => {
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

  return (await res.json()) as PaymentApiResponse;
};