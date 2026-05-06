import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'timeout';

interface Transaction {
  id: string;
  amount: number;
  status: PaymentStatus;
  timestamp: number;
}

interface PaymentState {
  status: PaymentStatus;
  transactions: Transaction[];
  currentTransactionId: string | null;
  retryCount: number;
  error?: string;
}

const initialState: PaymentState = {
  status: 'idle',
  transactions: [],
  currentTransactionId: null,
  retryCount: 0,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<PaymentStatus>) {
      state.status = action.payload;
    },
    setTransactionId(state, action: PayloadAction<string>) {
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
  updateTransactionStatus
} = paymentSlice.actions;

export default paymentSlice.reducer;