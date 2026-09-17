import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PredictionProvider } from './context/PredictionContext';
import { HistoryProvider } from './context/HistoryContext';
import { LabelProvider } from './context/LabelContext';
import { ThemeProvider } from './context/ThemeContext';
import { motion } from 'framer-motion';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LiveDetection = lazy(() => import('./pages/LiveDetection'));
const Analytics = lazy(() => import('./pages/Analytics'));
const History = lazy(() => import('./pages/History'));

const LoadingSpinner = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
    />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <LabelProvider>
        <PredictionProvider>
          <HistoryProvider>
            <Router>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<LiveDetection />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/live-detection" element={<LiveDetection />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/history" element={<History />} />
                </Routes>
              </Suspense>
            </Router>
          </HistoryProvider>
        </PredictionProvider>
      </LabelProvider>
    </ThemeProvider>
  );
}

export default App;