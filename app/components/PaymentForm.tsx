'use client';
import { FormEvent, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detectCardType } from '../utils/card';
import { validateCardNumber, validateCVV, validateExpiry, validateName } from '../utils/validation';
import { formatCardNumber } from '../utils/format';
import CardPreview from './CardPreview';
import { AppDispatch, RootState } from '../store';
import { PaymentFormValues, Currency } from '../types/payment';
import TransactionHistory from './TransactionsHistory';
import StatusScreen from './StatusScreen';
import { executePaymentFlow } from '../hooks/usePaymentFlow';
import { useTransactionStorage } from '../hooks/useTransactionStorage';

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
  const dispatch = useDispatch<AppDispatch>();
  const { currentTransactionId, retryCount, status, transactions, error } = useSelector(
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
  const showError = (field: keyof typeof errors, value: string) => touched[field] || value.length > 0;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

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

const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();
  await executePayment();
};

const handleRetry = async () => {
  await executePayment();
};

  useTransactionStorage(dispatch, transactions);
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

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">Cardholder Name</label>
              <input
                id="name"
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-indigo-500 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2"
                value={form.name}
                onBlur={() => handleBlur("name")}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-describedby={showError('name', form.name) && errors.name ? 'name-error' : undefined}
              />
              {showError('name', form.name) && errors.name && (
                <p id="name-error" className="mt-1 text-xs font-medium text-red-600">Enter a valid cardholder name.</p>
              )}
            </div>

            <div>
              <label htmlFor="cardNumber" className="mb-1.5 block text-sm font-medium text-slate-700">Card Number</label>
              <input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-indigo-500 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2"
                value={form.cardNumber}
                onBlur={() => handleBlur("cardNumber")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cardNumber: formatCardNumber(e.target.value),
                  })
                }
                inputMode="numeric"
                maxLength={19}
                aria-describedby={showError('cardNumber', form.cardNumber) && errors.cardNumber ? 'cardNumber-error' : undefined}
              />
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">Detected: {cardType.toUpperCase()}</p>
              {showError('cardNumber', form.cardNumber) && errors.cardNumber && (
                <p id="cardNumber-error" className="mt-1 text-xs font-medium text-red-600">Enter a valid card number.</p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="expiry" className="mb-1.5 block text-sm font-medium text-slate-700">Expiry (MM/YY)</label>
                <input
                  id="expiry"
                  placeholder="MM/YY"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-indigo-500 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2"
                  value={form.expiry}
                  onBlur={() => handleBlur("expiry")}
                  onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                  maxLength={5}
                  aria-describedby={showError('expiry', form.expiry) && errors.expiry ? 'expiry-error' : undefined}
                />
                {showError('expiry', form.expiry) && errors.expiry && (
                  <p id="expiry-error" className="mt-1 text-xs font-medium text-red-600">Enter a valid future date.</p>
                )}
              </div>

              <div>
                <label htmlFor="cvv" className="mb-1.5 block text-sm font-medium text-slate-700">CVV</label>
                <input
                  id="cvv"
                  placeholder={isAmex ? '4 digits' : '3 digits'}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-indigo-500 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2"
                  value={form.cvv}
                  onBlur={() => handleBlur("cvv")}
                  onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "") })}
                  inputMode="numeric"
                  maxLength={isAmex ? 4 : 3}
                  aria-describedby={showError('cvv', form.cvv) && errors.cvv ? 'cvv-error' : undefined}
                />
                {showError('cvv', form.cvv) && errors.cvv && (
                  <p id="cvv-error" className="mt-1 text-xs font-medium text-red-600">Enter a valid CVV.</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-slate-700">Amount</label>
              <div className="flex gap-2">
                <input
                  id="amount"
                  placeholder="Amount"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-indigo-500 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2"
                  value={form.amount}
                  onBlur={() => handleBlur("amount")}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  inputMode="decimal"
                  aria-describedby={showError('amount', form.amount) && errors.amount ? 'amount-error' : undefined}
                />

                <select
                  aria-label="Select currency"
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-indigo-500 transition focus:border-indigo-500 focus:ring-2"
                  value={form.currency}
                  onChange={(e) =>
                    setForm({ ...form, currency: e.target.value as Currency })
                  }
                >
                  <option>INR</option>
                  <option>USD</option>
                </select>
              </div>
              {showError('amount', form.amount) && errors.amount && (
                <p id="amount-error" className="mt-1 text-xs font-medium text-red-600">Amount must be greater than 0.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid || status === "processing"}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {status === "processing" ? "Processing..." : "Pay Now"}
            </button>
          </form>
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