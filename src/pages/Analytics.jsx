import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import ExpenseChart from '../components/ExpenseChart'
import CategoryChart from '../components/CategoryChart'

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMonthlyExpenses();
  }, [selectedDate]);

  const fetchMonthlyExpenses = async () => {
    if (!token) return;

    try {
      const response = await fetch('https://expense-tracker-backend-rose.vercel.app/api/expenses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Convert selected date to string format (YYYY-MM)
        const selectedMonthStr = `${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}`;
        
        // Filter expenses for selected month and year
        const filteredExpenses = data.filter(expense => 
          expense.date.startsWith(selectedMonthStr)
        );
        
        setExpenses(filteredExpenses);
        calculateAnalytics(filteredExpenses);
      }
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
  };

  const calculateAnalytics = (filteredExpenses) => {
    // Calculate total expense
    const total = filteredExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    setTotalExpense(total);

    // Calculate category-wise totals
    const categories = filteredExpenses.reduce((acc, curr) => {
      const category = curr.category;
      acc[category] = (acc[category] || 0) + parseFloat(curr.amount);
      return acc;
    }, {});
    setCategoryTotals(categories);
  };

  // Generate array of years (only 2024 and 2025)
  const years = [2024, 2025];
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i).toLocaleString('default', { month: 'long' })
  }));

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Date Selection */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <select
            value={selectedDate.month}
            onChange={(e) => setSelectedDate(prev => ({ ...prev, month: parseInt(e.target.value) }))}
            className="bg-gray-800 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto"
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            value={selectedDate.year}
            onChange={(e) => setSelectedDate(prev => ({ ...prev, year: parseInt(e.target.value) }))}
            className="bg-gray-800 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Total Expense Card */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Total Expenses</h2>
          <p className="text-3xl sm:text-4xl font-bold text-red-400">₹{totalExpense.toFixed(2)}</p>
        </div>

        {/* Charts - Updated container heights */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-6 sm:mb-8">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Expense Trends</h2>
            <div className="h-[250px]">
              <ExpenseChart expenses={expenses} />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Category Distribution</h2>
            <div className="h-[250px]">
              <CategoryChart expenses={expenses} />
            </div>
          </div>
        </div>

        {/* Category-wise Breakdown */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Category Breakdown</h2>
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between p-3 sm:p-4 bg-gray-700 rounded-lg">
                <span className="text-white font-semibold text-sm sm:text-base">{category}</span>
                <span className="text-red-400 font-bold text-sm sm:text-base">₹{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
