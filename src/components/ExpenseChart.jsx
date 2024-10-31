// ExpenseChart.jsx - Line chart for expense trends
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ExpenseChart = () => {
  const data = [
    { date: '1 Mar', amount: 200 },
    { date: '5 Mar', amount: 100 },
    { date: '10 Mar', amount: 800 },
    { date: '15 Mar', amount: 600 },
    { date: '20 Mar', amount: 50 },
    { date: '25 Mar', amount: 90 },
    { date: '30 Mar', amount: 1300 },
  ];

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#60A5FA" 
            strokeWidth={2}
            dot={{ fill: '#60A5FA', strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;