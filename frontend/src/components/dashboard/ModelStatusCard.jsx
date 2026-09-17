import React from 'react';
import { motion } from 'framer-motion';
import { FiServer, FiWifi, FiCpu, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useWebSocket } from '../../hooks/useWebSocket';

const StatusItem = ({ icon: Icon, label, status, value }) => {
  const statusColor = status === 'online' ? 'text-success' : status === 'warning' ? 'text-warning' : 'text-danger';
  const statusBg = status === 'online' ? 'bg-success/20 border-success/50' : status === 'warning' ? 'bg-warning/20 border-warning/50' : 'bg-danger/20 border-danger/50';
  const StatusIcon = status === 'online' ? FiCheckCircle : FiAlertCircle;

  return (
    <div className="flex items-center space-x-4 p-4 rounded-xl bg-card border border-border">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <Icon size={24} className="text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-text-secondary text-sm">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusBg} border`}>
        <StatusIcon size={14} className={statusColor} />
        <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
      </div>
    </div>
  );
};

const ModelStatusCard = () => {
  const { isConnected, connectionStatus } = useWebSocket();
  
  const backendStatus = isConnected ? 'online' : 'offline';
  const websocketStatus = isConnected ? 'online' : 'offline';
  const modelStatus = 'online';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card rounded-2xl p-6 border border-border"
    >
      <h3 className="text-lg font-semibold mb-4">Model Status</h3>
      
      <div className="space-y-3">
        <StatusItem
          icon={FiServer}
          label="Backend Status"
          status={backendStatus}
          value={isConnected ? 'Connected' : 'Disconnected'}
        />
        <StatusItem
          icon={FiWifi}
          label="WebSocket Status"
          status={websocketStatus}
          value={connectionStatus || 'Unknown'}
        />
        <StatusItem
          icon={FiCpu}
          label="AI Model Status"
          status={modelStatus}
          value="v2.4.1 Running"
        />
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-4 rounded-xl bg-card/50 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary text-sm">Model Version</span>
          <span className="font-medium">v2.4.1</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary text-sm">Last Updated</span>
          <span className="font-medium">2 hours ago</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-sm">Response Time</span>
          <span className="font-medium text-success">45ms</span>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ModelStatusCard);
