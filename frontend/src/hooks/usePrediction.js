import { useState, useCallback } from 'react';
import { predictGesture } from '../services/predictionService';
import { usePrediction as usePredictionContext } from '../context/PredictionContext';

export const usePrediction = () => {
  const { addPrediction, setIsPredicting, setError } = usePredictionContext();
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const makePrediction = useCallback(async (payload) => {
    setIsLoading(true);
    setIsPredicting(true);
    setLocalError(null);
    setError(null);

    try {
      const response = await predictGesture(payload);
      
      const prediction = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        gesture: response.word || 'Unknown',
        sentence: response.sentence || '',
        translation: response.translation || '',
        confidence: response.confidence || 0,
        present: response.present || '',
        past: response.past || '',
        future: response.future || '',
        suggestions: response.suggestions || [],
        modelStatus: response.model_status || 'unknown',
        predictionStatus: response.prediction_status || 'unknown',
      };

      addPrediction(prediction);
      return prediction;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Prediction failed';
      setLocalError(errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      setIsPredicting(false);
    }
  }, [addPrediction, setIsPredicting, setError]);

  return {
    makePrediction,
    isLoading,
    error: localError,
  };
};
