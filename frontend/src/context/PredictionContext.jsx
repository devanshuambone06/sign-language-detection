import { createContext, useContext, useState, useCallback } from 'react';

const PredictionContext = createContext();

export const PredictionProvider = ({ children }) => {
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState(null);

  const addPrediction = useCallback((prediction) => {
    setCurrentPrediction(prediction);
    setPredictionHistory((prev) => {
      const newHistory = [prediction, ...prev];
      // Keep only last 100 predictions
      return newHistory.slice(0, 100);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setPredictionHistory([]);
    setCurrentPrediction(null);
  }, []);

  const removePrediction = useCallback((id) => {
    setPredictionHistory((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePrediction = useCallback((id, updates) => {
    setPredictionHistory((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const value = {
    currentPrediction,
    predictionHistory,
    isPredicting,
    error,
    setIsPredicting,
    setError,
    addPrediction,
    clearHistory,
    removePrediction,
    updatePrediction,
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};
