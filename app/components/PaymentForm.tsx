'use client';
import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detectCardType } from '../utils/card';
import { validateCardNumber, validateCVV, validateExpiry, validateName } from '../utils/validation';
import { formatCardNumber } from '../utils/format';
import CardPreview from './CardPreview';
import { makePayment } from '../utils/api';
import { RootState } from '../store';
import { addTransaction, incrementRetry, resetRetry, setError, setStatus, setTransactionId, updateTransactionStatus } from '../store/paymentSlice';
import { PaymentFormValues, Currency } from '../types/payment';
import { mapToPaymentPayload } from '../utils/mapper';

export default function PaymentForm() {
const [form, setForm] = useState<PaymentFormValues>({
  name: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  amount: '',
  currency: 'INR',
});

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const dispatch = useDispatch();
  const { currentTransactionId, retryCount, status } = useSelector(
  (state: RootState) => state.payment
);
  const cardType = useMemo(
    () => detectCardType(form.cardNumber.replace(/\s/g, '')),
    [form.cardNumber]
  );

  const isAmex = cardType === 'amex';

  const errors = {
    name: !validateName(form.name),
    cardNumber: !validateCardNumber(form.cardNumber),
    expiry: !validateExpiry(form.expiry),
    cvv: !validateCVV(form.cvv, isAmex),
    amount: Number(form.amount) <= 0,
  };

  const isFormValid = Object.values(errors).every((e) => !e);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async () => {
  if (status === 'processing') return;

  let transactionId = currentTransactionId;

  if (!transactionId) {
    transactionId = crypto.randomUUID();
    dispatch(setTransactionId(transactionId));
    dispatch(resetRetry());
        dispatch(
      addTransaction({
        id: transactionId,
        amount: Number(form.amount),
        status: 'processing',
        timestamp: Date.now(),
      })
    );
  } else {
    dispatch(incrementRetry());
  }

  dispatch(setStatus('processing'));

  const payload = mapToPaymentPayload(form, transactionId);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const data = await makePayment(payload, controller.signal);
    clearTimeout(timeout);

    if (data.status === 'success') {
      dispatch(setStatus('success'));

      dispatch(
        updateTransactionStatus({
          id: transactionId,
          status: 'success',
        })
      );
    } else {
      dispatch(setStatus('failed'));

      dispatch(
        updateTransactionStatus({
          id: transactionId,
          status: 'failed',
        })
      );
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === 'AbortError') {
      dispatch(setStatus('timeout'));

      dispatch(
        updateTransactionStatus({
          id: transactionId,
          status: 'timeout',
        })
      );
    } else {
      dispatch(setStatus('failed'));
    }
  }
};

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <CardPreview
        name={form.name}
        cardNumber={form.cardNumber}
        expiry={form.expiry}
        cardType={cardType}
      />
      {/* Name */}
      <div>
        <input
          placeholder="Cardholder Name"
          className="w-full border p-2"
          value={form.name}
          onBlur={() => handleBlur("name")}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {touched.name && errors.name && (
          <p className="text-red-500 text-sm">Invalid name</p>
        )}
      </div>

      {/* Card Number */}
      <div>
        <input
          placeholder="Card Number"
          className="w-full border p-2"
          value={form.cardNumber}
          onBlur={() => handleBlur("cardNumber")}
          onChange={(e) =>
            setForm({
              ...form,
              cardNumber: formatCardNumber(e.target.value),
            })
          }
        />
        {/* <p className="text-sm text-gray-500">{cardType}</p> */}
        {touched.cardNumber && errors.cardNumber && (
          <p className="text-red-500 text-sm">Invalid card number</p>
        )}
      </div>

      {/* Expiry */}
      <div>
        <input
          placeholder="MM/YY"
          className="w-full border p-2"
          value={form.expiry}
          onBlur={() => handleBlur("expiry")}
          onChange={(e) => setForm({ ...form, expiry: e.target.value })}
        />
        {touched.expiry && errors.expiry && (
          <p className="text-red-500 text-sm">Invalid expiry date</p>
        )}
      </div>

      {/* CVV */}
      <div>
        <input
          placeholder="CVV"
          className="w-full border p-2"
          value={form.cvv}
          onBlur={() => handleBlur("cvv")}
          onChange={(e) => setForm({ ...form, cvv: e.target.value })}
        />
        {touched.cvv && errors.cvv && (
          <p className="text-red-500 text-sm">Invalid CVV</p>
        )}
      </div>

      {/* Amount */}
      <div className="flex gap-2">
        <input
          placeholder="Amount"
          className="w-full border p-2"
          value={form.amount}
          onBlur={() => handleBlur("amount")}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <select
          className="border p-2"
          value={form.currency}
          onChange={(e) =>
            setForm({ ...form, currency: e.target.value as Currency })
          }
        >
          <option>INR</option>
          <option>USD</option>
        </select>
      </div>

      {touched.amount && errors.amount && (
        <p className="text-red-500 text-sm">Amount must be greater than 0</p>
      )}

      <button
        disabled={!isFormValid || status === "processing"}
        onClick={handleSubmit}
        className={`w-full p-2 text-white ${
          isFormValid ? "bg-black" : "bg-gray-400"
        }`}
      >
        {status === "processing" ? "Processing..." : "Pay Now"}
      </button>
      {status !== "idle" && status !== "success" && retryCount < 3 && (
        <button
          onClick={handleSubmit}
          disabled={status === "processing"}
          className="mt-4 bg-blue-600 text-white p-2 w-full"
        >
          Retry ({retryCount + 1}/3)
        </button>
      )}

      {retryCount >= 3 && status !== "success" && (
        <p className="text-red-500 mt-2">Maximum retry attempts reached</p>
      )}
    </div>
  );
}