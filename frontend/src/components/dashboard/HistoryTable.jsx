import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiClock, FiMessageSquare, FiTrendingUp, FiEye, FiCopy, FiTrash2 } from 'react-icons/fi';

const HistoryTable = ({ onViewDetails, onDelete, historyData = [] }) => {
  const [copiedId, setCopiedId] = useState(null);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 95) return 'text-success';
    if (confidence >= 90) return 'text-primary';
    return 'text-warning';
  };

  const getStatusColor = (status) => {
    return status === 'success' ? 'text-success' : status === 'warning' ? 'text-warning' : 'text-danger';
  };

  const getStatusBg = (status) => {
    return status === 'success' ? 'bg-success/20 border-success/50' : status === 'warning' ? 'bg-warning/20 border-warning/50' : 'bg-danger/20 border-danger/50';
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteClick = (id) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Prediction History</h3>
        <span className="text-sm text-text-secondary">Showing {historyData.length} results</span>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left text-text-secondary text-sm border-b border-border">
              <th className="pb-3 font-medium">Timestamp</th>
              <th className="pb-3 font-medium">Gesture</th>
              <th className="pb-3 font-medium">Sentence</th>
              <th className="pb-3 font-medium">Translation</th>
              <th className="pb-3 font-medium">Confidence</th>
              <th className="pb-3 font-medium">Tense</th>
              <th className="pb-3 font-medium">Language</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-border/50 hover:bg-card/50 transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <FiClock size={16} className="text-text-secondary" />
                    <span className="text-sm">{formatTimestamp(item.timestamp)}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <FiUser size={16} className="text-primary" />
                    </div>
                    <span className="font-medium">{item.gesture}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <FiMessageSquare size={16} className="text-text-secondary" />
                    <span className="text-sm">{item.sentence || item.present}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-sm text-text-secondary">{item.translation}</span>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <FiTrendingUp size={16} className={getConfidenceColor(item.confidence)} />
                    <span className={`font-medium ${getConfidenceColor(item.confidence)}`}>
                      {item.confidence?.toFixed(1) || 0}%
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-sm">{item.tense || 'Present'}</span>
                </td>
                <td className="py-4">
                  <span className="text-sm">{item.language || 'English'}</span>
                </td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(item.status || 'success')} border ${getStatusColor(item.status || 'success')}`}>
                    {item.status || 'success'}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onViewDetails(item)}
                      className="p-2 rounded-lg border border-border hover:border-primary/50 hover:bg-card/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                      title="View Details"
                      aria-label={`View details for ${item.gesture}`}
                    >
                      <FiEye size={16} className="text-text-secondary" />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleCopy(item.id, item.sentence || item.present)}
                      className="p-2 rounded-lg border border-border hover:border-primary/50 hover:bg-card/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                      title="Copy"
                      aria-label={`Copy ${item.gesture} translation`}
                    >
                      <FiCopy size={16} className={copiedId === item.id ? 'text-success' : 'text-text-secondary'} />
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteClick(item.id)}
                      className="p-2 rounded-lg border border-border hover:border-danger/50 hover:bg-danger/10 transition-colors focus:outline-none focus:ring-2 focus:ring-danger/50"
                      title="Delete"
                      aria-label={`Delete ${item.gesture}`}
                    >
                      <FiTrash2 size={16} className="text-danger" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <p className="text-sm text-text-secondary">Showing {historyData.length} results</p>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled
            className="px-4 py-2 rounded-lg bg-card border border-border hover:border-primary transition-colors text-sm disabled:opacity-50"
          >
            Previous
          </motion.button>
          <div className="flex items-center space-x-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg text-sm font-medium bg-primary text-white"
            >
              1
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled
            className="px-4 py-2 rounded-lg bg-card border border-border hover:border-primary transition-colors text-sm disabled:opacity-50"
          >
            Next
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(HistoryTable);
