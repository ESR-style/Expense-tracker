import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ExpenseChart from '../components/ExpenseChart'
import CategoryChart from '../components/CategoryChart'
import ExpenseModal from '../components/ExpenseModal'
import LoanModal from '../components/LoanModal'

const Homepage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [todayExpense, setTodayExpense] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setIsLoading(true);
    if (!token) {
      setExpenses([]);
      return;
    }

    try {
      const response = await fetch('https://expense-tracker-backend-rose.vercel.app/api/expenses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Filter for current month
        const currentMonth = new Date().toISOString().slice(0, 7);
        const currentMonthExpenses = data.filter(expense => 
          expense.date.startsWith(currentMonth)
        );
        setExpenses(currentMonthExpenses);
        calculateExpenses(currentMonthExpenses);
      }
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
    setIsLoading(false);
  };

  const calculateExpenses = (data) => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    const todayTotal = data
      .filter(expense => expense.date.startsWith(today))
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    const monthlyTotal = data
      .filter(expense => expense.date.startsWith(thisMonth))
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    setTodayExpense(todayTotal);
    setMonthlyExpense(monthlyTotal);
  };

  const handleAddExpenseClick = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const response = await fetch('https://expense-tracker-backend-rose.vercel.app/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expenseData)
      });
      
      if (response.ok) {
        const newExpense = await response.json();
        const updatedExpenses = [newExpense, ...expenses];
        setExpenses(updatedExpenses);
        calculateExpenses(updatedExpenses);
      }
    } catch (err) {
      console.error('Failed to add expense:', err);
    }
  };

  const handleAddLoan = async (loanData) => {
    try {
      const response = await fetch('https://expense-tracker-backend-rose.vercel.app/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          person_name: loanData.personName,
          amount: parseFloat(loanData.amount),
          type: loanData.type,
          description: loanData.description || 'No description', // Added default
          status: 'active', // Added required field
          due_date: null // Added optional field
        })
      });
        
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error:', errorData);
        throw new Error('Failed to add loan');
      }
  
      const newLoan = await response.json();
      setLoans(prevLoans => [newLoan, ...prevLoans]);
      calculateTotals([newLoan, ...loans]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to add loan:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative">
        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-12">
          <button 
            onClick={handleAddExpenseClick}
            className="group relative bg-gradient-to-r from-cyan-500/90 to-blue-600/90 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
            <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m-8-6h16" />
            </svg>
            <span className="font-medium">Add Expense</span>
          </button>
          <button
            onClick={() => setIsLoanModalOpen(true)}
            className="group relative bg-gradient-to-r from-fuchsia-500/90 to-purple-600/90 hover:from-fuchsia-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
            <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v8m0 0v8m0-8h8m-8 0H4" />
            </svg>
            <span className="font-medium">Add Loan</span>
          </button>
        </div>

        {/* Expense Cards */}
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 mb-12">
          <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-950/50 rounded-2xl p-8 shadow-xl transition-all duration-500 hover:shadow-2xl border border-gray-800/50 backdrop-blur-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-lg font-semibold text-gray-300 mb-2">Today's Expenses</h2>
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              ₹{todayExpense.toFixed(2)}
            </p>
          </div>

          <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-950/50 rounded-2xl p-8 shadow-xl transition-all duration-500 hover:shadow-2xl border border-gray-800/50 backdrop-blur-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-lg font-semibold text-gray-300 mb-2">Monthly Expenses</h2>
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-fuchsia-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              ₹{monthlyExpense.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Charts Section - Updated container heights */}
        <div className="grid gap-4 sm:gap-8 grid-cols-1 md:grid-cols-2 mb-8 sm:mb-12">
          <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-950/50 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md border border-gray-800/50 min-h-[350px] transition-all duration-300 hover:shadow-2xl group overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            
            <h2 className="relative text-lg sm:text-xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text mb-4">
              Expense Trends
            </h2>
            <div className="relative h-[250px] bg-gray-900/40 rounded-xl border border-gray-800/50 backdrop-blur-sm shadow-inner">
              <ExpenseChart expenses={expenses} />
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-950/50 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md border border-gray-800/50 min-h-[350px] transition-all duration-300 hover:shadow-2xl group overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-purple-600/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            
            <h2 className="relative text-lg sm:text-xl font-bold text-transparent bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text mb-4">
              Category Distribution
            </h2>
            <div className="relative h-[250px] bg-gray-900/40 rounded-xl border border-gray-800/50 backdrop-blur-sm shadow-inner">
              <CategoryChart expenses={expenses} />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 rounded-2xl p-8 shadow-xl border border-gray-800/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Recent Transactions
            </h2>
            <button className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
              View All →
            </button>
          </div> {/* Added this closing div tag */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No transactions yet</p>
              </div>
            ) : (
              expenses.slice(0, 5).map((expense) => (
                <div key={expense.transaction_id} 
                  className="group flex items-center justify-between p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl transition-all duration-300 hover:bg-gray-800/50 hover:scale-[1.02] hover:shadow-lg border border-gray-800/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-500/80 to-blue-600/80 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold group-hover:text-cyan-400 transition-colors duration-300">{expense.description}</p>
                      <p className="text-gray-400 text-sm">{expense.category}</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                    -₹{parseFloat(expense.amount).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modals */}
        <ExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddExpense={handleAddExpense} />
        <LoanModal isOpen={isLoanModalOpen} onClose={() => setIsLoanModalOpen(false)} onAddLoan={handleAddLoan} />
      </main>
    </div>
  );
};

export default Homepage;