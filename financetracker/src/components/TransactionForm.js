import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  addTransaction,
  setIncome,
  setEditingTransaction,
} from "./redux/transactionSlice";

const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Health",
  "Utilities",
  "Grocery",
  "Bills",
  "Others",
];

const TransactionForm = () => {
  const dispatch = useDispatch();
  const { incomeByMonth, editingTransaction, selectedMonth, year } =
    useSelector((state) => state.transaction);

  const incomeKey = `${year}-${String(selectedMonth).padStart(2, "0")}`;
  const currentIncome = incomeByMonth[incomeKey] || 0;
  const minDate = `${year}-${String(selectedMonth).padStart(2, "0")}-01`;
  const maxDate = new Date(year, selectedMonth, 0).toISOString().split("T")[0];

  const [incomeAmount, setIncomeAmount] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  // Yup validation schema
  const incomeValidationSchema = Yup.object().shape({
    incomeAmount: Yup.number().min(0, "Income must be a positive number"),
  });

  const transactionValidationSchema = Yup.object().shape({
    transactionAmount: Yup.number()
      .min(0, "Transaction amount must be positive")
      .required("Transaction amount is required"),
    date: Yup.date()
      .min(minDate, `Date cannot be before ${minDate}`)
      .max(maxDate, `Date cannot be after ${maxDate}`)
      .required("Date is required"),
    category: Yup.string().required("Category is required"),
    description: Yup.string().when("category", {
      is: "Others",
      then: Yup.string().required(
        "Description is required for 'Others' category"
      ),
    }),
  });

  useEffect(() => {
    if (editingTransaction) {
      setTransactionAmount(editingTransaction.amount);
      setDescription(editingTransaction.description);
      setDate(editingTransaction.date);
      setCategory(editingTransaction.category);
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  const resetForm = () => {
    setTransactionAmount("");
    setDescription("");
    setDate("");
    setCategory("");
    setErrors({});
  };

  const handleIncomeUpdate = async (e) => {
    e.preventDefault();
    try {
      await incomeValidationSchema.validate(
        { incomeAmount },
        { abortEarly: false }
      );
      dispatch(
        setIncome({
          income: parseFloat(incomeAmount),
          month: selectedMonth,
          year,
        })
      );
      setIncomeAmount("");
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    const values = {
      transactionAmount,
      date,
      category,
      description,
    };
    try {
      await transactionValidationSchema.validate(values, { abortEarly: false });
      const transaction = {
        amount: parseFloat(transactionAmount),
        description,
        date,
        category,
      };
      dispatch(addTransaction(transaction));
      resetForm();
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <h1>Current Income: ${currentIncome}</h1>
      <form onSubmit={handleIncomeUpdate}>
        <label htmlFor="incomeInput">Update your Income</label>
        <input
          type="number"
          id="incomeInput"
          value={incomeAmount}
          onChange={(e) => setIncomeAmount(e.target.value)}
          placeholder="Enter your amount"
          min={0}
        />
        {errors.incomeAmount && (
          <div className="error">{errors.incomeAmount}</div>
        )}
        <button type="submit">Update Income</button>
      </form>

      <div className="form">
        <h3>{editingTransaction ? "Edit" : "Add"} Transaction</h3>
        <form onSubmit={handleTransactionSubmit}>
          <label>Amount</label>
          <input
            type="number"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
            placeholder="Amount"
            required
          />
          {errors.transactionAmount && (
            <div className="error">{errors.transactionAmount}</div>
          )}

          <label>Expense Date</label>
          <input
            type="date"
            value={date}
            min={minDate}
            max={maxDate}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          {errors.date && <div className="error">{errors.date}</div>}

          <label>Expense Category</label>
          <select
            className="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <div className="error">{errors.category}</div>}

          {category === "Others" && (
            <>
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
              {errors.description && (
                <div className="error">{errors.description}</div>
              )}
            </>
          )}
          <button type="submit">
            {editingTransaction ? "Update" : "Add"} Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
