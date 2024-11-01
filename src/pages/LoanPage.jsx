// src/pages/LoanPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import LoanModal from '../components/LoanModal';
import AlertModal from '../components/AlertModal';

const LoanPage = () => {
  const [loans, setLoans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [totalToReceive, setTotalToReceive] = useState(0);
  const [totalToGive, setTotalToGive] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, loanId: null });
  const dropdownRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/loans', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLoans(data);
        calculateTotals(data);
      }
    } catch (err) {
      console.error('Failed to fetch loans:', err);
    }
  };

  const calculateTotals = (loansData) => {
    const { toReceive, toGive } = loansData.reduce((acc, loan) => {
      if (loan.type === 'given') {
        acc.toReceive += parseFloat(loan.amount);
      } else {
        acc.toGive += parseFloat(loan.amount);
      }
      return acc;
    }, { toReceive: 0, toGive: 0 });

    setTotalToReceive(toReceive);
    setTotalToGive(toGive);
  };

  const handleAddLoan = async (loanData) => {
    try {
      const response = await fetch('http://localhost:5000/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(loanData)
      });
      
      if (response.ok) {
        fetchLoans();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to add loan:', err);
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      // Add loan_id to identify which loan to update
      const response = await fetch(`http://localhost:5000/api/loans/${selectedLoan.loan_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          person_name: updatedData.personName,
          amount: updatedData.amount,
          type: updatedData.type,
          description: updatedData.description
        })
      });
  
      if (response.ok) {
        // Update local state with edited loan
        const editedLoan = await response.json();
        setLoans(loans.map(loan => 
          loan.loan_id === editedLoan.loan_id ? editedLoan : loan
        ));
        calculateTotals(loans); // Recalculate totals
        setIsEditModalOpen(false);
        setSelectedLoan(null);
      } else {
        throw new Error('Failed to update loan');
      }
    } catch (err) {
      console.error('Failed to update loan:', err);
      alert('Failed to update loan. Please try again.');
    }
  };

  const handleDelete = async (loanId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/loans/${loanId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        // Remove loan from local state
        const updatedLoans = loans.filter(loan => loan.loan_id !== loanId);
        setLoans(updatedLoans);
        calculateTotals(updatedLoans); // Recalculate totals
        setDeleteAlert({ isOpen: false, loanId: null });
      } else {
        throw new Error('Failed to delete loan');
      }
    } catch (err) {
      console.error('Failed to delete loan:', err);
      alert('Failed to delete loan. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Loans</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m-8-6h16" />
            </svg>
            Add Loan
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-2">To Receive</h2>
            <p className="text-3xl font-bold text-green-400">₹{totalToReceive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-2">To Give</h2>
            <p className="text-3xl font-bold text-red-400">₹{totalToGive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="px-4 py-3 text-left text-sm md:px-6 md:text-base">Date</th>
                  <th className="px-4 py-3 text-left text-sm md:px-6 md:text-base">Person</th>
                  <th className="px-4 py-3 text-left text-sm md:px-6 md:text-base">Description</th>
                  <th className="px-4 py-3 text-right text-sm md:px-6 md:text-base">Amount</th>
                  <th className="px-4 py-3 text-center text-sm md:px-6 md:text-base">Type</th>
                  <th className="px-4 py-3 text-right text-sm md:px-6 md:text-base">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loans.map((loan, index) => (
                  <tr key={loan.loan_id} className="text-gray-300 hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-4 text-sm md:px-6 md:text-base">
                      {new Date(loan.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm md:px-6 md:text-base">{loan.person_name}</td>
                    <td className="px-4 py-4 text-sm md:px-6 md:text-base">{loan.description || '-'}</td>
                    <td className={`px-4 py-4 text-sm md:px-6 md:text-base text-right ${
                      loan.type === 'given' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ₹{parseFloat(loan.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-4 text-sm md:px-6 md:text-base text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        loan.type === 'given' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {loan.type === 'given' ? 'To Receive' : 'To Give'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm md:px-6 md:text-base text-right">
                      <div className="relative inline-block" ref={dropdownRef}>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === loan.loan_id ? null : loan.loan_id)}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>
                        
                        {activeDropdown === loan.loan_id && (
                          <div 
                            className="absolute right-0 w-48 rounded-md shadow-lg py-1 bg-gray-700 ring-1 ring-black ring-opacity-5 z-10"
                            style={{
                              bottom: index >= loans.length - 2 ? '100%' : 'auto',
                              top: index >= loans.length - 2 ? 'auto' : '100%'
                            }}
                          >
                            <button
                              onClick={() => {
                                setSelectedLoan(loan);
                                setIsEditModalOpen(true);
                                setActiveDropdown(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setDeleteAlert({ 
                                  isOpen: true, 
                                  loanId: loan.loan_id 
                                });
                                setActiveDropdown(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <LoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddLoan={handleAddLoan}
      />

      <LoanModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLoan(null);
        }}
        onAddLoan={handleEdit}
        initialData={selectedLoan}
        isEditing={true}
      />

      <AlertModal
        isOpen={deleteAlert.isOpen}
        onClose={() => setDeleteAlert({ isOpen: false, loanId: null })}
        onConfirm={() => handleDelete(deleteAlert.loanId)}
        message="Are you sure you want to delete this loan?"
      />
    </div>
  );
};

export default LoanPage;