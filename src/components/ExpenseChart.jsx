import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';

const ExpenseChart = ({ expenses }) => {
  // Process data to group by date
  const processData = () => {
    if (!expenses || expenses.length === 0) return [];
    
    const groupedData = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += parseFloat(expense.amount);
      return acc;
    }, {});

    return Object.entries(groupedData)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const chartData = processData();

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={chartData}
          margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.1)" 
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.6)"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 9 }} // Reduced font size
            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            interval="preserveStartEnd" // Show only start and end ticks on mobile
            height={30} // Reduced height
          />
          <YAxis 
            stroke="rgba(255,255,255,0.6)"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 9 }} // Reduced font size
            tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickFormatter={(value) => `₹${value}`}
            width={35} // Reduced width for Y-axis
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: '#fff'
            }}
            formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']}
            labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
          />
          <Area 
            type="monotone"
            dataKey="amount"
            stroke="#06B6D4"
            fillOpacity={1}
            fill="url(#colorAmount)"
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#06B6D4" 
            strokeWidth={3}
            dot={{ 
              fill: '#06B6D4', 
              strokeWidth: 2,
              r: 4,
              strokeDasharray: ''
            }}
            activeDot={{ 
              r: 6,
              stroke: '#fff',
              strokeWidth: 2,
              fill: '#06B6D4'
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;