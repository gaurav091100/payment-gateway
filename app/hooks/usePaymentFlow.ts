import { makePayment } from "../utils/api";
import { mapToPaymentPayload } from "../utils/mapper";
import { AppDispatch } from "../store";
import {
  addTransaction,
  incrementRetry,
  resetRetry,
  selectTransaction,
  setError,
  setStatus,
  setTransactionId,
  updateTransactionStatus,
} from "../store/paymentSlice";
import { PaymentFormValues, PaymentStatus } from "../types/payment";

interface ExecutePaymentParams {
  dispatch: AppDispatch;
  form: PaymentFormValues;
  isFormValid: boolean;
  status: PaymentStatus;
  retryCount: number;
  currentTransactionId: string | null;
}

export async function executePaymentFlow({
  dispatch,
  form,
  isFormValid,
  status,
  retryCount,
  currentTransactionId,
}: ExecutePaymentParams) {
  if (status === "processing" || !isFormValid) return;

  let transactionId = currentTransactionId;
  const isRetry = Boolean(transactionId);

  if (isRetry && retryCount >= 2) {
    dispatch(setError("Maximum retry attempts reached for this transaction."));
    return;
  }

  if (!transactionId) {
    transactionId = crypto.randomUUID();
    dispatch(setTransactionId(transactionId));
    dispatch(selectTransaction(transactionId));
    dispatch(resetRetry());
    dispatch(setError(""));
    dispatch(
      addTransaction({
        id: transactionId,
        amount: Number(form.amount),
        currency: form.currency,
        status: "processing",
        timestamp: Date.now(),
      })
    );
  } else {
    dispatch(incrementRetry());
  }

  dispatch(setStatus("processing"));
  const payload = mapToPaymentPayload(form, transactionId);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  const setTxStatus = (nextStatus: PaymentStatus, message?: string) => {
    dispatch(setStatus(nextStatus));
    if (typeof message === "string") dispatch(setError(message));
    dispatch(
      updateTransactionStatus({
        id: transactionId!,
        status: nextStatus,
      })
    );
  };

  try {
    const data = await makePayment(payload, controller.signal);
    clearTimeout(timeout);

    if (data.status === "success") {
      dispatch(setError(""));
      setTxStatus("success");
      dispatch(setTransactionId(null));
      dispatch(resetRetry());
      return;
    }

    if (data.status === "failed") {
      setTxStatus("failed", data.reason ?? "Payment failed. Please try again.");
      return;
    }

    setTxStatus("timeout", "Request timed out. Please retry.");
  } catch (error: unknown) {
    clearTimeout(timeout);
    if (error instanceof DOMException && error.name === "AbortError") {
      setTxStatus("timeout", "Request timed out. Please retry.");
      return;
    }

    dispatch(setStatus("failed"));
    dispatch(setError("Network issue. Check your internet connection and try again."));
  }
}
