import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiFileText,
  FiDownload,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import { exportToPDF, exportToDOCX } from "../../services/exportService";
import { usePrediction as usePredictionContext } from "../../context/PredictionContext";

const LiveDetectionQuickActions = () => {
  const [isExporting, setIsExporting] = useState(null);
  const { predictionHistory, clearHistory } = usePredictionContext();

  const colorClasses = {
    primary:
      "from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 border-primary/30 hover:border-primary/50",
    secondary:
      "from-secondary/20 to-secondary/5 hover:from-secondary/30 hover:to-secondary/10 border-secondary/30 hover:border-secondary/50",
    danger:
      "from-danger/20 to-danger/5 hover:from-danger/30 hover:to-danger/10 border-danger/30 hover:border-danger/50",
    warning:
      "from-warning/20 to-warning/5 hover:from-warning/30 hover:to-warning/10 border-warning/30 hover:border-warning/50",
  };

  const iconColorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    danger: "text-danger",
    warning: "text-warning",
  };

  // ================= FUNCTIONS =================

  const handleExport = async (exportFunc, label) => {
    setIsExporting(label);

    try {
      await exportFunc({
        history: predictionHistory,
      });
    } catch (error) {
      console.error(`Export ${label} failed`, error);
      alert(error.message || `Export ${label} failed`);
    } finally {
      setIsExporting(null);
    }
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the prediction history?"
      )
    ) {
      clearHistory();
    }
  };

  const handleReset = () => {
    console.log("Reset Detection");
    // Add reset logic here later
  };

  // ================= ACTIONS =================

  const actions = [
    {
      icon: FiFileText,
      label: "Export PDF",
      color: "primary",
      action: () => handleExport(exportToPDF, "PDF"),
    },
    {
      icon: FiDownload,
      label: "Export DOCX",
      color: "secondary",
      action: () => handleExport(exportToDOCX, "DOCX"),
    },
    {
      icon: FiTrash2,
      label: "Clear History",
      color: "danger",
      action: handleClearHistory,
    },
    {
      icon: FiRefreshCw,
      label: "Reset Detection",
      color: "warning",
      action: handleReset,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            disabled={isExporting !== null}
            className={`p-5 rounded-xl bg-gradient-to-br ${colorClasses[action.color]} border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <action.icon
              size={28}
              className={`${iconColorClasses[action.color]} mx-auto`}
            />

            <p className="text-sm font-medium mt-3 text-center">
              {isExporting === action.label
                ? "Exporting..."
                : action.label}
            </p>
          </motion.button>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-xl bg-card/50 border border-border">
        <p className="text-text-secondary text-xs mb-2">
          Session Stats
        </p>

        <div className="flex justify-between">
          <span>Total Gestures</span>
          <span className="font-semibold">
            {predictionHistory.length}
          </span>
        </div>

        <div className="flex justify-between mt-2">
          <span>Session Duration</span>
          <span className="font-semibold">
            12m 34s
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(LiveDetectionQuickActions);