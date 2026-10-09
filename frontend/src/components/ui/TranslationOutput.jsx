import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiClock, FiArrowRight, FiCopy, FiGlobe, FiZap } from 'react-icons/fi';
import { usePrediction as usePredictionContext } from '../../context/PredictionContext';
import GlassCard from './GlassCard';

const TranslationOutput = ({
  delay = 0.3,
  showCopy = false,
  showLanguageTranslation = false,
  pastDefault = 'Waiting for sign...',
  presentDefault = 'Perform a sign',
  futureDefault = 'Continue signing...',
}) => {
  const [copied, setCopied] = useState(false);
  const { currentPrediction, predictionHistory } = usePredictionContext();

  // Build live running sentence from last 10 detected gestures
  const recentWords = predictionHistory
    .slice(0, 10)
    .map(p => p.gesture)
    .filter(Boolean)
    .reverse()
    .join(' ');

  const past         = currentPrediction?.past       || (currentPrediction ? `Previously: ${currentPrediction.gesture}` : pastDefault);
  const present      = currentPrediction?.present    || currentPrediction?.sentence || currentPrediction?.gesture || presentDefault;
  const future       = currentPrediction?.future     || (currentPrediction ? 'Continue signing to extend sentence' : futureDefault);
  const translation  = currentPrediction?.translation || present;
  const fullSentence = currentPrediction?.sentence   || recentWords || 'Perform a sign to begin...';
  const lastWord     = currentPrediction?.gesture    || '';
  const isCorrect    = currentPrediction?.is_correct;
  const confidence   = currentPrediction
    ? parseFloat((currentPrediction.confidence > 1 ? currentPrediction.confidence : currentPrediction.confidence * 100).toFixed(1))
    : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSentence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard delay={delay} className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="card-title">Translation Output</h3>
        {lastWord && (
          <motion.div
            key={lastWord}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isCorrect
                ? 'bg-success/20 border-success/50 text-success'
                : 'bg-warning/20 border-warning/50 text-warning'
            }`}
          >
            <FiZap size={11} />
            {isCorrect ? `✓ ${lastWord}` : 'Low Confidence'}
          </motion.div>
        )}
      </div>

      {/* Live building sentence bar */}
      {recentWords && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-xl border border-primary/40 bg-gradient-to-r from-primary/10 to-secondary/10 p-3"
        >
          <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">📝 Building Sentence</p>
          <p className="text-sm font-medium text-white tracking-wide">{recentWords}</p>
        </motion.div>
      )}

      <div className="space-y-3">
        {/* Past */}
        <div className="rounded-xl border border-border bg-card/50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <FiClock size={13} className="text-text-secondary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Past</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={past} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-text-secondary text-sm">
              {past}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Present — highlighted */}
        <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
          <div className="flex items-center gap-2 mb-1">
            <FiMessageSquare size={13} className="text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Present</span>
            {confidence > 0 && (
              <span className="ml-auto text-xs font-bold text-primary">{confidence}%</span>
            )}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={present}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xl font-bold"
            >
              {present}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Future */}
        <div className="rounded-xl border border-border bg-card/50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <FiArrowRight size={13} className="text-text-secondary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Future</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={future} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="italic text-text-secondary text-sm">
              {future}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Language Translation */}
        {showLanguageTranslation && (
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <FiGlobe size={13} className="text-secondary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Translation</span>
            </div>
            <p className="font-medium text-sm">{translation}</p>
          </div>
        )}

        {/* Full sentence */}
        <div className="rounded-xl border border-primary/20 bg-card/80 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Full Sentence</p>
            {showCopy && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="rounded-lg p-1.5 hover:bg-card/80 transition-colors"
              >
                <FiCopy size={13} className={copied ? 'text-success' : 'text-text-secondary'} />
              </motion.button>
            )}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={fullSentence}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-semibold text-sm leading-relaxed"
            >
              &ldquo;{fullSentence}&rdquo;
            </motion.p>
          </AnimatePresence>
          {showCopy && copied && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-xs text-success">
              ✓ Copied to clipboard!
            </motion.p>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default TranslationOutput;
