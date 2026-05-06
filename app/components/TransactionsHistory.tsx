"use client";

import { useDispatch, useSelector } from "react-redux";
import { selectTransaction } from "../store/paymentSlice";
import { RootState } from "../store";
import TransactionDetails from "./TransactionDetails";

export default function TransactionHistory() {
  const dispatch = useDispatch();
  const { transactions, selectedTransactionId } = useSelector((state: RootState) => state.payment);
  const selectedTx = transactions.find((tx) => tx.id === selectedTransactionId);

  

  return (
    <section className="mt-6 space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Transaction History</h2>
      {selectedTx &&  <TransactionDetails transaction={selectedTx} />}
      {transactions.map((tx) => (
        <button
          key={tx.id}
          type="button"
          onClick={() => dispatch(selectTransaction(tx.id))}
          className={`w-full rounded-2xl border p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50/40 ${
            selectedTransactionId === tx.id ? "border-indigo-300 bg-indigo-50/60" : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {new Date(tx.timestamp).toLocaleString()}
            </p>
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${
              tx.status === "success"
                ? "text-emerald-600"
                : tx.status === "failed"
                  ? "text-red-600"
                  : "text-amber-600"
            }`}
            >
              {tx.status}
            </p>
          </div>
          <p className="mt-1 text-sm text-slate-500">ID: {tx.id}</p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {tx.currency === "INR" ? "₹" : "$"}
            {tx.amount}
          </p>
        </button>
      ))}

      {!transactions.length && <p className="mt-6 text-gray-500">No transactions yet</p>}

      
    </section>
  );
}
