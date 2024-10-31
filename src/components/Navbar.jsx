// Navbar.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-gray-900 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text hover:from-blue-500 hover:to-purple-600 transition duration-300">
              SpendScope
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                Dashboard
              </Link>
              <Link to="/transactions" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                Transactions
              </Link>
              <Link to="/analytics" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                Analytics
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <button className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white transition duration-150">
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">
            Dashboard
          </Link>
          <Link to="/transactions" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">
            Transactions
          </Link>
          <Link to="/analytics" className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium">
            Analytics
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar