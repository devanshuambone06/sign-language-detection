import { motion } from 'framer-motion';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import PageHeader from '../components/ui/PageHeader';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import CameraPreviewCard from '../components/dashboard/CameraPreviewCard';
import PredictionResultCard from '../components/dashboard/PredictionResultCard';
import ConfidenceScoreCard from '../components/dashboard/ConfidenceScoreCard';
import TranslationCard from '../components/dashboard/TranslationCard';
import QuickActionsCard from '../components/dashboard/QuickActionsCard';
import RecentActivityTable from '../components/dashboard/RecentActivityTable';
import ModelStatusCard from '../components/dashboard/ModelStatusCard';

const Dashboard = () => (
  <DashboardLayout>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Welcome back,"
        highlight="John"
        subtitle="Here's what's happening with your sign language translation today."
      />

      <StatisticsCards />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CameraPreviewCard />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <PredictionResultCard />
            <ConfidenceScoreCard />
          </div>
        </div>

        <div className="space-y-6">
          <TranslationCard />
          <QuickActionsCard />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivityTable />
        </div>
        <ModelStatusCard />
      </div>
    </motion.div>
  </DashboardLayout>
);

export default Dashboard;
