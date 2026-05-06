'use client';
import { useState, useMemo } from 'react';
import { detectCardType } from '../utils/card';
import { validateCardNumber, validateCVV, validateExpiry, validateName } from '../utils/validation';
import { formatCardNumber } from '../utils/format';
import CardPreview from './CardPreview';

export default function PaymentForm() {
  const [form, setForm] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    amount: '',
    currency: 'INR',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
        >
          <option>INR</option>
          <option>USD</option>
        </select>
      </div>

      {touched.amount && errors.amount && (
        <p className="text-red-500 text-sm">Amount must be greater than 0</p>
      )}

      <button
        disabled={!isFormValid}
        className={`w-full p-2 text-white ${
          isFormValid ? "bg-black" : "bg-gray-400"
        }`}
      >
        Pay Now
      </button>
    </div>
  );
}