function apiMiddleware() {
  const API_BASE = process.env.REACT_APP_API_BASE;

  const BLOG_LIST_API = `${API_BASE}${process.env.REACT_APP_API_BLOG_LIST}`;
  const BLOG_DETAIL_API = (slug) => `${API_BASE}${process.env.REACT_APP_API_BLOG_DETAIL.replace(':slug', slug)}`;

  const CATEGORY_LIST_API = `${API_BASE}${process.env.REACT_APP_API_CATEGORY_LIST}`;
  const CATEGORY_DETAIL_API = (category) => `${API_BASE}${process.env.REACT_APP_API_CATEGORY_DETAIL.replace(':category', category)}`;

  const TAG_LIST_API = `${API_BASE}${process.env.REACT_APP_API_TAG_LIST}`;
  const TAG_DETAIL_API = (tag) => `${API_BASE}${process.env.REACT_APP_API_TAG_DETAIL.replace(':tag', tag)}`;

  const SEARCH_API = `${API_BASE}${process.env.REACT_APP_API_SEARCH}`;

  // Return all API endpoints
  return {
    BLOG_LIST_API,
    BLOG_DETAIL_API,
    CATEGORY_LIST_API,
    CATEGORY_DETAIL_API,
    TAG_LIST_API,
    TAG_DETAIL_API,
    SEARCH_API
  };
}

// Export middleware
export default apiMiddleware;
