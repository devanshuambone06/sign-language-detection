import React, { useMemo } from 'react';
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
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GestureFrequencyChart = () => {
  const { predictionHistory } = usePredictionContext();

  const chartData = useMemo(() => {
    if (predictionHistory.length === 0) {
      // Show placeholder
      return {
        labels: ['hello', 'thank you', 'please', 'yes', 'no', 'help', 'water', 'go', 'eat', 'drink'],
        data:   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
    }

    // Count frequency of each gesture
    const freq = {};
    predictionHistory.forEach(p => {
      if (p.gesture) freq[p.gesture] = (freq[p.gesture] || 0) + 1;
    });

    // Sort by frequency, take top 10
    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      labels: sorted.map(([word]) => word),
      data:   sorted.map(([, count]) => count),
    };
  }, [predictionHistory]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Detections',
        data: chartData.data,
        backgroundColor: [
          'rgba(59,130,246,0.8)', 'rgba(139,92,246,0.8)', 'rgba(16,185,129,0.8)',
          'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)',  'rgba(59,130,246,0.6)',
          'rgba(139,92,246,0.6)','rgba(16,185,129,0.6)', 'rgba(245,158,11,0.6)',
          'rgba(239,68,68,0.6)',
        ],
        borderColor: [
          '#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444',
          '#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17,18,23,0.9)',
        titleColor: '#F8FAFC',
        bodyColor: '#94A3B8',
        borderColor: '#27272A',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94A3B8' },
      },
      y: {
        grid: { color: 'rgba(39,39,42,0.5)' },
        ticks: { color: '#94A3B8', stepSize: 1 },
        beginAtZero: true,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Most Detected Gestures
          {predictionHistory.length > 0 && (
            <span className="ml-2 text-xs text-primary font-normal">
              ({predictionHistory.length} total)
            </span>
          )}
        </h3>
        <span className="text-xs text-text-secondary bg-card border border-border px-2 py-1 rounded-lg">
          {predictionHistory.length === 0 ? 'No data yet' : 'Live session'}
        </span>
      </div>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
      {predictionHistory.length === 0 && (
        <p className="text-center text-text-secondary text-xs mt-3">
          Start detecting signs to see frequency data here
        </p>
      )}
    </motion.div>
  );
};

export default React.memo(GestureFrequencyChart);
