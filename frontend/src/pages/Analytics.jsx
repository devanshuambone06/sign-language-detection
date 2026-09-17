import { motion } from 'framer-motion';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import PageHeader from '../components/ui/PageHeader';
import AnalyticsKPICards from '../components/dashboard/AnalyticsKPICards';
import ConfidenceTimelineChart from '../components/dashboard/ConfidenceTimelineChart';
import GestureFrequencyChart from '../components/dashboard/GestureFrequencyChart';
import LanguageDistributionChart from '../components/dashboard/LanguageDistributionChart';
import DetectionTrendsChart from '../components/dashboard/DetectionTrendsChart';
import TopSignsChart from '../components/dashboard/TopSignsChart';
import AIInsightsPanel from '../components/dashboard/AIInsightsPanel';
import PerformanceSection from '../components/dashboard/PerformanceSection';
import RecentAnalyticsTable from '../components/dashboard/RecentAnalyticsTable';

const Analytics = () => (
  <DashboardLayout>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <PageHeader
        title="Analytics"
        highlight="Dashboard"
        subtitle="Comprehensive insights into your sign language translation performance."
      />

      <AnalyticsKPICards />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ConfidenceTimelineChart />
        <GestureFrequencyChart />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LanguageDistributionChart />
        <DetectionTrendsChart />
      </div>

      <div className="mt-6">
        <TopSignsChart />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AIInsightsPanel />
        <PerformanceSection />
      </div>

      <div className="mt-6">
        <RecentAnalyticsTable />
      </div>
    </motion.div>
  </DashboardLayout>
);

export default Analytics;
