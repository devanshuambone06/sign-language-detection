import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ConfidenceTimelineChart = () => {
  const { predictionHistory } = usePredictionContext();

  const chartData = useMemo(() => {
    if (predictionHistory.length === 0) {
      return { labels: ['--'], values: [0] };
    }
    const recent = [...predictionHistory].reverse().slice(-20);
    return {
      labels: recent.map((p, i) => {
        const t = new Date(p.timestamp);
        return `${t.getHours()}:${String(t.getMinutes()).padStart(2,'0')}:${String(t.getSeconds()).padStart(2,'0')}`;
      }),
      values: recent.map(p =>
        parseFloat((p.confidence > 1 ? p.confidence : p.confidence * 100).toFixed(1))
      ),
    };
  }, [predictionHistory]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Confidence %',
        data: chartData.values,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        displayColors: false,
        callbacks: {
          label: ctx => `Confidence: ${ctx.raw}%`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(39,39,42,0.5)' },
        ticks: { color: '#94A3B8', maxTicksLimit: 6, maxRotation: 0 },
      },
      y: {
        grid: { color: 'rgba(39,39,42,0.5)' },
        ticks: { color: '#94A3B8', callback: v => `${v}%` },
        min: 0,
        max: 100,
      },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Confidence Timeline
          {predictionHistory.length > 0 && (
            <span className="ml-2 text-xs text-primary font-normal">last {Math.min(predictionHistory.length, 20)} detections</span>
          )}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-lg border ${predictionHistory.length > 0 ? 'text-success border-success/30 bg-success/10' : 'text-text-secondary border-border bg-card'}`}>
          {predictionHistory.length > 0 ? 'Live' : 'No data'}
        </span>
      </div>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
      {predictionHistory.length === 0 && (
        <p className="text-center text-text-secondary text-xs mt-2">Detect signs to populate this chart</p>
      )}
    </motion.div>
  );
};

export default React.memo(ConfidenceTimelineChart);
