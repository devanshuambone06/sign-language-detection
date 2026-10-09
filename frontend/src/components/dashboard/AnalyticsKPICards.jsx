import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiTarget, FiTrendingUp, FiClock } from 'react-icons/fi';
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';

const KPICard = ({ icon: Icon, title, value, sub, color, index }) => {
  const colorClasses = {
    primary:   'from-primary/20 to-primary/5',
    secondary: 'from-secondary/20 to-secondary/5',
    success:   'from-success/20 to-success/5',
    warning:   'from-warning/20 to-warning/5',
  };
  const iconColorClasses = {
    primary:   'text-primary',
    secondary: 'text-secondary',
    success:   'text-success',
    warning:   'text-warning',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon size={28} className={iconColorClasses[color]} />
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-card border border-border ${iconColorClasses[color]}`}>
          Live
        </span>
      </div>
      <h3 className="text-text-secondary text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs text-text-secondary mt-1">{sub}</p>}

      {/* Mini bar chart */}
      <div className="mt-4 h-10 flex items-end gap-0.5">
        {[30, 50, 40, 70, 55, 80, 60, 90, 65, 85].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.5, delay: i * 0.04 }}
            className={`flex-1 rounded-t-sm ${iconColorClasses[color]} opacity-30`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const AnalyticsKPICards = () => {
  const { predictionHistory } = usePredictionContext();

  const total = predictionHistory.length;
  const correct = predictionHistory.filter(p => p.is_correct).length;
  const accuracy = total > 0 ? ((correct / total) * 100).toFixed(1) : '0.0';

  const avgConf = total > 0
    ? (predictionHistory.reduce((sum, p) => {
        const c = p.confidence > 1 ? p.confidence : p.confidence * 100;
        return sum + c;
      }, 0) / total).toFixed(1)
    : '0.0';

  // Session duration: time from first to last prediction in minutes
  const sessionMins = total >= 2
    ? Math.round((new Date(predictionHistory[0].timestamp) - new Date(predictionHistory[total - 1].timestamp)) / 60000)
    : 0;

  const kpis = [
    {
      icon: FiActivity,
      title: 'Total Predictions',
      value: total.toString(),
      sub: `${correct} confirmed`,
      color: 'primary',
    },
    {
      icon: FiTarget,
      title: 'Avg Confidence',
      value: `${avgConf}%`,
      sub: total > 0 ? 'this session' : 'no data yet',
      color: 'success',
    },
    {
      icon: FiTrendingUp,
      title: 'Detection Accuracy',
      value: `${accuracy}%`,
      sub: `${correct}/${total} correct`,
      color: 'secondary',
    },
    {
      icon: FiClock,
      title: 'Session Duration',
      value: sessionMins > 0 ? `${sessionMins}m` : total > 0 ? '<1m' : '0m',
      sub: total > 0 ? 'active session' : 'start detecting',
      color: 'warning',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <KPICard key={kpi.title} {...kpi} index={index} />
      ))}
    </div>
  );
};

export default React.memo(AnalyticsKPICards);
