import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface SymptomPieChartProps {
    data: { name: string; value: number; color: string }[];
    showLabels?: boolean; // New prop to control label visibility
}

const SymptomPieChart: React.FC<SymptomPieChartProps> = ({ data, showLabels = true }) => {
    return (
        <PieChart width={400} height={300}>
            <Pie
                data={data}
                dataKey="value"
                outerRadius={100}
                fill="#8884d8"
                label={showLabels ? (entry) => entry.name : false} // Conditionally render labels
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            <Tooltip />
            {/* {showLabels && <Legend />} */}
        </PieChart>
    );
};

export default SymptomPieChart;
