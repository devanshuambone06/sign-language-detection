import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ title, highlight, subtitle, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
  >
    <div>
      <h1 className="section-title mb-2">
        {title}{' '}
        {highlight && <span className="gradient-text">{highlight}</span>}
      </h1>
      {subtitle && <p className="section-subtitle max-w-2xl">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </motion.div>
);

export default React.memo(PageHeader);
