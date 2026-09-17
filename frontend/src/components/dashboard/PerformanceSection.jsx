import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ label, value, color }) => {
  const colorClasses = {
    primary: 'from-primary to-primary',
    secondary: 'from-secondary to-secondary',
    success: 'from-success to-success',
    warning: 'from-warning to-warning',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">{label}</span>
        <span className="text-sm font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
        />
      </div>
    </div>
  );
};

const PerformanceSection = () => {
  const metrics = [
    { label: 'Model Accuracy', value: 97.8, color: 'success' },
    { label: 'Prediction Confidence', value: 94.2, color: 'primary' },
    { label: 'Translation Success', value: 96.5, color: 'secondary' },
    { label: 'Detection Stability', value: 92.8, color: 'warning' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
      
      <div className="space-y-4">
        {metrics.map((metric) => (
          <ProgressBar key={metric.label} {...metric} />
        ))}
      </div>

      {/* Overall Score */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-success/10 to-primary/10 border border-success/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">Overall Performance Score</p>
            <p className="text-2xl font-bold text-success">95.3%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">Status</p>
            <p className="text-sm font-semibold text-success">Excellent</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(PerformanceSection);
