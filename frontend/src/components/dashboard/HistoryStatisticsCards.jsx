import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiCalendar, FiTarget, FiDownload } from 'react-icons/fi';

const StatCard = ({ icon: Icon, title, value, change, changeType, color }) => {
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
        </div>
      </div>
      <h3 className="text-text-secondary text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  );
};

const HistoryStatisticsCards = () => {
  const stats = [
    {
      icon: FiActivity,
      title: 'Total Predictions',
      value: '12,847',
      change: 12.5,
      changeType: 'positive',
      color: 'primary',
    },
    {
      icon: FiCalendar,
      title: "Today's Predictions",
      value: '234',
      change: 8.3,
      changeType: 'positive',
      color: 'success',
    },
    {
      icon: FiTarget,
      title: 'Average Confidence',
      value: '94.2%',
      change: 2.1,
      changeType: 'positive',
      color: 'secondary',
    },
    {
      icon: FiDownload,
      title: 'Export Count',
      value: '156',
      change: 5.7,
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

export default React.memo(HistoryStatisticsCards);
