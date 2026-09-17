import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import PageHeader from '../components/ui/PageHeader';
import HistoryStatisticsCards from '../components/dashboard/HistoryStatisticsCards';
import HistoryFilters from '../components/dashboard/HistoryFilters';
import HistoryTable from '../components/dashboard/HistoryTable';
import HistoryDetailsModal from '../components/dashboard/HistoryDetailsModal';
import HistoryTimeline from '../components/dashboard/HistoryTimeline';
import HistoryExportCard from '../components/dashboard/HistoryExportCard';
import HistoryEmptyState from '../components/dashboard/HistoryEmptyState';
import HistoryLoadingState from '../components/dashboard/HistoryLoadingState';
import { useHistory } from '../context/HistoryContext';
import { usePrediction as usePredictionContext } from '../context/PredictionContext';

const History = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 const {
    filteredHistory,
    isLoading,
    fetchHistory,
    deleteItem,
    updateFilters,
} = useHistory();
  const { predictionHistory } = usePredictionContext();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const displayHistory = filteredHistory.length > 0 ? filteredHistory : predictionHistory;
  const isEmpty = displayHistory.length === 0;

  const handleFilterChange = (filters) => {
    updateFilters({
        search: filters.searchGesture || filters.searchSentence,
        language: filters.language,
        confidence: filters.confidence,
        sortBy: filters.sortBy,
    });
};

  const refreshButton = (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04, rotate: 15 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => fetchHistory()}
      className="rounded-xl border border-border bg-card/80 p-3 text-text-secondary transition-colors hover:border-primary/40 hover:text-text"
      aria-label="Refresh history"
    >
      <FiRefreshCw size={18} />
    </motion.button>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <HistoryLoadingState />
      </DashboardLayout>
    );
  }

  if (isEmpty) {
    return (
      <DashboardLayout>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <PageHeader
            title="Prediction"
            highlight="History"
            subtitle="View and manage your sign language translation history."
          />
          <HistoryEmptyState />
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <PageHeader
          title="Prediction"
          highlight="History"
          subtitle="View and manage your sign language translation history."
          action={refreshButton}
        />

        <HistoryStatisticsCards />

        <div className="mt-6">
          <HistoryFilters
    onFilterChange={handleFilterChange}
/>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HistoryTable
              onViewDetails={(item) => {
                setSelectedItem(item);
                setIsModalOpen(true);
              }}
              onDelete={deleteItem}
              historyData={displayHistory}
            />
          </div>
          <div className="space-y-6">
            <HistoryTimeline historyData={displayHistory} />
            <HistoryExportCard historyData={displayHistory} />
          </div>
        </div>

        <HistoryDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedItem}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default History;
