import React, { useMemo, useCallback } from "react";

export default function MonthlySummary({
  selectedMonth,
  setSelectedMonth,
  income,
  totalExpenses,
}) {
  const [year, setYear] = React.useState(new Date().getFullYear());

  const months = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  const monthName = useMemo(
    () => months[selectedMonth - 1],
    [selectedMonth, months]
  );

  const balance = useMemo(
    () => income - totalExpenses,
    [income, totalExpenses]
  );

  const handleMonthChange = useCallback(
    (direction) => {
      let newMonth = selectedMonth + direction;
      let newYear = year;

      if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      } else if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }

      setYear(newYear);
      setSelectedMonth(newMonth);
    },
    [selectedMonth, year, setSelectedMonth]
  );

  React.useEffect(() => {
    console.log("Selected Month:", selectedMonth);
    console.log("Year:", year);
  }, [selectedMonth, year]);

  return (
    <div className="prev">
      <button className="buttons" onClick={() => handleMonthChange(-1)}>
        ⬅ Previous
      </button>
      <strong className="month-display">
        {monthName} {year}
      </strong>
      <button className="buttons" onClick={() => handleMonthChange(1)}>
        Next ➡
      </button>
      <h2>Monthly Summary</h2>
      <div className="monthly">
        <p className="financial-block">Income: ${income.toFixed(2)}</p>
        <p className="financial-block">Expenses: ${totalExpenses.toFixed(2)}</p>
        <p className="financial-block">Balance: ${balance.toFixed(2)}</p>
      </div>
    </div>
  );
}
