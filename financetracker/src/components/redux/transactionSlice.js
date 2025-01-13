import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  incomeByMonth: JSON.parse(localStorage.getItem("incomeByMonth")) || {},
  transactions: JSON.parse(localStorage.getItem("transactions")) || [],
  editingTransaction: null,
  selectedMonth: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      const transaction = action.payload;
      if (state.editingTransaction) {
        // Edit existing transaction
        state.transactions = state.transactions.map((t) =>
          t.id === state.editingTransaction.id
            ? { ...transaction, id: t.id }
            : t
        );
        state.editingTransaction = null;
      } else {
        // Add new transaction
        state.transactions.push({ ...transaction, id: Date.now() });
      }
      localStorage.setItem("transactions", JSON.stringify(state.transactions));
    },
    setEditingTransaction: (state, action) => {
      state.editingTransaction = action.payload;
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
      localStorage.setItem("transactions", JSON.stringify(state.transactions));
    },
    setIncome: (state, action) => {
      const { income, month, year } = action.payload;
      const incomeKey = `${year}-${String(month).padStart(2, "0")}`;
      state.incomeByMonth[incomeKey] = income;
      localStorage.setItem(
        "incomeByMonth",
        JSON.stringify(state.incomeByMonth)
      );
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    setYear: (state, action) => {
      state.year = action.payload;
    },
  },
});

export const {
  addTransaction,
  setEditingTransaction,
  deleteTransaction,
  setIncome,
  setSelectedMonth,
  setYear,
} = transactionSlice.actions;

export default transactionSlice.reducer;
