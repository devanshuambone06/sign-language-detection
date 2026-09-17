import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiClock, FiMessageSquare, FiTrendingUp, FiTrash2 } from 'react-icons/fi';
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';

const LiveDetectionHistory = () => {
  const { predictionHistory, clearHistory } = usePredictionContext();
  const history = predictionHistory.slice(0, 7);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 95) return 'text-success';
    if (confidence >= 90) return 'text-primary';
    return 'text-warning';
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear the detection history?')) {
      clearHistory();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Detection History</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClearHistory}
          className="p-2 rounded-lg hover:bg-card transition-colors"
          aria-label="Clear history"
        >
          <FiTrash2 size={18} className="text-text-secondary" />
        </motion.button>
      </div>

      {/* Scrollable History */}
      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide pr-2">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                  <FiUser size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{item.gesture}</p>
                  <div className="flex items-center space-x-1 text-text-secondary text-xs">
                    <FiClock size={12} />
                    <span>{formatTimestamp(item.timestamp)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <FiTrendingUp size={14} className={getConfidenceColor(item.confidence)} />
                <span className={`text-sm font-medium ${getConfidenceColor(item.confidence)}`}>
                  {item.confidence}%
                </span>
              </div>
            </div>
            <div className="flex items-start space-x-2 mt-2 pt-2 border-t border-border/50">
              <FiMessageSquare size={14} className="text-text-secondary mt-0.5" />
              <p className="text-sm text-text-secondary">{item.sentence || item.present}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-3 rounded-xl bg-card border border-border hover:border-primary transition-colors text-sm font-medium"
      >
        Load More History
      </motion.button>
    </motion.div>
  );
};

export default React.memo(LiveDetectionHistory);
