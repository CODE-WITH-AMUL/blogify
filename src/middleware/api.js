import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Log requests for debugging
api.interceptors.request.use(
  config => {
    console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.url}`, config.params || '');
    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Log responses for debugging
api.interceptors.response.use(
  response => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`, response.data?.length || 0, 'items');
    return response;
  },
  error => {
    console.error('❌ Response Error:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📊 Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Helper function to check if response is array
const ensureArray = (data) => {
  return Array.isArray(data) ? data : [];
};

// 1. Fetch ALL posts (Django endpoint: /api/blogs/)
export const fetchAllPosts = async () => {
  try {
    console.log('🔄 Fetching all posts from:', `${API_BASE_URL}/api/blogs/`);
    const response = await api.get('/api/blogs/');
    const data = response.data.results ? response.data.results : ensureArray(response.data);
    console.log(`📄 Total posts received: ${data.length}`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching all posts:', error.message);
    return getMockPosts();
  }
};

// 2. Fetch featured posts (get 3 most recent posts)
export const fetchFeaturedPosts = async () => {
  try {
    console.log('🔄 Fetching featured posts...');
    const allPosts = await fetchAllPosts();
    
    // Sort by date (most recent first) and take first 3
    const featured = [...allPosts]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);
    
    console.log(`⭐ Featured posts: ${featured.length}`);
    return featured;
  } catch (error) {
    console.error('❌ Error fetching featured posts:', error.message);
    return getMockFeaturedPosts();
  }
};

// 3. Fetch recent posts (get 7 most recent)
export const fetchRecentPosts = async () => {
  try {
    console.log('🔄 Fetching recent posts...');
    const allPosts = await fetchAllPosts();
    
    // Sort by date (most recent first) and take first 7
    const recent = [...allPosts]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 7);
    
    console.log(`📰 Recent posts: ${recent.length}`);
    return recent;
  } catch (error) {
    console.error('❌ Error fetching recent posts:', error.message);
    return getMockPosts().slice(0, 7);
  }
};

// 4. Fetch categories
export const fetchCategories = async () => {
  try {
    console.log('🔄 Fetching categories from:', `${API_BASE_URL}/api/categories/`);
    const response = await api.get('/api/categories/');
    const data = response.data.results ? response.data.results : ensureArray(response.data);
    console.log(`🏷️ Categories received: ${data.length}`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    return getMockCategories();
  }
};

// 5. Fetch tags
export const fetchTags = async () => {
  try {
    console.log('🔄 Fetching tags from:', `${API_BASE_URL}/api/tags/`);
    const response = await api.get('/api/tags/');
    const data = response.data.results ? response.data.results : ensureArray(response.data);
    console.log(`🏷️ Tags received: ${data.length}`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching tags:', error.message);
    return getMockTags();
  }
};

// 6. Search blogs
export const searchBlogs = async (query) => {
  try {
    console.log(`🔍 Searching for: "${query}"`);
    
    try {
      const response = await api.get('/api/blogs/', {
        params: { search: query }
      });
      const data = response.data.results ? response.data.results : ensureArray(response.data);
      console.log(`🔍 Search results from API: ${data.length}`);
      return data;
    } catch (searchError) {
      console.log('Search endpoint failed, filtering locally...');
      
      const allPosts = await fetchAllPosts();
      const filtered = allPosts.filter(post => {
        const searchText = query.toLowerCase();
        return (
          (post.title && post.title.toLowerCase().includes(searchText)) ||
          (post.content && post.content.toLowerCase().includes(searchText)) ||
          (post.author && post.author.toLowerCase().includes(searchText)) ||
          (post.category?.Category && post.category.Category.toLowerCase().includes(searchText)) ||
          (Array.isArray(post.tag) && post.tag.some(tag => 
            tag && tag.toLowerCase().includes(searchText)
          ))
        );
      });
      
      console.log(`🔍 Search results (local filter): ${filtered.length}`);
      return filtered;
    }
  } catch (error) {
    console.error('❌ Search error:', error.message);
    return [];
  }
};

// 7. Filter by category
export const filterByCategory = async (category) => {
  try {
    console.log(`🏷️ Filtering by category: "${category}"`);
    
    if (category === 'All') {
      const allPosts = await fetchAllPosts();
      return allPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    
    try {
      const response = await api.get('/api/blogs/', {
        params: { category__Category__icontains: category }
      });
      
      const data = response.data.results ? response.data.results : ensureArray(response.data);
      console.log(`🏷️ Category posts from API: ${data.length}`);
      return data;
    } catch (endpointError) {
      console.log('Category filter failed, filtering locally...');
    }
    
    const allPosts = await fetchAllPosts();
    const filtered = allPosts.filter(post => 
      post.category?.Category?.toLowerCase() === category.toLowerCase() ||
      post.category?.toLowerCase() === category.toLowerCase()
    );
    
    console.log(`🏷️ Category posts (local filter): ${filtered.length}`);
    return filtered;
  } catch (error) {
    console.error('❌ Filter error:', error.message);
    return [];
  }
};

// Mock data for fallback
const getMockPosts = () => [
  {
    id: 1,
    title: "Welcome to Code With Amul!",
    content: "This is your first blog post. Start writing amazing content!",
    author: "Admin",
    created_at: new Date().toISOString().split('T')[0],
    slug: "welcome-post",
    category: { Category: "GENERAL" },
    tag: ["WELCOME", "INTRODUCTION"]
  },
  {
    id: 2,
    title: "How to Add Your First Blog Post",
    content: "Learn how to use the admin panel to create and publish your blog posts.",
    author: "Admin",
    created_at: new Date().toISOString().split('T')[0],
    slug: "add-first-post",
    category: { Category: "TUTORIAL" },
    tag: ["ADMIN", "TUTORIAL", "BEGINNER"]
  }
];

const getMockFeaturedPosts = () => getMockPosts().slice(0, 1);

const getMockCategories = () => [
  { id: 1, Category: "GENERAL", blog_posts_category: getMockPosts() },
  { id: 2, Category: "TUTORIAL", blog_posts_category: [] }
];

const getMockTags = () => [
  { id: 1, Tag: "WELCOME" },
  { id: 2, Tag: "INTRODUCTION" },
  { id: 3, Tag: "TUTORIAL" },
  { id: 4, Tag: "ADMIN" }
];

// Test connection on module load
export const testConnection = async () => {
  try {
    console.log('🔗 Testing connection to:', API_BASE_URL);
    const response = await api.get('/api/blogs/');
    console.log('✅ Connection successful! Posts found:', response.data?.length || 0);
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('⚠️ Using mock data for demonstration');
    return false;
  }
};

// Optional: Call test on load
if (typeof window !== 'undefined') {
  testConnection();
}