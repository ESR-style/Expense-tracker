import React, { useState, useEffect } from 'react';
import API from '../api.js';

function ExpensesList() {
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        API.get('/api/expenses')
            .then((response) => {
                console.log('API Response:', response.data); // Check the API response
                setExpenses(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('Failed to fetch expenses'); // Set error message
            });
    }, []);

    return (
        <div>
            <h2>Expenses</h2>
            {error && <p>{error}</p>} {/* Display error message */}
            {expenses.length === 0 ? (
                <p>No expenses to show.</p>
            ) : (
                <ul>
                    {expenses.map((expense) => (
                        <li key={expense.id}>
                            {expense.description}: ${expense.amount} on {expense.date}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ExpensesList;
