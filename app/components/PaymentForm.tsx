'use client';

import { useState } from 'react';

export default function PaymentForm() {
  const [form, setForm] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    amount: '',
    currency: 'INR',
  });

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <input
        placeholder="Cardholder Name"
        className="w-full border p-2"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Card Number"
        className="w-full border p-2"
        value={form.cardNumber}
        onChange={(e) =>
          setForm({ ...form, cardNumber: e.target.value })
        }
      />

      <input
        placeholder="MM/YY"
        className="w-full border p-2"
        value={form.expiry}
        onChange={(e) =>
          setForm({ ...form, expiry: e.target.value })
        }
      />

      <input
        placeholder="CVV"
        className="w-full border p-2"
        value={form.cvv}
        onChange={(e) => setForm({ ...form, cvv: e.target.value })}
      />

      <div className="flex gap-2">
        <input
          placeholder="Amount"
          className="w-full border p-2"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <select
          className="border p-2"
          value={form.currency}
          onChange={(e) =>
            setForm({ ...form, currency: e.target.value })
          }
        >
          <option>INR</option>
          <option>USD</option>
        </select>
      </div>

      <button className="w-full bg-black text-white p-2">
        Pay Now
      </button>
    </div>
  );
}