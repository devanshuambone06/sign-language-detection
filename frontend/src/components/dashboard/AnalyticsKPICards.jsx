import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiTarget, FiTrendingUp, FiClock } from 'react-icons/fi';

const KPICard = ({ icon: Icon, title, value, change, changeType, color }) => {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5',
    secondary: 'from-secondary/20 to-secondary/5',
    success: 'from-success/20 to-success/5',
    warning: 'from-warning/20 to-warning/5',
  };

  const iconColorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon size={28} className={iconColorClasses[color]} />
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
      
      {/* Mini Graph Placeholder */}
      <div className="mt-4 h-12 flex items-end space-x-1">
        {[40, 65, 45, 80, 55, 70, 60, 85, 50, 75].map((height, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={`flex-1 rounded-t-sm ${iconColorClasses[color]} opacity-30`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const AnalyticsKPICards = () => {
  const kpis = [
    {
      icon: FiActivity,
      title: 'Total Predictions',
      value: '24,847',
      change: 18.5,
      changeType: 'positive',
      color: 'primary',
    },
    {
      icon: FiTarget,
      title: 'Average Confidence',
      value: '94.2%',
      change: 3.2,
      changeType: 'positive',
      color: 'success',
    },
    {
      icon: FiTrendingUp,
      title: 'Detection Accuracy',
      value: '97.8%',
      change: 1.8,
      changeType: 'positive',
      color: 'secondary',
    },
    {
      icon: FiClock,
      title: 'Active Sessions',
      value: '1,234',
      change: -2.4,
      changeType: 'negative',
      color: 'warning',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <KPICard {...kpi} />
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(AnalyticsKPICards);
