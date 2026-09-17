import axios from 'axios';

// When running via Vite dev server (port 5173), the proxy forwards:
//   /api/*  →  http://127.0.0.1:8000/api/*
//   /ws/*   →  ws://127.0.0.1:8000/ws/*
// So we always use the current page's origin (which has the Vite proxy).
const api = axios.create({
  baseURL: window.location.origin,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export default api;
