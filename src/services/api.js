import axios from 'axios';
import mockApi from './mockApi';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../utils/constants';

let useMockMode = import.meta.env.VITE_USE_MOCK === 'true';
let mockModeChecked = useMockMode;

export const isMockMode = () => useMockMode;

export const setMockMode = (value) => {
  useMockMode = value;
  mockModeChecked = true;
};

const realApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
});

realApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token && token !== 'mock-jwt-token') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

realApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      if (
        !window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/register')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const checkBackend = async () => {
  if (mockModeChecked) return !useMockMode;
  try {
    await realApi.get('/../health', { baseURL: 'http://localhost:8000', timeout: 2000 });
    useMockMode = false;
  } catch {
    useMockMode = true;
  }
  mockModeChecked = true;
  return !useMockMode;
};

const api = {
  async login(email, password) {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      setMockMode(true);
      return { data: await mockApi.login(email, password) };
    }
    const backendUp = await checkBackend();
    if (!backendUp) {
      setMockMode(true);
      return { data: await mockApi.login(email, password) };
    }
    const formData = new URLSearchParams();
    formData.append('username', email.trim().toLowerCase());
    formData.append('password', password);
    return realApi.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },

  async register(payload) {
    if (useMockMode) return { data: await mockApi.register(payload.name, payload.email, payload.password) };
    const backendUp = await checkBackend();
    if (!backendUp) {
      setMockMode(true);
      return { data: await mockApi.register(payload.name, payload.email, payload.password) };
    }
    return realApi.post('/auth/register', payload);
  },

  async getMe() {
    if (useMockMode || localStorage.getItem(AUTH_TOKEN_KEY) === 'mock-jwt-token') {
      setMockMode(true);
      return { data: await mockApi.getMe() };
    }
    return realApi.get('/auth/me');
  },

  async getLeads() {
    if (useMockMode) return { data: await mockApi.getLeads() };
    try {
      return await realApi.get('/leads');
    } catch {
      setMockMode(true);
      return { data: await mockApi.getLeads() };
    }
  },

  async createLead(data) {
    if (useMockMode) return { data: await mockApi.createLead(data) };
    try {
      return await realApi.post('/leads', data);
    } catch {
      setMockMode(true);
      return { data: await mockApi.createLead(data) };
    }
  },

  async updateLead(id, data) {
    if (useMockMode) return { data: await mockApi.updateLead(id, data) };
    try {
      return await realApi.put(`/leads/${id}`, data);
    } catch {
      setMockMode(true);
      return { data: await mockApi.updateLead(id, data) };
    }
  },

  async deleteLead(id) {
    if (useMockMode) return { data: await mockApi.deleteLead(id) };
    try {
      return await realApi.delete(`/leads/${id}`);
    } catch {
      setMockMode(true);
      return { data: await mockApi.deleteLead(id) };
    }
  },

  async getFollowups() {
    if (useMockMode) return { data: await mockApi.getFollowups() };
    try {
      return await realApi.get('/followups');
    } catch {
      setMockMode(true);
      return { data: await mockApi.getFollowups() };
    }
  },

  async createFollowup(data) {
    const payload = { ...data, reminder_date: new Date(data.reminder_date).toISOString() };
    if (useMockMode) return { data: await mockApi.createFollowup(payload) };
    try {
      return await realApi.post('/followups', payload);
    } catch {
      setMockMode(true);
      return { data: await mockApi.createFollowup(payload) };
    }
  },

  async updateFollowup(id, data) {
    if (useMockMode) return { data: await mockApi.updateFollowup(id, data) };
    try {
      return await realApi.put(`/followups/${id}`, data);
    } catch {
      setMockMode(true);
      return { data: await mockApi.updateFollowup(id, data) };
    }
  },

  async getDashboardStats() {
    if (useMockMode) return { data: await mockApi.getDashboardStats() };
    try {
      return await realApi.get('/dashboard/stats');
    } catch {
      setMockMode(true);
      return { data: await mockApi.getDashboardStats() };
    }
  },

  async generateAI(payload) {
    if (useMockMode) {
      return {
        data: await mockApi.generateAI(payload.task_type, payload.prompt, payload.context_data),
      };
    }
    try {
      return await realApi.post('/ai/generate', payload);
    } catch {
      setMockMode(true);
      return {
        data: await mockApi.generateAI(payload.task_type, payload.prompt, payload.context_data),
      };
    }
  },
};

export default api;
