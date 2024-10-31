import React from 'react'
import Navbar from '../components/Navbar'
import ExpenseChart from '../components/ExpenseChart'
import CategoryChart from '../components/CategoryChart'

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-8"> {/* Added pt-20 for navbar spacing */}
        
        {/* Action Buttons */}
        
        <div className="flex justify-center gap-4 mb-6">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm md:text-base">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m-8-6h16" />
            </svg>
            Add Expense
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 md:px-6 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm md:text-base">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v8m0 0v8m0-8h8m-8 0H4" />
            </svg>
            Add Loan
        </button>
        </div>

        {/* Expense Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-white mb-4">Today's Expenses</h2>
            <p className="text-4xl font-bold text-red-400">₹150.00</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-white mb-4">This Month's Expenses</h2>
            <p className="text-4xl font-bold text-red-400">₹1,050.00</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg min-h-[300px]">
            <h2 className="text-2xl font-bold text-white mb-4">Expense Chart</h2>
            {/* Chart component will go here */}
            <ExpenseChart/>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg min-h-[300px]">
            <h2 className="text-2xl font-bold text-white mb-4">Category Chart</h2>
            {/* Chart component will go here */}
            <CategoryChart/>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-500 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Petrol</p>
                  <p className="text-gray-400 text-sm">Today</p>
                </div>
              </div>
              <span className="text-red-400 font-bold">-₹350.00</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Homepage