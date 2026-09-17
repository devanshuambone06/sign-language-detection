import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiClock, FiTrendingUp, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const RecentAnalyticsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const analytics = [
    { id: 1, time: '10:45 AM', gesture: 'Hello', confidence: 98.5, language: 'English', status: 'success' },
    { id: 2, time: '10:42 AM', gesture: 'Thank You', confidence: 95.2, language: 'English', status: 'success' },
    { id: 3, time: '10:38 AM', gesture: 'Please', confidence: 89.4, language: 'Spanish', status: 'warning' },
    { id: 4, time: '10:35 AM', gesture: 'Sorry', confidence: 92.8, language: 'English', status: 'success' },
    { id: 5, time: '10:30 AM', gesture: 'Good', confidence: 97.1, language: 'French', status: 'success' },
    { id: 6, time: '10:25 AM', gesture: 'Yes', confidence: 94.6, language: 'English', status: 'success' },
    { id: 7, time: '10:20 AM', gesture: 'No', confidence: 91.3, language: 'German', status: 'success' },
    { id: 8, time: '10:15 AM', gesture: 'Love', confidence: 88.7, language: 'English', status: 'warning' },
  ];

  const getStatusColor = (status) => {
    return status === 'success' ? 'text-success' : status === 'warning' ? 'text-warning' : 'text-danger';
  };

  const getStatusBg = (status) => {
    return status === 'success' ? 'bg-success/20 border-success/50' : status === 'warning' ? 'bg-warning/20 border-warning/50' : 'bg-danger/20 border-danger/50';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 95) return 'text-success';
    if (confidence >= 90) return 'text-primary';
    return 'text-warning';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Analytics</h3>
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <label htmlFor="analytics-search" className="sr-only">Search analytics</label>
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
            <input
              id="analytics-search"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none text-sm text-white placeholder:text-text-secondary focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          {/* Filter */}
          <div className="relative">
            <label htmlFor="analytics-filter" className="sr-only">Filter by status</label>
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
            <select
              id="analytics-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none text-sm text-white appearance-none cursor-pointer focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="text-left text-text-secondary text-sm border-b border-border">
              <th className="pb-3 font-medium">Time</th>
              <th className="pb-3 font-medium">Gesture</th>
              <th className="pb-3 font-medium">Confidence</th>
              <th className="pb-3 font-medium">Language</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {analytics.map((item, index) => (
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
                    <span className="text-sm">{item.time}</span>
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
                    <FiTrendingUp size={16} className={getConfidenceColor(item.confidence)} />
                    <span className={`font-medium ${getConfidenceColor(item.confidence)}`}>
                      {item.confidence}%
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-sm">{item.language}</span>
                </td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(item.status)} border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <p className="text-sm text-text-secondary">Showing 1-8 of 24 results</p>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-card border border-border hover:border-primary transition-colors"
          >
            <FiChevronLeft size={18} />
          </motion.button>
          <div className="flex items-center space-x-1">
            {[1, 2, 3].map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  page === 1
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border hover:border-primary'
                }`}
              >
                {page}
              </motion.button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-card border border-border hover:border-primary transition-colors"
          >
            <FiChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(RecentAnalyticsTable);
