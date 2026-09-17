import { useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../services/websocket';

export const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(websocketService.getConnectionStatus());
  const [error, setError] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(websocketService.getConnectionStatus() ? 'Connected' : 'Disconnected');
  const messageHandlerRef = useRef(null);

  const connect = useCallback(() => {
    if (url) websocketService.connect(url);
  }, [url]);

  const disconnect = useCallback(() => {
    if (url) websocketService.disconnect();
  }, [url]);

  const send = useCallback((data) => {
    websocketService.send(data);
  }, []);

  const onMessage = useCallback((callback) => {
    messageHandlerRef.current = callback;
  }, []);

  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
      setConnectionStatus('Connected');
      setError(null);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setConnectionStatus('Disconnected');
    };

    const handleError = (err) => {
      setError(err);
      setConnectionStatus('Error');
    };

    const handleMessage = (data) => {
      setLastMessage(data);
      if (messageHandlerRef.current) {
        messageHandlerRef.current(data);
      }
    };

    websocketService.on('connected', handleConnected);
    websocketService.on('disconnected', handleDisconnected);
    websocketService.on('error', handleError);
    websocketService.on('message', handleMessage);

    return () => {
      websocketService.off('connected', handleConnected);
      websocketService.off('disconnected', handleDisconnected);
      websocketService.off('error', handleError);
      websocketService.off('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [url, connect, disconnect]);

  return {
    isConnected,
    error,
    lastMessage,
    connectionStatus,
    send,
    connect,
    disconnect,
    onMessage,
  };
};
