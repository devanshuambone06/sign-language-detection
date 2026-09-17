import React from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TopSignsChart = () => {
  const data = {
    labels: ['Hello', 'Thank You', 'Please', 'Sorry', 'Yes', 'No', 'Good', 'Love', 'Help', 'Bye'],
    datasets: [
      {
        label: 'Count',
        data: [450, 380, 320, 290, 270, 250, 230, 210, 190, 180],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3B82F6',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 18, 23, 0.9)',
        titleColor: '#F8FAFC',
        bodyColor: '#94A3B8',
        borderColor: '#27272A',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(39, 39, 42, 0.5)',
        },
        ticks: {
          color: '#94A3B8',
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94A3B8',
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">Top 10 Signs</h3>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </motion.div>
  );
};

export default React.memo(TopSignsChart);
