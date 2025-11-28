// src/services/websocket.js
class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect(roomCode) {
    // Dynamically set WebSocket URL
    const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';
    this.socket = new WebSocket(`${WS_BASE_URL}/ws/game/${roomCode}/`);
    
    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.listeners[data.type]) {
        this.listeners[data.type].forEach(callback => callback(data));
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  }

  on(eventType, callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default new WebSocketService();
