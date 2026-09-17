import api from './api';

export const getLabelMap = async () => {
  try {
    const response = await api.get('/api/label_map');
    return response.data;
  } catch (error) {
    console.error('Error fetching label map:', error);
    throw error;
  }
};

export const predictGesture = async (payload) => {
  try {
    const response = await api.post('/api/predict', payload);
    const data = response.data;
    
    const mappedResult = {
      gesture: data.word,
      confidence: parseFloat((data.confidence * 100).toFixed(1)),
      present: data.sentence || '',
      past: data.tenses?.past || '',
      future: data.tenses?.future || '',
      sentence: data.sentence || '',
      translation: data.translation || '',
      active_tense: data.active_tense || 'present',
      suggestions: data.suggestions || [],
      is_correct: data.is_correct,
      predictionStatus: data.is_correct ? 'Active' : 'Warning',
      timestamp: new Date().toISOString(),
      id: Date.now(),
    };

    savePredictionToHistory(mappedResult);
    return mappedResult;
  } catch (error) {
    console.error('Error predicting gesture:', error);
    throw error;
  }
};

export const getPredictionHistory = async (params = {}) => {
  try {
    const localHistory = JSON.parse(localStorage.getItem('prediction_history') || '[]');
    return localHistory;
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    throw error;
  }
};

export const savePredictionToHistory = (prediction) => {
  try {
    const localHistory = JSON.parse(localStorage.getItem('prediction_history') || '[]');
    // Filter duplicates
    const filteredHistory = localHistory.filter(p => p.gesture !== prediction.gesture || Math.abs(new Date(p.timestamp) - new Date(prediction.timestamp)) > 5000);
    const newHistory = [prediction, ...filteredHistory].slice(0, 100);
    localStorage.setItem('prediction_history', JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error('Error saving prediction to history:', error);
  }
};

export const deletePrediction = async (id) => {
  try {
    const localHistory = JSON.parse(localStorage.getItem('prediction_history') || '[]');
    const newHistory = localHistory.filter((item) => item.id !== id);
    localStorage.setItem('prediction_history', JSON.stringify(newHistory));
    return { success: true, id };
  } catch (error) {
    console.error('Error deleting prediction:', error);
    throw error;
  }
};

export const getAnalytics = async (params = {}) => {
  try {
    const localHistory = JSON.parse(localStorage.getItem('prediction_history') || '[]');
    const totalPredictions = localHistory.length;
    const avgConfidence = totalPredictions > 0
      ? (localHistory.reduce((sum, item) => sum + item.confidence, 0) / totalPredictions).toFixed(1)
      : '0.0';
    const accuracy = totalPredictions > 0
      ? ((localHistory.filter(item => item.is_correct).length / totalPredictions) * 100).toFixed(1)
      : '0.0';
      
    // Count occurrences of each gesture
    const gestureCounts = {};
    localHistory.forEach(item => {
      gestureCounts[item.gesture] = (gestureCounts[item.gesture] || 0) + 1;
    });
    const topGestures = Object.entries(gestureCounts)
      .map(([gesture, count]) => ({ gesture, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalPredictions,
      avgConfidence: parseFloat(avgConfidence),
      accuracy: parseFloat(accuracy),
      activeSessions: totalPredictions > 0 ? 1 : 0,
      topGestures,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

export const getDashboardStats = async () => {
  try {
    const localHistory = JSON.parse(localStorage.getItem('prediction_history') || '[]');
    const analytics = await getAnalytics();
    return {
      ...analytics,
      recentActivity: localHistory.slice(0, 5).map(item => ({
        gesture: item.gesture,
        confidence: item.confidence,
        timestamp: item.timestamp,
      })),
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};
