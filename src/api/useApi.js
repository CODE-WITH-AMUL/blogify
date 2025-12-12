// useApi.js - Custom React hook for API calls
import { useState, useEffect } from 'react';
import api, { testBackendConnection } from './api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);

  // Test backend connection on mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    setLoading(true);
    try {
      const result = await testBackendConnection();
      setBackendStatus(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Generic API call wrapper
  const callApi = async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction(...args);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    backendStatus,
    checkBackendConnection,
    callApi,
    api, // Direct access to axios instance
  };
};

// Example hook for blogs
export const useBlogs = () => {
  const { callApi, loading, error } = useApi();
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async (params = {}) => {
    try {
      const data = await callApi(api.get, '/api/blogs/', { params });
      setBlogs(data.results || data);
      return data;
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    }
  };

  return {
    blogs,
    fetchBlogs,
    loading,
    error,
  };
};