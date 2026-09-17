import { motion } from 'framer-motion';
import { FiVideo, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const HistoryEmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-12 border border-border text-center"
    >
      <div className="flex flex-col items-center justify-center">
        {/* Illustration */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
          <FiVideo size={64} className="text-text-secondary" />
        </div>
        
        {/* Text */}
        <h3 className="text-2xl font-bold mb-2">No History Found</h3>
        <p className="text-text-secondary mb-8 max-w-md">
          You haven't made any sign language predictions yet. Start detecting gestures to build your history.
        </p>
        
        {/* CTA Button */}
        <Link to="/live-detection">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary px-8 py-4 rounded-xl text-white font-semibold flex items-center space-x-2"
          >
            <span>Start Detection</span>
            <FiArrowRight size={20} />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default HistoryEmptyState;
