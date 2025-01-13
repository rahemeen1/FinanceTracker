import React, { useMemo } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Header from "./components/Header";
import FinancialOverview from "./components/Financial Overview";
import MonthlySummary from "./components/MonthlySummary";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedMonth,
  setIncome,
  addTransaction,
  setEditingTransaction,
  deleteTransaction,
  setYear,
} from "./components/redux/transactionSlice";
import "./styles/styles.css";

function App() {
  const dispatch = useDispatch();
  const {
    incomeByMonth,
    transactions,
    editingTransaction,
    selectedMonth,
    year,
  } = useSelector((state) => state.transaction);

  // Filter transactions by selected month and year
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() + 1 === selectedMonth &&
        transactionDate.getFullYear() === year
      );
    });
  }, [transactions, selectedMonth, year]);

  // Calculate total expenses for the filtered transactions
  const totalExpenses = useMemo(() => {
    return filteredTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  }, [filteredTransactions]);

  // Generate income key and get income for the selected month
  const incomeKey = useMemo(
    () => `${year}-${String(selectedMonth).padStart(2, "0")}`,
    [selectedMonth, year]
  );
  const income = useMemo(
    () => incomeByMonth[incomeKey] || 0,
    [incomeByMonth, incomeKey]
  );

  return (
    <div>
      <Header />
      <div className="container">
        <br />
        <MonthlySummary
          selectedMonth={selectedMonth}
          setSelectedMonth={(month) => dispatch(setSelectedMonth(month))}
          year={year}
          setYear={(newYear) => dispatch(setYear(newYear))}
          income={income}
          totalExpenses={totalExpenses}
        />
        <FinancialOverview
          income={income}
          transactions={filteredTransactions}
        />
        <div className="form-container">
          <TransactionForm
            income={income}
            setIncome={(newIncome) => dispatch(setIncome(newIncome))}
            transactions={filteredTransactions}
            addTransaction={(transaction) =>
              dispatch(addTransaction(transaction))
            }
            editingTransaction={editingTransaction}
            setEditingTransaction={(transaction) =>
              dispatch(setEditingTransaction(transaction))
            }
          />
          <TransactionList
            transactions={filteredTransactions}
            onEdit={(transaction) =>
              dispatch(setEditingTransaction(transaction))
            }
            onDelete={(id) => dispatch(deleteTransaction(id))}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
