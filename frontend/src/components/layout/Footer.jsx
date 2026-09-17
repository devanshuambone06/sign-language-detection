import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGithub, FiMail, FiArrowUp } from 'react-icons/fi';
import { FaLinkedin, FaXTwitter } from 'react-icons/fa6';

const footerLinks = {
  product: [
    { name: 'Features', path: '#features' },
    { name: 'Pricing', path: '#pricing' },
    { name: 'API', path: '#api' },
    { name: 'Documentation', path: '#docs' },
  ],
  company: [
    { name: 'About', path: '#about' },
    { name: 'Blog', path: '#blog' },
    { name: 'Careers', path: '#careers' },
    { name: 'Contact', path: '#contact' },
  ],
  legal: [
    { name: 'Privacy', path: '#privacy' },
    { name: 'Terms', path: '#terms' },
    { name: 'Security', path: '#security' },
    { name: 'Cookies', path: '#cookies' },
  ],
};

const socialLinks = [
  { icon: FaXTwitter, path: 'https://twitter.com', label: 'X (Twitter)' },
  { icon: FiGithub, path: 'https://github.com', label: 'GitHub' },
  { icon: FaLinkedin, path: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiMail, path: 'mailto:contact@example.com', label: 'Email' },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 mt-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <span className="text-lg font-bold text-white">AI</span>
              </div>
              <span className="text-xl font-bold tracking-tight gradient-text">SLT Pro</span>
            </Link>
            <p className="mb-6 max-w-sm text-text-secondary">
              Break communication barriers with AI-powered sign language translation.
              Real-time, accurate, and accessible for everyone.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.path}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border glass-card-light text-text-secondary transition-colors hover:border-primary/40 hover:text-text"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="mb-4 text-sm font-semibold capitalize text-text">{section}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.path}
                      className="text-sm text-text-secondary transition-colors hover:text-text"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} SLT Pro. All rights reserved.
          </p>
          <motion.button
            type="button"
            onClick={scrollToTop}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text"
          >
            Back to top
            <FiArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
