import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Features', path: '#features' },
  { name: 'How It Works', path: '#how-it-works' },
  { name: 'Pricing', path: '#pricing' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-card border-b border-border py-3 shadow-glow-sm' : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-glow-sm">
              <span className="text-lg font-bold text-white">AI</span>
            </div>
            <span className="hidden text-lg font-bold tracking-tight gradient-text sm:inline sm:text-xl">
              SLT Pro
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-text"
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition-all hover:border-primary/50 hover:bg-card/50"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="btn-primary rounded-xl px-5 py-2.5 text-sm font-medium text-white"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl p-2 text-text transition-colors hover:bg-card/60 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="mt-4 rounded-2xl border border-border glass-card p-5">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-card/60 hover:text-text"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
                <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-border px-5 py-2.5 text-center text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary rounded-xl px-5 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default React.memo(Navbar);
