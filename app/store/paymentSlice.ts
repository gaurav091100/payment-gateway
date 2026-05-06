import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentStatus, Transaction } from '../types/payment';

interface PaymentState {
  status: PaymentStatus;
  transactions: Transaction[];
  currentTransactionId: string | null;
  selectedTransactionId: string | null;
  retryCount: number;
  error?: string;
}

const initialState: PaymentState = {
  status: 'idle',
  transactions: [],
  currentTransactionId: null,
  selectedTransactionId: null,
  retryCount: 0,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<PaymentStatus>) {
      state.status = action.payload;
    },
    setTransactionId(state, action: PayloadAction<string | null>) {
      state.currentTransactionId = action.payload;
    },
    incrementRetry(state) {
      state.retryCount += 1;
    },
    resetRetry(state) {
      state.retryCount = 0;
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transactions.unshift(action.payload);
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    loadTransactions(state, action: PayloadAction<Transaction[]>) {
      state.transactions = action.payload;
    },
    selectTransaction(state, action: PayloadAction<string | null>) {
      state.selectedTransactionId = action.payload;
    },
    updateTransactionStatus(
      state,
      action: PayloadAction<{
        id: string;
        status: PaymentStatus;
      }>,
    ) {
      const tx = state.transactions.find((t) => t.id === action.payload.id);
      if (tx) {
        tx.status = action.payload.status;
      }
    },
  },
});

export const {
  setStatus,
  setTransactionId,
  incrementRetry,
  resetRetry,
  addTransaction,
  setError,
  loadTransactions,
  updateTransactionStatus,
  selectTransaction
} = paymentSlice.actions;

export default paymentSlice.reducer;