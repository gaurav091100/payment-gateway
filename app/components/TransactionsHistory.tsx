"use client";

import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function TransactionHistory() {
  const { transactions } = useSelector((state: RootState) => state.payment);

  if (!transactions.length) {
    return <p className="mt-6 text-gray-500">No transactions yet</p>;
  }

  return (
    <div className="mt-6 space-y-2">
      <h2 className="font-bold text-lg">Transaction History</h2>

      {transactions.map((tx) => (
        <div key={tx.id} className="border p-3 rounded">
          <p className="text-sm">ID: {tx.id}</p>
          <p>Amount: ₹{tx.amount}</p>

          <p
            className={`${
              tx.status === "success"
                ? "text-green-600"
                : tx.status === "failed"
                  ? "text-red-600"
                  : "text-yellow-600"
            }`}
          >
            Status: {tx.status}
          </p>

          <p className="text-xs text-gray-500">
            {new Date(tx.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
