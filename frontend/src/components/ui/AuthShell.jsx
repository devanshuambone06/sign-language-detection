import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthShell = ({ children, title, subtitle }) => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6">
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
    <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
    <div className="pointer-events-none absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 w-full max-w-md"
    >
      <div className="mb-8 text-center">
        <Link to="/" className="mb-6 inline-flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-glow-sm">
            <span className="text-xl font-bold text-white">AI</span>
          </div>
          <span className="text-2xl font-bold tracking-tight gradient-text">SLT Pro</span>
        </Link>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-text-secondary">{subtitle}</p>
      </div>

      {children}
    </motion.div>
  </div>
);

export default React.memo(AuthShell);
