import React from 'react';
import ExpensesList from '../components/ExpensesList.jsx';
import AddExpense from '../components/AddExpense.jsx';

function App() {
    return (
        <div className="App">
            <h1>Expense Tracker</h1>
            <AddExpense />
            <ExpensesList />
        </div>
    );
}

export default App;

