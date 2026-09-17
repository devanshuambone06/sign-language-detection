import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiAlertTriangle, FiZap } from 'react-icons/fi';
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';

const SuggestionsCard = () => {
  const { currentPrediction } = usePredictionContext();
  
  const suggestions = currentPrediction?.suggestions || [
    { gesture: 'Hello', confidence: 98.5, rank: 1 },
    { gesture: 'Thank You', confidence: 95.2, rank: 2 },
    { gesture: 'Please', confidence: 89.4, rank: 3 },
  ];

  const confidence = currentPrediction?.confidence || 0;

  const isLowConfidence = confidence < 90;
  const confidenceBgClass = isLowConfidence ? 'bg-warning/10 border-warning/30' : 'bg-success/10 border-success/30';
  const confidenceTextClass = isLowConfidence ? 'text-warning' : 'text-success';
  const confidenceTitle = isLowConfidence ? 'Confidence Warning' : 'Good Confidence';
  const confidenceMessage = isLowConfidence
    ? 'Current gesture confidence is below 90%. Try adjusting lighting or hand position for better accuracy.'
    : 'Gesture confidence is good. Continue with current positioning.';

  const getConfidenceColor = (confidence) => {
    if (confidence >= 95) return 'text-success';
    if (confidence >= 90) return 'text-primary';
    return 'text-warning';
  };

  const getRankBadge = (rank) => {
    const colors = {
      1: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500',
      2: 'bg-gray-400/20 border-gray-400/50 text-gray-400',
      3: 'bg-orange-600/20 border-orange-600/50 text-orange-600',
    };
    return colors[rank] || colors[3];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">AI Suggestions</h3>
      
      {/* Top 3 Suggestions */}
      <div className="space-y-3 mb-6">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.gesture}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center space-x-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg ${getRankBadge(suggestion.rank)} border flex items-center justify-center font-bold text-sm`}>
              {suggestion.rank}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{suggestion.gesture}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FiTrendingUp size={16} className={getConfidenceColor(suggestion.confidence)} />
              <span className={`font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                {suggestion.confidence}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confidence Warning */}
      <div className={`p-4 rounded-xl mb-4 ${confidenceBgClass}`}>
        <div className="flex items-start space-x-3">
          <FiAlertTriangle size={20} className={`${confidenceTextClass} mt-0.5`} />
          <div>
            <p className={`font-semibold mb-1 ${confidenceTextClass}`}>
              {confidenceTitle}
            </p>
            <p className="text-text-secondary text-sm">
              {confidenceMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Smart Recommendation */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
            <FiZap size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-primary mb-1">Smart Recommendation</p>
            <p className="text-text-secondary text-sm">
              Based on your recent gestures, you might want to try "Good Morning" or "How Are You" for common greetings.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(SuggestionsCard);
