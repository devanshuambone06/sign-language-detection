import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiClock, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';

const HistoryTimeline = ({ historyData = [] }) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const displayData = historyData.slice(0, 4);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 95) return 'text-success';
    if (confidence >= 90) return 'text-primary';
    return 'text-warning';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">Recent Timeline</h3>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
        
        {/* Timeline Items */}
        <div className="space-y-6">
          {displayData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative pl-14"
            >
              {/* Timeline Dot */}
              <div className="absolute left-4 top-0 w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary border-4 border-background" />
              
              {/* Content */}
              <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FiClock size={14} className="text-text-secondary" />
                    <span className="text-sm text-text-secondary">{formatTimestamp(item.timestamp)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiTrendingUp size={14} className={getConfidenceColor(item.confidence)} />
                    <span className={`text-sm font-medium ${getConfidenceColor(item.confidence)}`}>
                      {item.confidence?.toFixed(1) || 0}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <FiUser size={18} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.gesture}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <FiMessageSquare size={14} className="text-text-secondary" />
                      <p className="text-sm text-text-secondary">{item.sentence || item.present}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(HistoryTimeline);
