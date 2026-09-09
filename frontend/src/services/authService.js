import axios from 'axios';

const AUTH_API_URL = 'http://localhost:8081/api/auth';
const WORKER_API_URL = 'http://localhost:8081/api/workers';
const HR_API_URL = 'http://localhost:8081/api/hr';

// Authentication Service
export const authService = {
  register: async (userData) => {
    const response = await axios.post(`${AUTH_API_URL}/register`, userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await axios.post(`${AUTH_API_URL}/login`, { email, password });
    return response.data;
  },

  verify: async (userId) => {
    const response = await axios.get(`${AUTH_API_URL}/verify/${userId}`);
    return response.data;
  }
};

// Worker Profile Service
export const workerService = {
  getProfile: async (userId) => {
    const response = await axios.get(`${WORKER_API_URL}/profile/${userId}`);
    return response.data;
  },

  updateProfile: async (userId, profileData) => {
    const response = await axios.put(`${WORKER_API_URL}/profile/${userId}`, profileData);
    return response.data;
  },

  updateAvailability: async (userId, isAvailable) => {
    const response = await axios.put(`${WORKER_API_URL}/${userId}/availability`, { isAvailable });
    return response.data;
  },

  getAvailableByLocation: async (location) => {
    const response = await axios.get(`${WORKER_API_URL}/available/location/${location}`);
    return response.data;
  },

  getAvailableByProfession: async (profession) => {
    const response = await axios.get(`${WORKER_API_URL}/available/profession/${profession}`);
    return response.data;
  },

  getAllWorkers: async () => {
    const response = await axios.get(`${WORKER_API_URL}/all`);
    return response.data;
  }
};

// HR Profile Service
export const hrService = {
  getProfile: async (userId) => {
    const response = await axios.get(`${HR_API_URL}/profile/${userId}`);
    return response.data;
  },

  updateProfile: async (userId, profileData) => {
    const response = await axios.put(`${HR_API_URL}/profile/${userId}`, profileData);
    return response.data;
  }
};
