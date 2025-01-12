import React from 'react'
import { PieChart, Pie, Cell,Tooltip,Legend } from "recharts";


const DynamicPieChart2 = ({ data, colors, title, dataKey, nameKey }) => {
    if (!data || data.length === 0) {
      return <div className="w-80 p-4">No Data Available</div>;
    }
  
    return (
      <div className="w-[100%]">
        <p className="font-bold text-center mb-5">{title}</p>
        <PieChart width={250} height={250}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            dataKey={dataKey} // Dynamic dataKey for value
            label={({
              name,
              value,
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = outerRadius - 20;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight="bold"
                >
                  {value} {/* Show the count (value) inside the chart */}
                </text>
              );
            }} // Label inside the chart
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </div>
    );
  };


export default DynamicPieChart2

