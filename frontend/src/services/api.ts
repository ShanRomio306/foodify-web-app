import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BACKEND_URL, // your backend URL
  withCredentials: false
});

/* Attach JWT token automatically */

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

}, (error) => {
  return Promise.reject(error);
});

export default api;
