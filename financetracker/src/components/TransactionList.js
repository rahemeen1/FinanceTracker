import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TransactionItem from "./TransactionItem";
import {
  deleteTransaction,
  setEditingTransaction,
} from "./redux/transactionSlice";

export default function TransactionList() {
  const dispatch = useDispatch();
  const { transactions, selectedMonth, year } = useSelector(
    (state) => state.transaction
  );

  const handleEdit = (transaction) => {
    dispatch(setEditingTransaction(transaction));
  };

  const handleDelete = (id) => {
    dispatch(deleteTransaction(id));
  };

  // Filter transactions based on selected month and year
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() + 1 === selectedMonth &&
      transactionDate.getFullYear() === year
    );
  });

  if (filteredTransactions.length === 0) {
    return (
      <div>No transactions available for the selected month and year.</div>
    );
  }

  return (
    <div className="transaction-list">
      <h2>Transaction List</h2>
      <ul>
        {filteredTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}
