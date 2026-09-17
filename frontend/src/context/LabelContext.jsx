import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const LabelContext = createContext();

export const LabelProvider = ({ children }) => {
  const [labels, setLabels] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLabels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Frontend-only: Use dummy label map data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dummyLabels = {
        0: 'Hello',
        1: 'Thank You',
        2: 'Please',
        3: 'Sorry',
        4: 'Yes',
        5: 'No',
        6: 'Good',
        7: 'Love',
        8: 'Help',
        9: 'Stop',
      };
      
      setLabels(dummyLabels);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching labels:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getLabelById = useCallback((id) => {
    return labels[id] || 'Unknown';
  }, [labels]);

  const getAllLabels = useCallback(() => {
    return Object.entries(labels).map(([id, label]) => ({ id, label }));
  }, [labels]);

  useEffect(() => {
    fetchLabels();
  }, [fetchLabels]);

  const value = {
    labels,
    isLoading,
    error,
    fetchLabels,
    getLabelById,
    getAllLabels,
  };

  return (
    <LabelContext.Provider value={value}>
      {children}
    </LabelContext.Provider>
  );
};

export const useLabels = () => {
  const context = useContext(LabelContext);
  if (!context) {
    throw new Error('useLabels must be used within a LabelProvider');
  }
  return context;
};
