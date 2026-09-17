import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiFilter } from 'react-icons/fi';

const HistoryFilters = ({ onFilterChange }) => {
  const [searchGesture, setSearchGesture] = useState('');
  const [searchSentence, setSearchSentence] = useState('');
  const [language, setLanguage] = useState('all');
  const [confidence, setConfidence] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = () => {
    onFilterChange({
      searchGesture,
      searchSentence,
      language,
      confidence,
      sortBy,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Search & Filters</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 rounded-lg bg-card border border-border hover:border-primary transition-colors"
        >
          <FiFilter size={18} />
        </motion.button>
      </div>

      {/* Search Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <label htmlFor="search-gesture" className="sr-only">Search by gesture</label>
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
          <input
            id="search-gesture"
            type="text"
            placeholder="Search by gesture..."
            value={searchGesture}
            onChange={(e) => {
              setSearchGesture(e.target.value);
              handleFilterChange();
            }}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all duration-200 text-white placeholder:text-text-secondary"
          />
        </div>
        <div className="relative">
          <label htmlFor="search-sentence" className="sr-only">Search by sentence</label>
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
          <input
            id="search-sentence"
            type="text"
            placeholder="Search by sentence..."
            value={searchSentence}
            onChange={(e) => {
              setSearchSentence(e.target.value);
              handleFilterChange();
            }}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all duration-200 text-white placeholder:text-text-secondary"
          />
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
              <input
                type="date"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all duration-200 text-white"
              />
            </div>
            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
              <input
                type="date"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all duration-200 text-white"
              />
            </div>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                handleFilterChange();
              }}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all duration-200 text-white"
            >
              <option value="all">All Languages</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="japanese">Japanese</option>
            </select>
          </div>

          {/* Confidence Filter */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">Confidence Level</label>
            <select
              value={confidence}
              onChange={(e) => {
                setConfidence(e.target.value);
                handleFilterChange();
              }}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all duration-200 text-white"
            >
              <option value="all">All Confidence Levels</option>
              <option value="high">High (90%+)</option>
              <option value="medium">Medium (70-90%)</option>
              <option value="low">Low (&lt;70%)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm text-text-secondary mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                handleFilterChange();
              }}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition-all duration-200 text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="confidence-high">Highest Confidence</option>
              <option value="confidence-low">Lowest Confidence</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Apply Filters Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleFilterChange}
        className="w-full mt-4 btn-primary py-3 rounded-xl text-white font-semibold"
      >
        Apply Filters
      </motion.button>
    </motion.div>
  );
};

export default React.memo(HistoryFilters);
