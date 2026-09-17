import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiFile } from 'react-icons/fi';
import { exportToPDF, exportToDOCX, exportToCSV } from '../../services/exportService';

const HistoryExportCard = ({ historyData = [] }) => {
  const [isExporting, setIsExporting] = useState(null);

  const exportOptions = [
    { icon: FiFileText, label: 'Export PDF', color: 'primary', action: exportToPDF },
    { icon: FiDownload, label: 'Export DOCX', color: 'secondary', action: exportToDOCX },
    { icon: FiFile, label: 'Export CSV', color: 'success', action: exportToCSV },
  ];

  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 border-primary/30 hover:border-primary/50',
    secondary: 'from-secondary/20 to-secondary/5 hover:from-secondary/30 hover:to-secondary/10 border-secondary/30 hover:border-secondary/50',
    success: 'from-success/20 to-success/5 hover:from-success/30 hover:to-success/10 border-success/30 hover:border-success/50',
  };

  const iconColorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
  };

  const handleExport = async (action, label) => {
    setIsExporting(label);
    try {
      await action({ history: historyData });
    } catch (error) {
      console.error(`Export to ${label} failed:`, error);
      alert(error.message || `Export to ${label} failed`);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">Export Options</h3>
      
      <div className="space-y-3">
        {exportOptions.map((option) => (
          <motion.button
            key={option.label}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleExport(option.action, option.label)}
            disabled={isExporting !== null}
            className={`w-full p-4 rounded-xl bg-gradient-to-br ${colorClasses[option.color]} border transition-all duration-200 flex items-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <option.icon size={24} className={iconColorClasses[option.color]} />
            <span className="font-medium">
              {isExporting === option.label ? 'Exporting...' : option.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Export Info */}
      <div className="mt-4 p-4 rounded-xl bg-card/50 border border-border">
        <p className="text-sm text-text-secondary mb-2">
          Export your complete prediction history in your preferred format.
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Total Records</span>
          <span className="font-semibold">{historyData.length}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(HistoryExportCard);
