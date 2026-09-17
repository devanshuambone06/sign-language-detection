import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiDownload, FiCopy, FiTrash2 } from "react-icons/fi";
import { exportToPDF, exportToDOCX } from "../../services/exportService";
import { usePrediction as usePredictionContext } from "../../context/PredictionContext";

const QuickActionsCard = () => {
  const [isExporting, setIsExporting] = useState(null);
  const { predictionHistory, clearHistory } = usePredictionContext();

  const colorClasses = {
    primary:
      "from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10",
    secondary:
      "from-secondary/20 to-secondary/5 hover:from-secondary/30 hover:to-secondary/10",
    success:
      "from-success/20 to-success/5 hover:from-success/30 hover:to-success/10",
    danger:
      "from-danger/20 to-danger/5 hover:from-danger/30 hover:to-danger/10",
  };

  const iconColorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
    danger: "text-danger",
  };

  const borderHoverClasses = {
    primary: "hover:border-primary/50",
    secondary: "hover:border-secondary/50",
    success: "hover:border-success/50",
    danger: "hover:border-danger/50",
  };

  const handleExport = async (exportFunc, label) => {
    setIsExporting(label);
    try {
      await exportFunc({ history: predictionHistory });
    } catch (error) {
      console.error(`Export to ${label} failed:`, error);
      alert(error.message || `Export to ${label} failed`);
    } finally {
      setIsExporting(null);
    }
  };

  const handleCopy = async () => {
    try {
      const text = predictionHistory
        .map((p) => p.sentence || p.present)
        .join(" ");

      await navigator.clipboard.writeText(text);
      // Using console instead of alert for better UX
      console.log("Copied to clipboard!");
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all predictions?")) {
      clearHistory();
    }
  };

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
      icon: FiCopy,
      label: "Copy Text",
      color: "success",
      action: handleCopy,
    },
    {
      icon: FiTrash2,
      label: "Clear All",
      color: "danger",
      action: handleClear,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            disabled={isExporting !== null}
            className={`p-4 rounded-xl bg-gradient-to-br ${
              colorClasses[action.color]
            } border border-border ${
              borderHoverClasses[action.color]
            } transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={action.label}
          >
            <action.icon
              size={24}
              className={`${iconColorClasses[action.color]} mx-auto`}
            />

            <p className="text-sm font-medium mt-2 text-center">
              {isExporting === action.label
                ? "Exporting..."
                : action.label}
            </p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default React.memo(QuickActionsCard);