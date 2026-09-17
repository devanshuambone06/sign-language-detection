import { motion } from 'framer-motion';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import PageHeader from '../components/ui/PageHeader';
import LiveDetectionCamera from '../components/dashboard/LiveDetectionCamera';
import LiveDetectionPrediction from '../components/dashboard/LiveDetectionPrediction';
import LiveDetectionTranslation from '../components/dashboard/LiveDetectionTranslation';
import SuggestionsCard from '../components/dashboard/SuggestionsCard';
import LiveDetectionQuickActions from '../components/dashboard/LiveDetectionQuickActions';
import LiveDetectionHistory from '../components/dashboard/LiveDetectionHistory';
import ConnectionStatusCard from '../components/dashboard/ConnectionStatusCard';

const LiveDetection = () => (
  <DashboardLayout>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <PageHeader
        title="Live"
        highlight="Detection"
        subtitle="Real-time AI-powered sign language detection and translation."
      />

      <LiveDetectionCamera />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LiveDetectionPrediction />
        <LiveDetectionTranslation />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SuggestionsCard />
        <LiveDetectionQuickActions />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LiveDetectionHistory />
        </div>
        <ConnectionStatusCard />
      </div>
    </motion.div>
  </DashboardLayout>
);

export default LiveDetection;
