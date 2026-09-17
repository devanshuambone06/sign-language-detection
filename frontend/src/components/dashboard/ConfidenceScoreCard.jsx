import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';

const ConfidenceScoreCard = () => {
  const { currentPrediction, predictionHistory } = usePredictionContext();
  const confidence = currentPrediction?.confidence || 
    (predictionHistory.length > 0 
      ? predictionHistory.reduce((sum, p) => sum + (p.confidence || 0), 0) / predictionHistory.length 
      : 0);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (confidence / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">Confidence Score</h3>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          {/* Progress Circle */}
          <svg width="180" height="180" className="transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="90"
              cy="90"
              r="45"
              stroke="rgba(39, 39, 42, 0.5)"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="90"
              cy="90"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                strokeDasharray: circumference,
              }}
            />
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold gradient-text">{confidence}%</span>
            <span className="text-text-secondary text-sm mt-1">Confidence</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <p className="text-text-secondary text-xs mb-1">Average</p>
          <p className="text-lg font-bold">92.3%</p>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <p className="text-text-secondary text-xs mb-1">Peak</p>
          <p className="text-lg font-bold">99.1%</p>
        </div>
      </div>

      {/* Trend */}
      <div className="mt-4 flex items-center justify-center space-x-2 text-success">
        <FiTrendingUp size={16} />
        <span className="text-sm font-medium">+2.4% from last session</span>
      </div>
    </motion.div>
  );
};

export default React.memo(ConfidenceScoreCard);
