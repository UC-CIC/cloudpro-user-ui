import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

interface SymptomPieChartProps {
    data: { value: number; color: string }[];
    showLabels?: boolean;
}

const HomePie: React.FC<SymptomPieChartProps> = ({ data, showLabels = true }) => {
    const [chartSize, setChartSize] = useState({ width: 400, height: 300 });
    const chartContainerRef = useRef<HTMLDivElement>(null);

    const updateChartSize = () => {
        if (chartContainerRef.current) {
            const width = chartContainerRef.current.offsetWidth;
            let height = width * 0.75; // Maintain aspect ratio of 4:3

            // Adjust chart size based on viewport width
            if (window.innerWidth < 768) { // Mobile viewport
                height = width * 0.9; // Smaller height for mobile
            } else {
                height = width * 0.75; // Default height for desktop
            }

            setChartSize({ width, height });
        }
    };

    useEffect(() => {
        updateChartSize();
        window.addEventListener('resize', updateChartSize);
        return () => window.removeEventListener('resize', updateChartSize);
    }, []);

    return (
        <div ref={chartContainerRef} style={{ width: '100%', maxWidth: '400px' }}>
            <PieChart width={chartSize.width} height={chartSize.height}>
                <Pie
                    data={data}
                    dataKey="value"
                    outerRadius={Math.min(chartSize.width, chartSize.height) / 2 - 10}
                    fill="#8884d8"
                    label={showLabels ? (entry) => entry.name : false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
            </PieChart>
        </div>
    );
};

export default HomePie;
