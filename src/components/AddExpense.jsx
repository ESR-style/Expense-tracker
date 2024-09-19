import React, { useState } from 'react';
import API from '../api.js';

function AddExpense() {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState(''); 

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Convert amount to number
        const formattedAmount = parseFloat(amount);
        
        API.post('/expenses', { description, amount: formattedAmount, category, date })
            .then(() => {
                setMessage('Expense added successfully!');
                setDescription(''); // Clear the form
                setAmount('');
                setCategory('');
                setDate('');

                setTimeout(()=>{
                    setMessage('')
                },3000);
            })
            .catch((error) => {
                console.error('Error adding expense:', error);
                setMessage('Error adding expense. Please try again.');
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Name"
                required
            />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                required
            />
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                required
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            <button type="submit">Add Expense</button>

            {message && <p>{message}</p>} {/* Display success or error message */}
        </form>
    );
}

export default AddExpense;
