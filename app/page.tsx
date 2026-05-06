'use client';
import { FormEvent, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detectCardType } from './utils/card';
import { validateCardNumber, validateCVV, validateExpiry, validateName } from './utils/validation';
import CardPreview from './components/CardPreview';
import { AppDispatch, RootState } from './store';
import { PaymentFormValues } from './types/payment';
import TransactionHistory from './components/TransactionsHistory';
import StatusScreen from './components/StatusScreen';
import { executePaymentFlow } from './hooks/usePaymentFlow';
import { useTransactionStorage } from './hooks/useTransactionStorage';
import PaymentForm from './components/PaymentForm';

export default function Home() {
const [form, setForm] = useState<PaymentFormValues>({
  name: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  amount: '',
  currency: 'INR',
});


  const dispatch = useDispatch<AppDispatch>();
  const { currentTransactionId, retryCount, status, error } = useSelector(
  (state: RootState) => state.payment
);

  const cardType = useMemo(
    () => detectCardType(form.cardNumber.replace(/\s/g, '')),
    [form.cardNumber]
  );

  const isAmex = cardType === 'amex';

  const errors = {
    name: !validateName(form.name),
    cardNumber: !validateCardNumber(form.cardNumber, cardType),
    expiry: !validateExpiry(form.expiry),
    cvv: !validateCVV(form.cvv, isAmex),
    amount: Number(form.amount) <= 0,
  };

  const isFormValid = Object.values(errors).every((e) => !e);

  const executePayment = async () => {
    await executePaymentFlow({
      dispatch,
      form,
      isFormValid,
      status,
      retryCount,
      currentTransactionId,
    });
  };


const handleRetry = async () => {
  await executePayment();
};

  useTransactionStorage();
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Checkout</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Complete Payment</h1>
            <p className="mt-1 text-sm text-slate-500">Your payment is encrypted and securely processed.</p>
          </div>
          <CardPreview
            name={form.name}
            cardNumber={form.cardNumber}
            expiry={form.expiry}
            cardType={cardType}
          />

          <PaymentForm form={form} setForm={setForm} errors={errors} executePayment={executePayment}  isFormValid={isFormValid} cardType={cardType} isAmex={isAmex} />
        </section>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Payment Status</h2>
            <StatusScreen status={status} error={error} />
            {status !== "idle" && status !== "success" && retryCount < 2 && (
              <button
                onClick={() => void handleRetry()}
                disabled={status === "processing"}
                className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                Retry (Attempt {retryCount + 2} of 3)
              </button>
            )}

            {retryCount >= 2 && status !== "success" && (
              <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                Maximum retry attempts reached
              </p>
            )}
          </section>

          <TransactionHistory />
        </aside>
      </div>
    </main>
  );
}