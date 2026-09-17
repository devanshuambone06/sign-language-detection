import React from 'react';
import { motion } from 'framer-motion';
import { FiServer, FiWifi, FiVideo, FiCpu, FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';

const StatusItem = ({ icon: Icon, label, status, value }) => {
  const statusConfig = {
    online: { color: 'text-success', bg: 'bg-success/20', border: 'border-success/50', icon: FiCheckCircle },
    connecting: { color: 'text-warning', bg: 'bg-warning/20', border: 'border-warning/50', icon: FiAlertCircle },
    offline: { color: 'text-danger', bg: 'bg-danger/20', border: 'border-danger/50', icon: FiXCircle },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center space-x-4 p-4 rounded-xl bg-card border border-border">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <Icon size={24} className="text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-text-secondary text-sm">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${config.bg} border ${config.border}`}>
        <StatusIcon size={14} className={config.color} />
        <span className={`text-xs font-medium ${config.color}`}>{status}</span>
      </div>
    </div>
  );
};

const ConnectionStatusCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">Connection Status</h3>
      
      <div className="space-y-3">
        <StatusItem
          icon={FiServer}
          label="Backend Status"
          status="online"
          value="Connected"
        />
        <StatusItem
          icon={FiWifi}
          label="WebSocket Status"
          status="online"
          value="Active"
        />
        <StatusItem
          icon={FiVideo}
          label="Camera Status"
          status="online"
          value="Ready"
        />
        <StatusItem
          icon={FiCpu}
          label="Model Status"
          status="online"
          value="v2.4.1 Loaded"
        />
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary text-sm">Latency</span>
          <span className="font-semibold text-success">45ms</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary text-sm">Uptime</span>
          <span className="font-semibold">99.9%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-sm">Last Update</span>
          <span className="font-semibold">2s ago</span>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ConnectionStatusCard);
