import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiClock, FiArrowRight, FiCopy, FiGlobe } from 'react-icons/fi';
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';
import GlassCard from './GlassCard';

const TranslationOutput = ({
  delay = 0.3,
  showCopy = false,
  showLanguageTranslation = false,
  pastDefault = '...',
  presentDefault = '...',
  futureDefault = '...',
}) => {
  const [copied, setCopied] = useState(false);
  const { currentPrediction } = usePredictionContext();

  const past = currentPrediction?.past || pastDefault;
  const present = currentPrediction?.present || presentDefault;
  const future = currentPrediction?.future || futureDefault;
  const translation = currentPrediction?.translation || 'Waiting for translation...';
  const fullSentence = currentPrediction?.sentence || 'Waiting for prediction...';

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSentence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard delay={delay} className="p-6">
      <h3 className="card-title mb-5">Translation Output</h3>

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FiClock size={16} className="text-text-secondary" />
            <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">Past</span>
          </div>
          <p className="text-text-secondary">{past}</p>
        </div>

        <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FiMessageSquare size={16} className="text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider text-primary">Present</span>
          </div>
          <p className="text-lg font-semibold">{present}</p>
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FiArrowRight size={16} className="text-text-secondary" />
            <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">Future</span>
          </div>
          <p className="italic text-text-secondary">{future}</p>
        </div>

        {showLanguageTranslation && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiGlobe size={16} className="text-secondary" />
                <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Spanish Translation
                </span>
              </div>
              {showCopy && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="rounded-lg p-2 transition-colors hover:bg-card/80"
                  aria-label="Copy translation"
                >
                  <FiCopy size={16} className={copied ? 'text-success' : 'text-text-secondary'} />
                </motion.button>
              )}
            </div>
            <p className="font-medium">{translation}</p>
          </div>
        )}

        <div
          className={`rounded-xl border border-border p-4 ${
            showCopy ? 'bg-gradient-to-br from-primary/5 to-secondary/5' : 'bg-card'
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              Full Translation
            </p>
            {showCopy && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="rounded-lg p-2 transition-colors hover:bg-card/80"
                aria-label="Copy full translation"
              >
                <FiCopy size={16} className={copied ? 'text-success' : 'text-text-secondary'} />
              </motion.button>
            )}
          </div>
          <p className="font-medium">&ldquo;{fullSentence}&rdquo;</p>
          {showCopy && copied && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xs text-success"
            >
              Copied to clipboard!
            </motion.p>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default TranslationOutput;
