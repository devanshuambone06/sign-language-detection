import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiBell, FiSun, FiMoon, FiMenu, FiChevronDown, FiUser, FiSettings, FiCreditCard, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const notifications = [
  { id: 1, message: 'New model update available', time: '2 min ago', unread: true },
  { id: 2, message: 'Your session saved successfully', time: '1 hour ago', unread: false },
  { id: 3, message: 'Weekly report is ready', time: '3 hours ago', unread: false },
];
const user = JSON.parse(localStorage.getItem("user")) || {
  name: "Guest User",
  email: "guest@example.com",
  role: "User",
};
const DashboardNavbar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setShowProfile(false);
    console.log('Logged out successfully');
    navigate('/login');
  };

  const handleProfileAction = (action) => {
    setShowProfile(false);
    if (action === 'profile') {
      console.log('Navigate to profile');
    } else if (action === 'settings') {
      console.log('Navigate to settings');
    } else if (action === 'billing') {
      console.log('Navigate to billing');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowProfile(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-border glass-card">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="rounded-xl p-2.5 text-text-secondary transition-colors hover:bg-card hover:text-text lg:hidden"
            aria-label="Toggle menu"
          >
            <FiMenu size={22} />
          </button>

          <div className="hidden min-w-0 flex-1 md:block md:max-w-md">
            <div className="relative">
              <FiSearch
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
                size={18}
              />
              <input
                type="text"
                placeholder="Search gestures, history..."
                className="input-field pl-11 pr-4 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggleTheme}
            className="rounded-xl border border-border bg-card/80 p-2.5 text-text-secondary transition-colors hover:border-primary/40 hover:text-text"
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </motion.button>

          <div className="relative" ref={notificationsRef}>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative rounded-xl border border-border bg-card/80 p-2.5 text-text-secondary transition-colors hover:border-primary/40 hover:text-text"
              aria-label="Notifications"
            >
              <FiBell size={18} />
              {notifications.some((n) => n.unread) && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-background" />
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-border glass-card shadow-glow"
                >
                  <div className="border-b border-border px-4 py-3">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto scrollbar-thin">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`cursor-pointer px-4 py-3 transition-colors hover:bg-card/70 ${
                          notification.unread ? 'bg-primary/5' : ''
                        }`}
                      >
                        <p className="mb-1 text-sm">{notification.message}</p>
                        <p className="text-xs text-text-secondary">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={profileRef}>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfile((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl p-1.5 pr-2 transition-colors hover:bg-card/70 sm:gap-3 sm:pr-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
   <span className="text-sm font-bold text-white">
  {user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()}
</span>
              </div>
              <div className="hidden text-left md:block">
               <p className="text-sm font-medium leading-tight">{user.name}</p>
<p className="text-xs text-text-secondary">{user.role}</p>
              </div>
              <FiChevronDown size={16} className="hidden text-text-secondary md:block" />
            </motion.button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border glass-card shadow-glow"
                >
                  <div className="border-b border-border px-4 py-3">
                    <p className="font-semibold">{user.name}</p>
<p className="text-sm text-text-secondary">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => handleProfileAction('profile')}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-card/70"
                    >
                      <FiUser size={16} className="text-text-secondary" />
                      My Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProfileAction('settings')}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-card/70"
                    >
                      <FiSettings size={16} className="text-text-secondary" />
                      Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProfileAction('billing')}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-card/70"
                    >
                      <FiCreditCard size={16} className="text-text-secondary" />
                      Billing
                    </button>
                    <div className="my-1 border-t border-border" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-danger transition-colors hover:bg-danger/10"
                    >
                      <FiLogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(DashboardNavbar);
