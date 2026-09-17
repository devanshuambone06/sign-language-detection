class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.isConnected = false;
    this.url = null;
  }

  connect(url) {
    if (!url) return;
    
    // Rewrite localhost to 127.0.0.1 for Windows loopback compatibility
    let targetUrl = url;
    if (targetUrl.includes('localhost')) {
      targetUrl = targetUrl.replace('localhost', '127.0.0.1');
    }

    // Already connected or connecting to the exact same URL
    if (this.ws && this.url === targetUrl && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.close();
      this.ws = null;
    }

    console.log('Connecting to WebSocket:', targetUrl);
    this.url = targetUrl;
    this.ws = new WebSocket(targetUrl);

    this.ws.onopen = () => {
      this.isConnected = true;
      this.emit('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit('message', data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      this.emit('disconnected');
      // Reconnect after 3 seconds if not disconnected manually
      if (this.url && !this.reconnectTimer) {
        this.reconnectTimer = setTimeout(() => {
          this.reconnectTimer = null;
          if (this.url) this.connect(this.url);
        }, 3000);
      }
    };

    this.ws.onerror = (error) => {
      this.emit('error', error);
    };
  }

  disconnect() {
    this.url = null;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.emit('disconnected');
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not open. Cannot send message:', data);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

const websocketService = new WebSocketService();
export default websocketService;
