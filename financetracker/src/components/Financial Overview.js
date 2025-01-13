import React, { useMemo } from "react";
import { useSelector } from "react-redux";

export default function FinancialOverview() {
  const { transactions, selectedMonth, year, incomeByMonth } = useSelector(
    (state) => state.transaction
  );

  const incomeKey = `${year}-${String(selectedMonth).padStart(2, "0")}`;
  const income = incomeByMonth[incomeKey] || 0;

  const categorizedExpenses = useMemo(() => {
    const categories = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).getMonth() + 1;
      const transactionYear = new Date(transaction.date).getFullYear();
      if (month === selectedMonth && transactionYear === year) {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
      }
      return acc;
    }, {});
    return categories;
  }, [transactions, selectedMonth, year]);

  const totalExpenses = Object.values(categorizedExpenses).reduce(
    (acc, amount) => acc + amount,
    0
  );

  const balance = income - totalExpenses;

  return (
    <div className="details">
      <h2>Financial Overview for {incomeKey}</h2>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(categorizedExpenses).map(([category, amount]) => (
            <tr key={category}>
              <td>{category}</td>
              <td>${amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
