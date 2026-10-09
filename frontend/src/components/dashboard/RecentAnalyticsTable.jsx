import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiTrendingUp, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';

const RecentAnalyticsTable = () => {
  const { predictionHistory } = usePredictionContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter]         = useState('all');

  const analytics = useMemo(() => {
    return predictionHistory.slice(0, 50).map((p, i) => ({
      id:         p.id || i,
      time:       new Date(p.timestamp).toLocaleTimeString(),
      gesture:    p.gesture || 'Unknown',
      confidence: parseFloat((p.confidence > 1 ? p.confidence : p.confidence * 100).toFixed(1)),
      sentence:   p.sentence || p.gesture || '',
      status:     (p.is_correct || p.predictionStatus === 'Active') ? 'success' : 'warning',
    }));
  }, [predictionHistory]);

  const filtered = analytics.filter(row => {
    const matchSearch = row.gesture.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter =
      filter === 'all'     ? true :
      filter === 'success' ? row.status === 'success' :
      filter === 'warning' ? row.status === 'warning'  : true;
    return matchSearch && matchFilter;
  });

  const getConfidenceColor = (c) =>
    c >= 70 ? 'text-success' : c >= 50 ? 'text-primary' : 'text-warning';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Recent Detections
          {analytics.length > 0 && (
            <span className="ml-2 text-xs text-primary font-normal">({analytics.length} total)</span>
          )}
        </h3>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-card border border-border rounded-lg pl-8 pr-3 py-1.5 text-sm text-white focus:border-primary outline-none w-36"
            />
          </div>
          {/* Filter */}
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-white focus:border-primary outline-none"
          >
            <option value="all">All</option>
            <option value="success">Confirmed</option>
            <option value="warning">Low Conf</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <FiTrendingUp size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            {predictionHistory.length === 0
              ? 'No detections yet — start signing to see analytics!'
              : 'No results match your search.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-text-secondary font-medium">Time</th>
                <th className="text-left py-2 px-3 text-text-secondary font-medium">Gesture</th>
                <th className="text-left py-2 px-3 text-text-secondary font-medium">Sentence</th>
                <th className="text-right py-2 px-3 text-text-secondary font-medium">Confidence</th>
                <th className="text-center py-2 px-3 text-text-secondary font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 hover:bg-card/50 transition-colors"
                >
                  <td className="py-2.5 px-3 text-text-secondary text-xs">{row.time}</td>
                  <td className="py-2.5 px-3 font-semibold">{row.gesture}</td>
                  <td className="py-2.5 px-3 text-text-secondary text-xs max-w-[160px] truncate">{row.sentence}</td>
                  <td className={`py-2.5 px-3 text-right font-bold ${getConfidenceColor(row.confidence)}`}>
                    {row.confidence}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.status === 'success'
                      ? <FiCheckCircle size={16} className="text-success mx-auto" />
                      : <FiAlertTriangle size={16} className="text-warning mx-auto" />
                    }
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(RecentAnalyticsTable);
