import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid,
  FiVideo,
  FiBarChart2,
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
} from 'react-icons/fi';

const user = JSON.parse(localStorage.getItem("user")) || {
  name: "Guest User",
  role: "User",
};
const menuItems = [
  { icon: FiGrid, label: 'Dashboard', path: '/dashboard' },
  { icon: FiVideo, label: 'Live Detection', path: '/live-detection' },
  { icon: FiBarChart2, label: 'Analytics', path: '/analytics' },
  { icon: FiClock, label: 'History', path: '/history' },
];

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    console.log('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col border-r border-border glass-card lg:sticky lg:top-0 lg:z-30 lg:h-screen ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300 lg:transition-none`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[72px] items-center justify-between border-b border-border px-4 lg:px-5">
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div
                  key="logo-full"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-glow-sm">
                    <span className="text-lg font-bold text-white">AI</span>
                  </div>
                  <div>
                    <span className="block text-base font-bold tracking-tight gradient-text">SLT Pro</span>
                   
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="logo-collapsed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary"
                >
                  <span className="text-sm font-bold text-white">AI</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/80 text-text-secondary transition-colors hover:border-primary/50 hover:text-text lg:flex"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5 scrollbar-thin">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className="group relative block"
                >
                  <motion.div
                    whileHover={{ x: isCollapsed ? 0 : 2 }}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                      active
                        ? 'border border-primary/30 bg-primary/10 text-primary shadow-glow-sm'
                        : 'border border-transparent text-text-secondary hover:border-border hover:bg-card/60 hover:text-text'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <item.icon size={20} className={active ? 'text-primary' : 'group-hover:text-text'} />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                    {active && !isCollapsed && (
                      <motion.div
                        layoutId="sidebarActive"
                        className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

         <div className="border-t border-border p-3">
  <div
    className={`flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-card/60 ${
      isCollapsed ? "justify-center" : ""
    }`}
  >
    {/* Avatar */}
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
      <span className="text-sm font-bold text-white">
        {user.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()}
      </span>
    </div>

    {/* User Details */}
    {!isCollapsed && (
      <>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="text-xs text-text-secondary">{user.role}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-card hover:text-text"
          aria-label="Sign out"
        >
          <FiLogOut size={16} />
        </button>
      </>
    )}
  </div>
</div>
        </div>
      </motion.aside>
    </>
  );
};

export default React.memo(Sidebar);
