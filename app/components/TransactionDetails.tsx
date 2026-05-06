import { Transaction } from "../types/payment";

export default function TransactionDetails({
  transaction,
}: {
  transaction: Transaction;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-slate-900">
        Transaction Details
      </h3>
      <p className="mt-2 text-sm text-slate-600">ID: {transaction.id}</p>
      <p className="text-sm text-slate-700">
        Amount: {transaction.currency === "INR" ? "₹" : "$"}
        {transaction.amount}
      </p>
      <p className="text-sm text-slate-700">
        Status:{" "}
        <span
          className={`uppercase font-bold ${
            transaction.status === "success"
              ? "text-emerald-600"
              : transaction.status === "failed"
                ? "text-red-600"
                : "text-amber-600"
          }`}
        >
          {transaction.status}
        </span>
      </p>
      <p className="text-xs text-slate-500">
        {new Date(transaction.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
