import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTarget, FiActivity, FiClock } from 'react-icons/fi';
import { useHistory } from '../../context/HistoryContext';
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';

const StatCard = ({ icon: Icon, title, value, change, changeType, color }) => {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5',
    secondary: 'from-secondary/20 to-secondary/5',
    success: 'from-success/20 to-success/5',
    warning: 'from-warning/20 to-warning/5',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon size={24} className={color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-secondary' : color === 'success' ? 'text-success' : 'text-warning'} />
        </div>
        <div className={`flex items-center space-x-1 text-sm ${
          changeType === 'positive' ? 'text-success' : 'text-danger'
        }`}>
          <span>{changeType === 'positive' ? '+' : ''}{change}%</span>
          <FiTrendingUp size={14} />
        </div>
      </div>
      <h3 className="text-text-secondary text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  );
};

const StatisticsCards = () => {
  const { filteredHistory } = useHistory();
  const { predictionHistory } = usePredictionContext();
  
  const totalPredictions = filteredHistory.length || predictionHistory.length || 0;
  const avgConfidence = predictionHistory.length > 0 
    ? (predictionHistory.reduce((sum, p) => sum + (p.confidence || 0), 0) / predictionHistory.length).toFixed(1)
    : '0.0';
  
  const stats = [
    {
      icon: FiActivity,
      title: 'Total Predictions',
      value: totalPredictions.toLocaleString(),
      change: 12.5,
      changeType: 'positive',
      color: 'primary',
    },
    {
      icon: FiTarget,
      title: 'Accuracy',
      value: avgConfidence + '%',
      change: 2.3,
      changeType: 'positive',
      color: 'success',
    },
    {
      icon: FiClock,
      title: 'Active Session',
      value: '0m 0s',
      change: 0,
      changeType: 'positive',
      color: 'secondary',
    },
    {
      icon: FiTrendingUp,
      title: 'Confidence',
      value: avgConfidence + '%',
      change: 0,
      changeType: 'positive',
      color: 'warning',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(StatisticsCards);
