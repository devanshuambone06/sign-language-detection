import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiClock, FiMessageSquare, FiTrendingUp } from 'react-icons/fi';
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';
import { useNavigate } from 'react-router-dom';

const RecentActivityTable = () => {
  const { predictionHistory } = usePredictionContext();
  const navigate = useNavigate();
  
  const activities = predictionHistory.slice(0, 5).map(p => ({
    id: p.id,
    timestamp: p.timestamp,
    gesture: p.gesture,
    sentence: p.sentence || p.present,
    confidence: p.confidence || 0,
  }));

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <button 
          type="button"
          onClick={() => navigate('/history')}
          className="text-primary text-sm font-medium hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 py-1"
          aria-label="View all history"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-text-secondary text-sm border-b border-border">
              <th className="pb-3 font-medium">Timestamp</th>
              <th className="pb-3 font-medium">Gesture</th>
              <th className="pb-3 font-medium">Sentence</th>
              <th className="pb-3 font-medium">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <motion.tr
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-border/50 hover:bg-card/50 transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <FiClock size={16} className="text-text-secondary" />
                    <span className="text-sm">{formatTimestamp(activity.timestamp)}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <FiUser size={16} className="text-primary" />
                    </div>
                    <span className="font-medium">{activity.gesture}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <FiMessageSquare size={16} className="text-text-secondary" />
                    <span className="text-sm">{activity.sentence}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <FiTrendingUp size={16} className={getConfidenceColor(activity.confidence)} />
                    <span className={`font-medium ${getConfidenceColor(activity.confidence)}`}>
                      {activity.confidence}%
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default React.memo(RecentActivityTable);
