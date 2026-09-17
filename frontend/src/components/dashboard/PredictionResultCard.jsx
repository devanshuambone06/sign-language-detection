import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiCheckCircle, FiClock } from 'react-icons/fi';
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';

const PredictionResultCard = () => {
  const { currentPrediction } = usePredictionContext();
  
  const gesture = currentPrediction?.gesture || 'Waiting...';
  const currentWord = currentPrediction?.present || 'Waiting...';
  const predictionStatus = currentPrediction?.predictionStatus || 'Ready';
  const confidence = currentPrediction?.confidence || 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">Prediction Result</h3>
      
      {/* Detected Gesture */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4 p-4 rounded-xl bg-card border border-border">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <FiUser size={28} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-text-secondary text-sm mb-1">Detected Gesture</p>
            <p className="text-xl font-bold">{gesture}</p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-success/20 border border-success/50">
            <FiCheckCircle size={16} className="text-success" />
            <span className="text-success text-sm font-medium">Active</span>
          </div>
        </div>

        {/* Current Word */}
        <div className="flex items-center space-x-4 p-4 rounded-xl bg-card border border-border">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
            <FiClock size={28} className="text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-text-secondary text-sm mb-1">Current Word</p>
            <p className="text-xl font-bold">{currentWord}</p>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-warning/20 border border-warning/50">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-warning text-sm font-medium">Processing</span>
          </div>
        </div>

        {/* Prediction Status */}
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-text-secondary text-sm">Prediction Status</p>
            <span className="text-success text-sm font-medium">{predictionStatus}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-sm font-medium">{confidence.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(PredictionResultCard);
