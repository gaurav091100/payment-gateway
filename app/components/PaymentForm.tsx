"use client";
import { useSelector } from "react-redux";
import { CardType, Currency, PaymentFormValues } from "../types/payment";
import { formatCardNumber } from "../utils/format";
import { RootState } from "../store";
import { useState } from "react";

interface Props {
  form: PaymentFormValues;
  setForm: React.Dispatch<React.SetStateAction<PaymentFormValues>>;
  errors: Record<string, boolean>;
  executePayment: () => void;
  cardType: CardType;
  isAmex: boolean;
  isFormValid: boolean;
}
export default function PaymentForm({
  form,
  setForm,
  errors,
  executePayment,
  cardType,
  isAmex,
  isFormValid,
}: Props) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { status } = useSelector((state: RootState) => state.payment);

  const showError = (field: keyof typeof errors, value: string) => touched[field] || value.length > 0;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await executePayment();
  };
  
  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Cardholder Name
        </label>
        <input
          id="name"
          placeholder="John Doe"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-indigo-500 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2"
          value={form.name}
          onBlur={() => handleBlur("name")}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          aria-describedby={
            showError("name", form.name) && errors.name
              ? "name-error"
              : undefined
          }
        />
        {showError("name", form.name) && errors.name && (
          <p id="name-error" className="mt-1 text-xs font-medium text-red-600">
            Enter a valid cardholder name.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="cardNumber"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Card Number
        </label>
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
          aria-describedby={
            showError("cardNumber", form.cardNumber) && errors.cardNumber
              ? "cardNumber-error"
              : undefined
          }
        />
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          Detected: {cardType.toUpperCase()}
        </p>
        {showError("cardNumber", form.cardNumber) && errors.cardNumber && (
          <p
            id="cardNumber-error"
            className="mt-1 text-xs font-medium text-red-600"
          >
            Enter a valid card number.
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="expiry"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Expiry (MM/YY)
          </label>
          <input
            id="expiry"
            placeholder="MM/YY"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-indigo-500 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2"
            value={form.expiry}
            onBlur={() => handleBlur("expiry")}
            onChange={(e) => setForm({ ...form, expiry: e.target.value })}
            maxLength={5}
            aria-describedby={
              showError("expiry", form.expiry) && errors.expiry
                ? "expiry-error"
                : undefined
            }
          />
          {showError("expiry", form.expiry) && errors.expiry && (
            <p
              id="expiry-error"
              className="mt-1 text-xs font-medium text-red-600"
            >
              Enter a valid future date.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cvv"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            CVV
          </label>
          <input
            id="cvv"
            placeholder={isAmex ? "4 digits" : "3 digits"}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-indigo-500 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2"
            value={form.cvv}
            onBlur={() => handleBlur("cvv")}
            onChange={(e) =>
              setForm({ ...form, cvv: e.target.value.replace(/\D/g, "") })
            }
            inputMode="numeric"
            maxLength={isAmex ? 4 : 3}
            aria-describedby={
              showError("cvv", form.cvv) && errors.cvv ? "cvv-error" : undefined
            }
          />
          {showError("cvv", form.cvv) && errors.cvv && (
            <p id="cvv-error" className="mt-1 text-xs font-medium text-red-600">
              Enter a valid CVV.
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="amount"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Amount
        </label>
        <div className="flex gap-2">
          <input
            id="amount"
            placeholder="Amount"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-indigo-500 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2"
            value={form.amount}
            onBlur={() => handleBlur("amount")}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            inputMode="decimal"
            aria-describedby={
              showError("amount", form.amount) && errors.amount
                ? "amount-error"
                : undefined
            }
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
        {showError("amount", form.amount) && errors.amount && (
          <p
            id="amount-error"
            className="mt-1 text-xs font-medium text-red-600"
          >
            Amount must be greater than 0.
          </p>
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
  );
}
