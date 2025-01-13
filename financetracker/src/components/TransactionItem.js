import React from "react";

export default function TransactionItem({ transaction, onEdit, onDelete }) {
  return (
    <li className="transaction-item">
      <strong>Category:</strong> {transaction.category} <br />
      <strong>Amount:</strong> ${transaction.amount} <br />
      <strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}{" "}
      <br />
      {transaction.category === "Others" && transaction.description && (
        <span>
          {" "}
          <strong>Description:</strong> {transaction.description}
        </span>
      )}
      <br />
      <button onClick={() => onEdit(transaction)}>Edit</button>
      <button onClick={() => onDelete(transaction.id)}>Delete</button>
    </li>
  );
}
