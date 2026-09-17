import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({
  children,
  className = '',
  hover = false,
  delay = 0,
  ...motionProps
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={hover ? { y: -2 } : undefined}
    className={`glass-card rounded-2xl border border-border ${hover ? 'glass-card-hover cursor-default' : ''} ${className}`}
    {...motionProps}
  >
    {children}
  </motion.div>
);

export default React.memo(GlassCard);
