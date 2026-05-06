import { useEffect } from "react";
import { AppDispatch, RootState } from "../store";
import { loadTransactions } from "../store/paymentSlice";
import { Transaction } from "../types/payment";
import { useDispatch, useSelector } from "react-redux";

export function useTransactionStorage() {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions } = useSelector(
  (state: RootState) => state.payment
);
  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (!saved) return;

    const parsed = JSON.parse(saved) as Array<Partial<Transaction>>;
    const hydrated: Transaction[] = parsed
      .filter(
        (
          tx
        ): tx is Partial<Transaction> & {
          id: string;
          amount: number;
          status: Transaction["status"];
          timestamp: number;
        } =>
          Boolean(tx.id) &&
          typeof tx.amount === "number" &&
          Boolean(tx.status) &&
          typeof tx.timestamp === "number"
      )
      .map((tx) => ({
        id: tx.id,
        amount: tx.amount,
        status: tx.status,
        timestamp: tx.timestamp,
        currency: tx.currency === "USD" ? "USD" : "INR",
      }));

    dispatch(loadTransactions(hydrated));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);
}
