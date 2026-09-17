import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import { FaHandPaper } from 'react-icons/fa';
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';

const LiveDetectionPrediction = () => {
  const { currentPrediction } = usePredictionContext();
  
  const confidence = currentPrediction?.confidence || 0;
  const gesture = currentPrediction?.gesture || 'Waiting...';
  const currentWord = currentPrediction?.present || 'Waiting...';
  const predictionStatus = currentPrediction?.predictionStatus || 'Ready';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card rounded-2xl border border-border p-6 shadow-glow-sm"
    >
      <h3 className="card-title mb-5">Prediction Result</h3>
      
      <div className="space-y-4">
        {/* Detected Gesture */}
        <div className="flex items-center space-x-4 p-5 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <FaHandPaper size={28} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-text-secondary text-sm mb-1">Detected Gesture</p>
            <p className="text-2xl font-bold">{gesture}</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-success/20 border border-success/50">
            <FiCheckCircle size={18} className="text-success" />
            <span className="text-success text-sm font-semibold">Active</span>
          </div>
        </div>

        {/* Current Word */}
        <div className="flex items-center space-x-4 p-5 rounded-xl bg-card border border-border">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
            <FiClock size={32} className="text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-text-secondary text-sm mb-1">Current Word</p>
            <p className="text-2xl font-bold">{currentWord}</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-warning/20 border border-warning/50">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-warning text-sm font-semibold">Processing</span>
          </div>
        </div>

        {/* Confidence Progress */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FiTrendingUp size={18} className="text-primary" />
              <p className="text-text-secondary text-sm font-medium">Prediction Confidence</p>
            </div>
            <span className="text-2xl font-bold gradient-text">{confidence}%</span>
          </div>
          <div className="relative h-3 bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-text-secondary">0%</span>
            <span className="text-xs text-text-secondary">50%</span>
            <span className="text-xs text-text-secondary">100%</span>
          </div>
        </div>

        {/* Prediction Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <p className="text-text-secondary text-xs mb-1">Status</p>
            <p className="font-semibold text-success">{predictionStatus}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <p className="text-text-secondary text-xs mb-1">Response Time</p>
            <p className="font-semibold">45ms</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(LiveDetectionPrediction);
