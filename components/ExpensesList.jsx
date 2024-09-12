import React, { useState, useEffect } from 'react';
import API from '../src/api.js';

function ExpensesList() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        API.get('/expenses')
            .then((response) => {
                setExpenses(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h2>Expenses</h2>
            <ul>
                {expenses.map((expense) => (
                    <li key={expense.id}>
                        {expense.description}: ${expense.amount} on {expense.date}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ExpensesList;
