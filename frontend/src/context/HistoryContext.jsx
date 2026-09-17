import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getPredictionHistory, deletePrediction } from '../services/predictionService';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    language: 'all',
    confidence: 'all',
    sortBy: 'newest',
  });

  const fetchHistory = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPredictionHistory(params);
      setHistory(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching history:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteItem = useCallback(async (id) => {
    try {
      await deletePrediction(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting item:', err);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      if (filters.search && !item.gesture.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.language !== 'all' && item.language !== filters.language) {
        return false;
      }
      if (filters.confidence === 'high' && item.confidence < 90) {
        return false;
      }
      if (filters.confidence === 'medium' && (item.confidence < 70 || item.confidence >= 90)) {
        return false;
      }
      if (filters.confidence === 'low' && item.confidence >= 70) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      if (filters.sortBy === 'oldest') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      if (filters.sortBy === 'confidence-high') {
        return b.confidence - a.confidence;
      }
      if (filters.sortBy === 'confidence-low') {
        return a.confidence - b.confidence;
      }
      return 0;
    });
  }, [history, filters]);

  const value = {
    history,
    filteredHistory,
    isLoading,
    error,
    filters,
    fetchHistory,
    deleteItem,
    clearHistory,
    updateFilters,
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
