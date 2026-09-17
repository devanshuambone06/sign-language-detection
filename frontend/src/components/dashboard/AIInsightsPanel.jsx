import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiAward, FiAlertCircle, FiClock, FiGlobe, FiActivity } from 'react-icons/fi';
const InsightItem = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5',
    secondary: 'from-secondary/20 to-secondary/5',
    success: 'from-success/20 to-success/5',
    warning: 'from-warning/20 to-warning/5',
    danger: 'from-danger/20 to-danger/5',
  };

  const iconColorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  };

  return (
    <div className="flex items-center space-x-4 p-4 rounded-xl bg-card border border-border">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
        <Icon size={24} className={iconColorClasses[color]} />
      </div>
      <div className="flex-1">
        <p className="text-text-secondary text-sm">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
};

const AIInsightsPanel = () => {
  const insights = [
    { icon: FiTrendingUp, label: 'Most Used Gesture', value: 'Hello', color: 'primary' },
    { icon: FiAward, label: 'Highest Confidence', value: '99.2%', color: 'success' },
    { icon: FiAlertCircle, label: 'Lowest Confidence', value: '78.5%', color: 'warning' },
    { icon: FiClock, label: 'Avg Prediction Time', value: '45ms', color: 'secondary' },
    { icon: FiGlobe, label: 'Active Language', value: 'English', color: 'primary' },
    { icon: FiActivity, label: 'Model Health', value: 'Excellent', color: 'success' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <InsightItem {...insight} />
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30">
        <p className="text-sm text-text-secondary mb-2">
          Your model performance is <span className="text-success font-semibold">excellent</span> with 97.8% accuracy.
        </p>
        <p className="text-sm text-text-secondary">
          Consider focusing on gestures with lower confidence to improve overall performance.
        </p>
      </div>
    </motion.div>
  );
};

export default React.memo(AIInsightsPanel);
