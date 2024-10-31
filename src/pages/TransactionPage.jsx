import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const TransactionPage = () => {
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Dummy transaction data
  const transactions = [
    { id: 1, type: 'expense', category: 'Food', amount: 250, date: '2024-03-25', description: 'Restaurant' },
    { id: 2, type: 'expense', category: 'Transport', amount: 350, date: '2024-03-24', description: 'Petrol' },
    { id: 3, type: 'expense', category: 'Shopping', amount: 1500, date: '2024-03-23', description: 'Clothing' },
    { id: 4, type: 'expense', category: 'Bills', amount: 2000, date: '2024-03-22', description: 'Electricity' },
    { id: 5, type: 'loan', category: 'Loan', amount: 5000, date: '2024-03-21', description: 'Personal Loan' },
    // Add more dummy transactions as needed
  ];

  // Get current transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Calculate total pages
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Transactions</h1>
          <div className="flex gap-4">
            <select 
              className="bg-gray-800 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="text-gray-300 hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">{transaction.date}</td>
                    <td className="px-6 py-4">{transaction.category}</td>
                    <td className="px-6 py-4">{transaction.description}</td>
                    <td className={`px-6 py-4 text-right ${
                      transaction.type === 'expense' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {transaction.type === 'expense' ? '-' : '+'} ₹{transaction.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center px-6 py-4 border-t border-gray-700">
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50 hover:bg-gray-600"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50 hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TransactionPage