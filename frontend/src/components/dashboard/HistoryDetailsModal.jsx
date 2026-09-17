import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiClock, FiUser, FiTrendingUp, FiCopy, FiDownload } from 'react-icons/fi';

const HistoryDetailsModal = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.sentence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    // Placeholder for export functionality
    console.log('Export clicked for:', data.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-bold">Prediction Details</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-card transition-colors"
                >
                  <FiX size={20} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Gesture */}
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <FiUser size={32} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-secondary text-sm">Detected Gesture</p>
                    <p className="text-2xl font-bold">{data.gesture}</p>
                  </div>
                </div>

                {/* Complete Sentence */}
                <div className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-text-secondary text-sm">Complete Sentence</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopy}
                      className="p-2 rounded-lg hover:bg-card transition-colors"
                    >
                      <FiCopy size={16} className={copied ? 'text-success' : 'text-text-secondary'} />
                    </motion.button>
                  </div>
                  <p className="font-medium">{data.sentence}</p>
                </div>

                {/* Translation */}
                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-text-secondary text-sm mb-2">Translation ({data.language})</p>
                  <p className="font-medium">{data.translation}</p>
                </div>

                {/* Tenses */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-card/50 border border-border text-center">
                    <p className="text-text-secondary text-xs mb-1">Past</p>
                    <p className="font-medium text-sm">was {data.gesture.toLowerCase()}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 text-center">
                    <p className="text-primary text-xs mb-1">Present</p>
                    <p className="font-semibold">{data.gesture}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-card/50 border border-border text-center">
                    <p className="text-text-secondary text-xs mb-1">Future</p>
                    <p className="font-medium text-sm">will {data.gesture.toLowerCase()}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <FiTrendingUp size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-text-secondary text-xs">Confidence</p>
                      <p className="font-bold">{data.confidence}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <FiClock size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-text-secondary text-xs">Timestamp</p>
                      <p className="font-bold">{data.timestamp}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExport}
                    className="flex-1 btn-primary py-3 rounded-xl text-white font-semibold flex items-center justify-center space-x-2"
                  >
                    <FiDownload size={18} />
                    <span>Export</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-card border border-border hover:border-primary transition-colors font-semibold"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HistoryDetailsModal;
