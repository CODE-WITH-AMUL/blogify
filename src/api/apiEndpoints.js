// apiEndpoints.js - Centralized endpoint configuration

const API_ENDPOINTS = {
  // Blog endpoints
  BLOG: {
    LIST: '/api/posts/',
    DETAIL: (slug) => `/api/posts/${slug}/`,
    SEARCH: '/api/posts/?search=',
    BY_CATEGORY: (category) => `/api/posts/?category=${category}`,
    BY_TAG: (tag) => `/api/posts/?tag=${tag}`,
  },
  
  // Category endpoints
  CATEGORY: {
    LIST: '/api/categories/',
    DETAIL: (slug) => `/api/categories/${slug}/`,
  },
  
  // Tag endpoints
  TAG: {
    LIST: '/api/tags/',
    DETAIL: (slug) => `/api/tags/${slug}/`,
  },
  
  // Search endpoint (if separate)
  SEARCH: '/api/search/',
  
  // Authentication endpoints (if you add later)
  AUTH: {
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/auth/register/',
    LOGOUT: '/api/auth/logout/',
    PROFILE: '/api/auth/profile/',
  },
  
  // Comment endpoints (if you have)
  COMMENT: {
    CREATE: (postId) => `/api/posts/${postId}/comments/`,
    LIST: (postId) => `/api/posts/${postId}/comments/`,
  },
};

export default API_ENDPOINTS;