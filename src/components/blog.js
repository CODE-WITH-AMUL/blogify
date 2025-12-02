import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import axios from 'axios';
import { 
  ArrowRight, 
  Search, 
  Calendar, 
  User, 
  Code,
  PenTool,
  Smartphone,
  Terminal,
  Cpu,
  Brackets,
  Anchor,
  Layout,
  Globe,
  Aperture,
  Heart,
  Server,
  Disc,
  Clock,
  ChevronRight,
  TrendingUp,
  Star,
  MessageCircle,
  Share2,
  Bookmark,
  Tag,
  Zap,
  BookOpen,
  Database,
  Loader
} from 'lucide-react';

// API base URL - adjust according to your Django server
const API_BASE_URL = 'http://localhost:8000';

function GetStarted() {
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState({
    featured: true,
    recent: true,
    categories: true,
    tags: true
  });
  const [error, setError] = useState(null);
  
  // State for data from API
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading({
        featured: true,
        recent: true,
        categories: true,
        tags: true
      });
      setError(null);

      // Fetch featured posts (blogs with featured_article=true)
      const featuredResponse = await axios.get(`${API_BASE_URL}/api/blogs/?featured_article=true`);
      setFeaturedPosts(featuredResponse.data);

      // Fetch recent posts (all blogs ordered by created_at)
      const recentResponse = await axios.get(`${API_BASE_URL}/api/blogs/`);
      setRecentPosts(recentResponse.data.slice(0, 7)); // Show first 7 recent posts

      // Fetch categories
      const categoriesResponse = await axios.get(`${API_BASE_URL}/api/categories/`);
      const categoriesData = categoriesResponse.data.map(cat => ({
        name: cat.Category,
        icon: getCategoryIcon(cat.Category),
        count: cat.blog_posts_category?.length || 0
      }));
      setCategories(categoriesData);

      // Fetch tags
      const tagsResponse = await axios.get(`${API_BASE_URL}/api/tags/`);
      const tagsData = tagsResponse.data.map(tag => tag.Tag);
      setAllTags(tagsData);
      
      // Get popular tags (top 10)
      const tagCounts = {};
      recentResponse.data.forEach(post => {
        post.tag?.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      const sortedTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag]) => tag);
      setPopularTags(sortedTags);

      // Generate trending posts based on some criteria (you can modify this)
      const trendingData = recentResponse.data.slice(0, 3).map((post, index) => ({
        id: post.id,
        title: post.title,
        rank: index + 1,
        views: `${Math.floor(Math.random() * 20 + 5)}.${Math.floor(Math.random() * 9)}K` // Simulated views
      }));
      setTrendingPosts(trendingData);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
      
      // Fallback to mock data if API fails
      setFeaturedPosts(getMockFeaturedPosts());
      setRecentPosts(getMockRecentPosts());
      setCategories(getMockCategories());
      setPopularTags(getMockPopularTags());
      setTrendingPosts(getMockTrendingPosts());
    } finally {
      setLoading({
        featured: false,
        recent: false,
        categories: false,
        tags: false
      });
    }
  };

  // Helper function to get icon for category
  const getCategoryIcon = (category) => {
    const iconMap = {
      'TECHNOLOGY': <Cpu size={20} />,
      'CODING': <Code size={20} />,
      'PROGRAMMING': <Terminal size={20} />,
      'JAVASCRIPT': <Code size={20} />,
      'PYTHON': <Terminal size={20} />,
      'REACT': <Zap size={20} />,
      'CSS': <PenTool size={20} />,
      'HTML': <Layout size={20} />,
      'DJANGO': <Globe size={20} />,
      'NODEJS': <Database size={20} />,
      'SQL': <Database size={20} />,
      'MONGODB': <Server size={20} />,
      'POSTGRESQL': <Disc size={20} />,
      'JAVA': <Cpu size={20} />,
      'CPLUSPLUS': <Brackets size={20} />,
      'GO': <Anchor size={20} />,
      'CSHARP': <Code size={20} />,
      'ANGULAR': <Aperture size={20} />,
      'VUE': <Heart size={20} />,
      'TYPESCRIPT': <BookOpen size={20} />,
      'PHP': <Globe size={20} />,
      'MOBILE': <Smartphone size={20} />
    };
    
    return iconMap[category] || <BookOpen size={20} />;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Log search to Django backend
      await axios.post(`${API_BASE_URL}/api/search/`, {
        query: searchQuery
      });

      // Fetch search results from blogs
      const searchResponse = await axios.get(
        `${API_BASE_URL}/api/blogs/?search=${encodeURIComponent(searchQuery)}`
      );
      
      // You can update the posts list with search results
      if (searchResponse.data.length > 0) {
        setRecentPosts(searchResponse.data);
        alert(`Found ${searchResponse.data.length} results for "${searchQuery}"`);
      } else {
        alert(`No results found for "${searchQuery}"`);
      }
    } catch (err) {
      console.error('Search error:', err);
      alert('Search failed. Please try again.');
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed successfully with: ${email}`);
      setEmail('');
    }
  };

  const handleFilter = async (category) => {
    try {
      if (category === 'All') {
        const response = await axios.get(`${API_BASE_URL}/api/blogs/`);
        setRecentPosts(response.data.slice(0, 7));
      } else {
        // You might want to create a filtered endpoint or filter client-side
        const response = await axios.get(`${API_BASE_URL}/api/blogs/`);
        const filtered = response.data.filter(post => 
          post.category?.Category === category
        );
        setRecentPosts(filtered.slice(0, 7));
      }
    } catch (err) {
      console.error('Filter error:', err);
    }
  };

  // Mock data fallback functions
  const getMockFeaturedPosts = () => [
    {
      id: 1,
      title: "React 18 Concurrent Features Explained",
      content: "Deep dive into the latest React 18 features including concurrent rendering, automatic batching, and transitions.",
      author: "Sarah Chen",
      created_at: "2023-12-15",
      readTime: "8 min read",
      category: { Category: "CODING" },
      likes: 245,
      comments: 42,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      tag: ["REACT", "JAVASCRIPT", "WEB DEV"]
    },
    // Add more mock posts as needed
  ];

  const getMockRecentPosts = () => [
    {
      id: 4,
      title: "Mastering State Management with Zustand",
      content: "A comprehensive guide to state management using Zustand for React applications.",
      author: "David Kim",
      created_at: "2023-12-08",
      readTime: "7 min read",
      category: { Category: "REACT" }
    },
    // Add more mock posts as needed
  ];

  const getMockCategories = () => [
    { name: "REACT", icon: <Zap size={20} />, count: 128 },
    { name: "JAVASCRIPT", icon: <Code size={20} />, count: 156 },
    { name: "PYTHON", icon: <Terminal size={20} />, count: 95 },
    { name: "DJANGO", icon: <Globe size={20} />, count: 55 },
    { name: "CSS", icon: <PenTool size={20} />, count: 103 },
    { name: "NODEJS", icon: <Database size={20} />, count: 72 },
  ];

  const getMockPopularTags = () => [
    "REACT", "JAVASCRIPT", "TYPESCRIPT", "CSS", "NODEJS", 
    "PYTHON", "DJANGO", "HTML", "SQL", "MONGODB"
  ];

  const getMockTrendingPosts = () => [
    {
      id: 8,
      title: "The Future of Web Development: AI Integration",
      rank: 1,
      views: "15.2K"
    },
    {
      id: 9,
      title: "Building Microfrontends with Module Federation",
      rank: 2,
      views: "12.8K"
    },
    {
      id: 10,
      title: "Web Performance Optimization Guide 2024",
      rank: 3,
      views: "10.5K"
    }
  ];

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate read time helper
  const calculateReadTime = (content) => {
    if (!content) return '5 min read';
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return (
    <div className="blog-landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-main">Code With Amul</span>
          </div>
          
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search articles, tutorials, guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <ul className="nav-menu">
            {['Home', 'Blog', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`}>{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <p>{error} Using mock data for demonstration.</p>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge">TRENDING</span>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <img
                src="/amul.png"
                alt="Code With Amul logo"
                className="hero-main-image"
              />
            </div>
          </div>
          
          <h1 className="hero-title">
            Master Programming: Tips, Projects & Best Practices
          </h1>

          <p className="hero-description">
            Learn coding with real-world projects and tutorials. Explore React, Python, Django, and modern web development techniques to level up your skills.
          </p>
          
          <div className="hero-meta">
            <div className="author">
              <User size={16} />
              <span>Written by Code With Amul</span>
            </div>
            <div className="read-time">
              <Clock size={16} />
              <span>15 min read</span>
            </div>
          </div>
          
          <div className="hero-tags">
            {allTags.slice(0, 15).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          
          <a href="/blog">
            <button className="btn-primary btn-hero">
              Read All Articles <ArrowRight size={20} />
            </button>
          </a>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="featured-posts">
        <div className="section-header">
          <h2>
            <Star size={24} />
            Featured Articles
          </h2>
          <a href="#" className="view-all">
            View All <ChevronRight size={16} />
          </a>
        </div>
        
        {loading.featured ? (
          <div className="loading-container">
            <Loader size={32} className="spinner" />
            <p>Loading featured articles...</p>
          </div>
        ) : (
          <div className="featured-grid">
            {featuredPosts.slice(0, 3).map((post) => (
              <article key={post.id} className="post-card featured">
                <div className="post-image" style={{
                  background: `linear-gradient(135deg, #3b82f6, #8b5cf6)`,
                  backgroundImage: post.image ? `url(${post.image})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  {post.category && (
                    <div className="category-badge">{post.category.Category}</div>
                  )}
                  <div className="image-overlay">
                    <div className="post-stats">
                      <span><Heart size={16} /> {post.likes || 0}</span>
                      <span><MessageCircle size={16} /> {post.comments || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="post-content">
                  <div className="post-meta">
                    <span className="author">{post.author}</span>
                    <span className="date">{formatDate(post.created_at)}</span>
                    <span className="read-time">{calculateReadTime(post.content)}</span>
                  </div>
                  
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">
                    {post.content ? post.content.substring(0, 150) + '...' : 'No content available'}
                  </p>
                  
                  <div className="post-tags">
                    {post.tag && post.tag.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag"><Tag size={12} /> {tag}</span>
                    ))}
                  </div>
                  
                  <div className="post-actions">
                    <a href={`/blog/${post.slug}`} className="btn-read">
                      Read More <ChevronRight size={16} />
                    </a>
                    <div className="action-icons">
                      <button><Bookmark size={18} /></button>
                      <button><Share2 size={18} /></button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          {/* Recent Posts */}
          <section className="recent-posts">
            <div className="section-header">
              <h2>Latest Articles</h2>
              <div className="filter-options">
                <button className="filter-btn active" onClick={() => handleFilter('All')}>All</button>
                {categories.slice(0, 4).map(cat => (
                  <button 
                    key={cat.name} 
                    className="filter-btn"
                    onClick={() => handleFilter(cat.name)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            
            {loading.recent ? (
              <div className="loading-container">
                <Loader size={32} className="spinner" />
                <p>Loading latest articles...</p>
              </div>
            ) : (
              <>
                <div className="posts-list">
                  {recentPosts.map((post) => (
                    <article key={post.id} className="post-card recent">
                      <div className="post-content">
                        <div className="post-header">
                          {post.category && (
                            <span className="post-category">{post.category.Category}</span>
                          )}
                          <span className="post-date">{formatDate(post.created_at)}</span>
                        </div>
                        
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-excerpt">
                          {post.content ? post.content.substring(0, 200) + '...' : 'No content available'}
                        </p>
                        
                        <div className="post-footer">
                          <div className="author-info">
                            <User size={14} />
                            <span>{post.author}</span>
                          </div>
                          <div className="post-meta">
                            <Clock size={14} />
                            <span>{calculateReadTime(post.content)}</span>
                          </div>
                          <a href={`/blog/${post.slug}`} className="btn-read-sm">
                            Read <ChevronRight size={14} />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                
                <div className="load-more">
                  <button className="btn-load" onClick={fetchAllData}>
                    Load More Articles
                  </button>
                </div>
              </>
            )}
          </section>

          {/* Sidebar */}
          <aside className="sidebar">
            {/* Categories */}
            <div className="sidebar-widget">
              <h3>
                <BookOpen size={20} />
                Categories
              </h3>
              {loading.categories ? (
                <div className="loading-small">
                  <Loader size={16} className="spinner" />
                  <span>Loading categories...</span>
                </div>
              ) : (
                <div className="categories-list">
                  {categories.map((category) => (
                    <a key={category.name} href={`/category/${category.name.toLowerCase()}`} className="category-item">
                      <div className="category-info">
                        {category.icon}
                        <span>{category.name}</span>
                      </div>
                      <span className="category-count">{category.count}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Trending Posts */}
            <div className="sidebar-widget">
              <h3>
                <TrendingUp size={20} />
                Trending Now
              </h3>
              <div className="trending-list">
                {trendingPosts.map((post) => (
                  <a key={post.id} href={`/blog/${post.id}`} className="trending-item">
                    <div className="trending-rank">{post.rank}</div>
                    <div className="trending-content">
                      <h4>{post.title}</h4>
                      <span className="trending-views">{post.views} views</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="sidebar-widget">
              <h3>
                <Tag size={20} />
                Popular Tags
              </h3>
              {loading.tags ? (
                <div className="loading-small">
                  <Loader size={16} className="spinner" />
                  <span>Loading tags...</span>
                </div>
              ) : (
                <div className="tags-cloud">
                  {popularTags.map((tag) => (
                    <a key={tag} href={`/tag/${tag.toLowerCase()}`} className="tag-item">
                      #{tag}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Newsletter Widget */}
            <div className="sidebar-widget newsletter-widget">
              <h3>Subscribe to Newsletter</h3>
              <p>Get the latest articles directly in your inbox</p>
              <form onSubmit={handleSubscribe} className="subscribe-form">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-subscribe">
                  Subscribe
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>

      {/* Newsletter CTA */}
      <section className="newsletter-cta">
        <div className="cta-content">
          <div className="cta-icon">
            <MessageCircle size={48} />
          </div>
          <h2>Never Miss a Post</h2>
          <p>Join 15,000+ developers who receive our weekly newsletter with the latest articles, tutorials, and coding tips.</p>
          <form onSubmit={handleSubscribe} className="cta-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-cta">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-main">Code With Amul</span>
            </div>
            <p>A community-driven blog for modern web developers.</p>
            <div className="social-links">
              {['Twitter', 'GitHub', 'Discord', 'LinkedIn'].map((platform) => (
                <a key={platform} href="#" className="social-link">
                  {platform}
                </a>
              ))}
            </div>
          </div>
          
          <div className="footer-links">
            <div className="link-column">
              <h4>Content</h4>
              {['Blog', 'coding', 'Programming', 'Newsletter'].map((link) => (
                <a key={link} href="#">{link}</a>
              ))}
            </div>
            <div className="link-column">
              <h4>Topics</h4>
              {categories.slice(0, 5).map((cat) => (
                <a key={cat.name} href={`/category/${cat.name.toLowerCase()}`}>{cat.name}</a>
              ))}
            </div>
            <div className="link-column">
              <h4>Company</h4>
              {['About', 'Team', 'Contact', 'Write for Us'].map((link) => (
                <a key={link} href="#">{link}</a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 Code With Amul All rights reserved</p>
          <div className="footer-meta">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Add these new styles */
        .error-banner {
          background: #fee;
          color: #c33;
          padding: 1rem;
          text-align: center;
          border-bottom: 1px solid #fcc;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: #666;
        }

        .loading-small {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          padding: 1rem;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hero-main-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          object-fit: cover;
        }

        /* Rest of your existing styles remain the same */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .blog-landing-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: #ffffff;
          color: #1a1a1a;
          line-height: 1.6;
        }

        /* Navigation */
        .navbar {
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          z-index: 1000;
          border-bottom: 1px solid #f0f0f0;
          padding: 1rem 0;
        }

        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .logo {
          display: flex;
          align-items: baseline;
          gap: 4px;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .logo-main {
          color: #1a1a1a;
        }

        .logo-dot {
          color: #3b82f6;
          font-size: 2rem;
        }

        .search-container {
          flex: 1;
          max-width: 400px;
        }

        .search-form {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-form svg {
          position: absolute;
          left: 1rem;
          color: #666;
        }

        .search-form input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .search-form input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .nav-menu {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .nav-menu li a {
          color: #4b5563;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s;
        }

        .nav-menu li a:hover {
          color: #3b82f6;
        }

        .nav-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .btn-login {
          padding: 0.5rem 1.5rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          color: #4b5563;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-login:hover {
          background: #f9fafb;
        }

        .btn-primary {
          padding: 0.5rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        /* Hero Section */
        .hero {
          max-width: 1280px;
          margin: 3rem auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .badge {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge-text {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          color: #1f2937;
        }

        .hero-description {
          font-size: 1.125rem;
          color: #4b5563;
          margin-bottom: 2rem;
          line-height: 1.7;
        }

        .hero-meta {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .hero-meta > div {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .hero-tags {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .tag {
          background: #f3f4f6;
          color: #4b5563;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .btn-hero {
          padding: 1rem 2rem;
          font-size: 1rem;
        }

        .hero-image {
          position: relative;
        }

        .image-placeholder {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .code-preview pre {
          color: #f8fafc;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          overflow-x: auto;
        }

        /* Featured Posts */
        .featured-posts {
          max-width: 1280px;
          margin: 4rem auto;
          padding: 0 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .section-header h2 {
          font-size: 1.875rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .view-all {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .post-card.featured {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .post-card.featured:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.1);
        }

        .post-image {
          height: 200px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          position: relative;
        }

        .category-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: white;
          color: #3b82f6;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
          padding: 1rem;
        }

        .post-stats {
          display: flex;
          gap: 1rem;
          color: white;
          font-size: 0.875rem;
        }

        .post-stats span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .post-content {
          padding: 1.5rem;
        }

        .post-meta {
          display: flex;
          gap: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .post-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }

        .post-excerpt {
          color: #4b5563;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .post-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .post-tags .tag {
          background: #f3f4f6;
          color: #4b5563;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .post-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-read {
          color: #3b82f6;
          background: none;
          border: none;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          text-decoration: none;
        }

        .action-icons {
          display: flex;
          gap: 0.75rem;
        }

        .action-icons button {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0.25rem;
        }

        .action-icons button:hover {
          color: #3b82f6;
        }

        /* Main Content */
        .main-content {
          max-width: 1280px;
          margin: 4rem auto;
          padding: 0 2rem;
        }

        .content-wrapper {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        /* Recent Posts */
        .recent-posts .section-header {
          margin-bottom: 2rem;
        }

        .filter-options {
          display: flex;
          gap: 0.5rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border: none;
          border-radius: 20px;
          color: #4b5563;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn.active {
          background: #3b82f6;
          color: white;
        }

        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .post-card.recent {
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .post-card.recent:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .post-category {
          color: #3b82f6;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .post-date {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .post-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        .post-excerpt {
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .post-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .author-info, .post-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .btn-read-sm {
          color: #3b82f6;
          background: none;
          border: none;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          text-decoration: none;
        }

        .load-more {
          text-align: center;
          margin-top: 3rem;
        }

        .btn-load {
          padding: 0.75rem 2rem;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          color: #4b5563;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-load:hover {
          background: #e5e7eb;
        }

        /* Sidebar */
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sidebar-widget {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
        }

        .sidebar-widget h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #1f2937;
          font-size: 1.125rem;
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          color: #4b5563;
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .category-item:hover {
          background: #f9fafb;
          color: #3b82f6;
        }

        .category-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .category-count {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .trending-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .trending-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          text-decoration: none;
          color: inherit;
          padding: 0.75rem;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .trending-item:hover {
          background: #f9fafb;
        }

        .trending-rank {
          background: #3b82f6;
          color: white;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .trending-content h4 {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #1f2937;
        }

        .trending-views {
          color: #6b7280;
          font-size: 0.75rem;
        }

        .tags-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag-item {
          background: #f3f4f6;
          color: #4b5563;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .tag-item:hover {
          background: #3b82f6;
          color: white;
        }

        .newsletter-widget {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
        }

        .newsletter-widget h3 {
          color: white;
        }

        .newsletter-widget p {
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .subscribe-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .subscribe-form input {
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .subscribe-form input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
        }

        .btn-subscribe {
          padding: 0.75rem 1rem;
          background: white;
          color: #3b82f6;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-subscribe:hover {
          background: #f3f4f6;
          transform: translateY(-1px);
        }

        /* Newsletter CTA */
        .newsletter-cta {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: white;
          padding: 4rem 2rem;
          margin: 4rem 0;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }

        .cta-icon {
          margin: 0 auto 1.5rem;
          color: #3b82f6;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .cta-content p {
          color: #cbd5e1;
          font-size: 1.125rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .cta-form {
          display: flex;
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .cta-form input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid #475569;
          background: transparent;
          border-radius: 6px;
          color: white;
          font-size: 1rem;
        }

        .cta-form input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .btn-cta {
          padding: 0.75rem 2rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cta:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        /* Footer */
        .footer {
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          padding: 4rem 2rem 2rem;
        }

        .footer-content {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
          margin-bottom: 3rem;
        }

        .footer-brand p {
          color: #6b7280;
          margin: 1rem 0;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          color: #4b5563;
          text-decoration: none;
          font-size: 0.875rem;
        }

        .social-link:hover {
          color: #3b82f6;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .link-column h4 {
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .link-column a {
          display: block;
          color: #6b7280;
          text-decoration: none;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }

        .link-column a:hover {
          color: #3b82f6;
        }

        .footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .footer-meta {
          display: flex;
          gap: 1.5rem;
        }

        .footer-meta a {
          color: #6b7280;
          text-decoration: none;
        }

        .footer-meta a:hover {
          color: #3b82f6;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 3rem;
          }

          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .content-wrapper {
            grid-template-columns: 1fr;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        @media (max-width: 768px) {
          .nav-container {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .search-container {
            order: 3;
            width: 100%;
            max-width: 100%;
          }

          .nav-menu {
            display: none;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .featured-grid {
            grid-template-columns: 1fr;
          }

          .cta-form {
            flex-direction: column;
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-meta {
            flex-direction: column;
            gap: 0.75rem;
          }

          .filter-options {
            flex-wrap: wrap;
          }

          .footer-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default GetStarted;