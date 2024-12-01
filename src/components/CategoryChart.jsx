import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const CategoryChart = ({ expenses }) => {
  // Process data to group by category
  const processData = () => {
    if (!expenses || expenses.length === 0) return [];

    const groupedData = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += parseFloat(expense.amount);
      return acc;
    }, {});

    return Object.entries(groupedData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  const COLORS = [
    '#06B6D4', // cyan
    '#A855F7', // purple
    '#2563EB', // blue
    '#D946EF', // fuchsia
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#0EA5E9', // sky
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const data = processData();

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="40%"
            labelLine={false}
            label={renderCustomizedLabel}
            innerRadius={40}  // Increased from 30
            outerRadius={80}  // Increased from 60
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: '#fff',
              padding: '8px 12px',
              fontSize: '14px'
            }}
            formatter={(value) => [`₹${value.toFixed(2)}`, 'Amount']}
            labelStyle={{ color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}
            itemStyle={{ color: 'rgba(255,255,255,0.8)' }}
            wrapperStyle={{ outline: 'none' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={25}  // Reduced height to accommodate larger chart
            iconSize={8}
            formatter={(value) => (
              <span style={{ 
                color: 'rgba(255,255,255,0.8)', 
                fontSize: '10px',
                padding: '1px 2px',
                whiteSpace: 'nowrap',
                maxWidth: '80px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {value}
              </span>
            )}
            wrapperStyle={{
              paddingTop: '5px',
              bottom: 0,
              width: '100%',
              maxHeight: '25px',
              overflowX: 'auto'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;