import React, { useState, useEffect } from 'react';
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
  Loader,
  Mail,
  ExternalLink,
  Eye
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
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">
                <Code size={24} className="logo-icon" />
                <div>
                  <h1 className="logo-title">Code With Amul</h1>
                  <p className="logo-subtitle">Programming Blog & Tutorials</p>
                </div>
              </div>
            </div>
            
            <nav className="main-nav">
              <ul className="nav-links">
                {['Home', 'Blog', 'Tutorials', 'Projects', 'About', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="nav-link">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="header-actions">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-group">
                  <Search size={20} className="search-icon" />
                  <input
                    type="search"
                    placeholder="Search tutorials, articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search articles"
                  />
                </div>
              </form>
              <a href="/subscribe" className="btn btn-outline">
                Subscribe
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="alert alert-warning" role="alert">
          <p>{error} Using sample data for demonstration.</p>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section" aria-label="Featured content">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="category-badge">
                <span className="badge">TRENDING NOW</span>
              </div>
              <h1 className="hero-title">
                Master Modern Programming with Practical Examples
              </h1>
              <p className="hero-description">
                Expert tutorials on React, Python, Django, JavaScript, and full-stack development. 
                Learn through real-world projects and best practices.
              </p>
              
              <div className="hero-meta">
                <div className="meta-item">
                  <User size={18} aria-hidden="true" />
                  <span>By Code With Amul</span>
                </div>
                <div className="meta-item">
                  <Calendar size={18} aria-hidden="true" />
                  <span>Updated Weekly</span>
                </div>
                <div className="meta-item">
                  <Clock size={18} aria-hidden="true" />
                  <span>5-15 min reads</span>
                </div>
              </div>
              
              <div className="hero-cta">
                <a href="/blog" className="btn btn-primary">
                  Start Learning <ArrowRight size={20} aria-hidden="true" />
                </a>
                <a href="#featured" className="btn btn-secondary">
                  View Featured
                </a>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="code-preview">
                <div className="code-header">
                  <div className="code-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <span className="code-title">example.js</span>
                </div>
                <pre className="code-snippet">
                  <code>{`// Modern React Pattern
const useCustomHook = () => {
  const [state, setState] = useState();
  useEffect(() => {
    // Clean, readable code
  }, []);
  return state;
};`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section id="featured" className="featured-section" aria-label="Featured articles">
        <div className="container">
          <div className="section-header">
            <div className="section-title">
              <Star size={24} aria-hidden="true" />
              <h2>Featured Articles</h2>
            </div>
            <p className="section-subtitle">Handpicked quality content for deep learning</p>
          </div>
          
          {loading.featured ? (
            <div className="loading-state" aria-live="polite">
              <Loader size={32} className="spinner" aria-hidden="true" />
              <p>Loading featured articles...</p>
            </div>
          ) : (
            <div className="featured-grid">
              {featuredPosts.slice(0, 3).map((post, index) => (
                <article key={post.id} className="featured-card" itemScope itemType="http://schema.org/Article">
                  <div className="featured-card-inner">
                    <div className="card-image">
                      <div className="image-container">
                        <div className="category-tag">
                          {post.category?.Category || 'Programming'}
                        </div>
                        <div className="card-stats">
                          <span className="stat">
                            <Eye size={16} aria-hidden="true" />
                            {post.views || '1.2K'}
                          </span>
                          <span className="stat">
                            <Heart size={16} aria-hidden="true" />
                            {post.likes || 245}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-content">
                      <div className="card-meta">
                        <time dateTime={post.created_at}>
                          {formatDate(post.created_at)}
                        </time>
                        <span className="read-time">
                          {calculateReadTime(post.content)}
                        </span>
                      </div>
                      
                      <h3 className="card-title" itemProp="headline">
                        {post.title}
                      </h3>
                      
                      <p className="card-excerpt" itemProp="description">
                        {post.content ? post.content.substring(0, 120) + '...' : 'Expert programming insights...'}
                      </p>
                      
                      <div className="card-tags">
                        {post.tag && post.tag.slice(0, 2).map((tag) => (
                          <span key={tag} className="tag">
                            <Tag size={12} aria-hidden="true" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="card-actions">
                        <a 
                          href={`/blog/${post.slug}`} 
                          className="read-more"
                          aria-label={`Read more about ${post.title}`}
                        >
                          Read Article <ExternalLink size={16} aria-hidden="true" />
                        </a>
                        <div className="action-buttons">
                          <button className="icon-btn" aria-label="Bookmark article">
                            <Bookmark size={18} aria-hidden="true" />
                          </button>
                          <button className="icon-btn" aria-label="Share article">
                            <Share2 size={18} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content" role="main">
        <div className="container">
          <div className="content-layout">
            {/* Recent Posts */}
            <section className="recent-section" aria-label="Recent articles">
              <div className="section-header">
                <div>
                  <h2>Latest Tutorials</h2>
                  <p className="section-subtitle">Fresh content updated regularly</p>
                </div>
                <div className="filter-tabs">
                  <button 
                    className="filter-tab active"
                    onClick={() => handleFilter('All')}
                  >
                    All Topics
                  </button>
                  {categories.slice(0, 4).map(cat => (
                    <button 
                      key={cat.name} 
                      className="filter-tab"
                      onClick={() => handleFilter(cat.name)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {loading.recent ? (
                <div className="loading-state" aria-live="polite">
                  <Loader size={32} className="spinner" aria-hidden="true" />
                  <p>Loading latest articles...</p>
                </div>
              ) : (
                <>
                  <div className="articles-list">
                    {recentPosts.map((post) => (
                      <article key={post.id} className="article-card" itemScope itemType="http://schema.org/Article">
                        <div className="article-content">
                          <div className="article-header">
                            <div className="article-category">
                              {getCategoryIcon(post.category?.Category)}
                              <span>{post.category?.Category || 'Programming'}</span>
                            </div>
                            <time 
                              className="article-date" 
                              dateTime={post.created_at}
                              itemProp="datePublished"
                            >
                              {formatDate(post.created_at)}
                            </time>
                          </div>
                          
                          <h3 className="article-title" itemProp="headline">
                            <a href={`/blog/${post.slug}`} itemProp="url">
                              {post.title}
                            </a>
                          </h3>
                          
                          <p className="article-excerpt" itemProp="description">
                            {post.content ? post.content.substring(0, 160) + '...' : 'Learn practical programming skills...'}
                          </p>
                          
                          <div className="article-footer">
                            <div className="article-meta">
                              <div className="author" itemProp="author">
                                <User size={14} aria-hidden="true" />
                                <span>{post.author || 'Code With Amul'}</span>
                              </div>
                              <div className="reading-time">
                                <Clock size={14} aria-hidden="true" />
                                <span>{calculateReadTime(post.content)}</span>
                              </div>
                            </div>
                            <a 
                              href={`/blog/${post.slug}`} 
                              className="article-link"
                              aria-label={`Continue reading ${post.title}`}
                            >
                              Read <ChevronRight size={14} aria-hidden="true" />
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  
                  <div className="load-more-container">
                    <button 
                      className="btn btn-load-more" 
                      onClick={fetchAllData}
                      aria-label="Load more articles"
                    >
                      Load More Articles
                    </button>
                  </div>
                </>
              )}
            </section>

            {/* Sidebar */}
            <aside className="sidebar" aria-label="Additional information">
              {/* Categories */}
              <div className="sidebar-widget">
                <div className="widget-header">
                  <BookOpen size={20} aria-hidden="true" />
                  <h3>Topics</h3>
                </div>
                {loading.categories ? (
                  <div className="loading-small" aria-live="polite">
                    <Loader size={16} className="spinner" aria-hidden="true" />
                    <span>Loading topics...</span>
                  </div>
                ) : (
                  <nav className="categories-list" aria-label="Browse by topic">
                    {categories.map((category) => (
                      <a 
                        key={category.name} 
                        href={`/category/${category.name.toLowerCase()}`}
                        className="category-item"
                        aria-label={`Browse ${category.name} articles (${category.count} posts)`}
                      >
                        <div className="category-info">
                          {category.icon}
                          <span>{category.name}</span>
                        </div>
                        <span className="category-count">{category.count}</span>
                      </a>
                    ))}
                  </nav>
                )}
              </div>

              {/* Trending Posts */}
              <div className="sidebar-widget">
                <div className="widget-header">
                  <TrendingUp size={20} aria-hidden="true" />
                  <h3>Trending Now</h3>
                </div>
                <div className="trending-list">
                  {trendingPosts.map((post) => (
                    <a 
                      key={post.id} 
                      href={`/blog/${post.id}`}
                      className="trending-item"
                      aria-label={`Trending ${post.rank}: ${post.title}`}
                    >
                      <div className="trending-rank">{post.rank}</div>
                      <div className="trending-content">
                        <h4>{post.title}</h4>
                        <span className="trending-meta">{post.views} views</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="sidebar-widget">
                <div className="widget-header">
                  <Tag size={20} aria-hidden="true" />
                  <h3>Popular Tags</h3>
                </div>
                {loading.tags ? (
                  <div className="loading-small" aria-live="polite">
                    <Loader size={16} className="spinner" aria-hidden="true" />
                    <span>Loading tags...</span>
                  </div>
                ) : (
                  <div className="tags-cloud" role="list">
                    {popularTags.map((tag) => (
                      <a 
                        key={tag} 
                        href={`/tag/${tag.toLowerCase()}`}
                        className="tag-item"
                        role="listitem"
                        aria-label={`Browse ${tag} tagged articles`}
                      >
                        #{tag}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Newsletter Widget */}
              <div className="sidebar-widget newsletter-widget">
                <div className="widget-header">
                  <Mail size={20} aria-hidden="true" />
                  <h3>Stay Updated</h3>
                </div>
                <p>Get weekly programming insights delivered to your inbox</p>
                <form onSubmit={handleSubscribe} className="subscribe-form">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email for newsletter subscription"
                  />
                  <button type="submit" className="btn btn-subscribe">
                    Subscribe
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Newsletter CTA */}
      <section className="cta-section" aria-label="Newsletter subscription">
        <div className="container">
          <div className="cta-content">
            <div className="cta-icon-wrapper">
              <MessageCircle size={48} aria-hidden="true" />
            </div>
            <h2>Join 15,000+ Developers</h2>
            <p>Get weekly tutorials, coding tips, and exclusive content directly in your inbox. No spam, just quality programming insights.</p>
            <form onSubmit={handleSubscribe} className="cta-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email for newsletter subscription"
                />
                <button type="submit" className="btn btn-primary">
                  Get Free Tutorials
                </button>
              </div>
              <p className="form-note">By subscribing, you agree to our Privacy Policy</p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <Code size={24} className="logo-icon" />
                <div>
                  <h3 className="footer-logo-title">Code With Amul</h3>
                  <p className="footer-tagline">Empowering developers through practical education</p>
                </div>
              </div>
              <p className="footer-description">
                A comprehensive programming blog focused on modern web development, 
                best practices, and practical project tutorials.
              </p>
              <div className="social-links">
                {['Twitter', 'GitHub', 'YouTube', 'LinkedIn'].map((platform) => (
                  <a 
                    key={platform} 
                    href="#" 
                    className="social-link"
                    aria-label={`Follow us on ${platform}`}
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="footer-links-grid">
              <div className="link-column">
                <h4>Content</h4>
                <ul>
                  {['All Articles', 'Tutorials', 'Projects', 'Cheatsheets', 'Newsletter'].map((link) => (
                    <li key={link}>
                      <a href="#">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="link-column">
                <h4>Topics</h4>
                <ul>
                  {categories.slice(0, 5).map((cat) => (
                    <li key={cat.name}>
                      <a href={`/category/${cat.name.toLowerCase()}`}>{cat.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="link-column">
                <h4>Resources</h4>
                <ul>
                  {['Documentation', 'Tools', 'Community', 'Contributors', 'Write for Us'].map((link) => (
                    <li key={link}>
                      <a href="#">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="copyright">
              <p>© 2025 Code With Amul. All rights reserved.</p>
              <p>Made with ❤️ for the developer community</p>
            </div>
            <div className="footer-legal">
              <a href="#" aria-label="Privacy Policy">Privacy Policy</a>
              <a href="#" aria-label="Terms of Service">Terms</a>
              <a href="#" aria-label="Cookie Policy">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Reset and Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #2563eb;
          --primary-dark: #1d4ed8;
          --secondary: #7c3aed;
          --text: #1e293b;
          --text-light: #64748b;
          --text-lighter: #94a3b8;
          --background: #ffffff;
          --background-alt: #f8fafc;
          --border: #e2e8f0;
          --border-light: #f1f5f9;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
          --radius: 0.5rem;
          --radius-lg: 0.75rem;
          --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: var(--text);
          background: var(--background);
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* Typography */
        h1, h2, h3, h4 {
          font-weight: 700;
          line-height: 1.2;
          color: var(--text);
        }

        h1 { font-size: 3.5rem; }
        h2 { font-size: 2.5rem; }
        h3 { font-size: 1.5rem; }
        h4 { font-size: 1.125rem; }

        @media (max-width: 768px) {
          h1 { font-size: 2.5rem; }
          h2 { font-size: 2rem; }
          h3 { font-size: 1.25rem; }
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius);
          font-weight: 600;
          font-size: 0.875rem;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-lg);
        }

        .btn-secondary {
          background: transparent;
          border-color: var(--border);
          color: var(--text);
        }

        .btn-secondary:hover {
          background: var(--background-alt);
          border-color: var(--text-lighter);
        }

        .btn-outline {
          background: transparent;
          border: 2px solid var(--border);
          color: var(--text);
        }

        .btn-outline:hover {
          background: var(--background-alt);
          border-color: var(--text-lighter);
        }

        .btn-subscribe {
          background: var(--text);
          color: white;
        }

        .btn-subscribe:hover {
          background: var(--primary);
        }

        .btn-load-more {
          width: 100%;
          padding: 1rem;
          background: var(--background-alt);
          color: var(--text);
          border: 1px solid var(--border);
        }

        .btn-load-more:hover {
          background: var(--border-light);
        }

        /* Header */
        .header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          gap: 2rem;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          color: var(--primary);
        }

        .logo-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .logo-subtitle {
          font-size: 0.75rem;
          color: var(--text-light);
          margin: 0;
        }

        .main-nav .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .nav-link {
          color: var(--text);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
          padding: 0.5rem 0;
          position: relative;
        }

        .nav-link:hover {
          color: var(--primary);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          transform: scaleX(0);
          transition: transform 0.2s ease;
        }

        .nav-link:hover::after {
          transform: scaleX(1);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .search-form {
          position: relative;
        }

        .search-input-group {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-lighter);
        }

        .search-form input {
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 2px solid var(--border);
          border-radius: var(--radius);
          width: 240px;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .search-form input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        /* Hero Section */
        .hero-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-text {
          max-width: 600px;
        }

        .category-badge {
          margin-bottom: 1.5rem;
        }

        .badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .hero-title {
          margin-bottom: 1.5rem;
        }

        .hero-description {
          font-size: 1.125rem;
          color: var(--text-light);
          margin-bottom: 2rem;
          line-height: 1.7;
        }

        .hero-meta {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-light);
          font-size: 0.875rem;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
        }

        .hero-visual {
          position: relative;
        }

        .code-preview {
          background: #1e293b;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }

        .code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: #0f172a;
          border-bottom: 1px solid #334155;
        }

        .code-dots {
          display: flex;
          gap: 0.5rem;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot.red { background: #ef4444; }
        .dot.yellow { background: #f59e0b; }
        .dot.green { background: #10b981; }

        .code-title {
          color: #cbd5e1;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
        }

        .code-snippet {
          padding: 1.5rem;
          margin: 0;
          overflow-x: auto;
        }

        .code-snippet code {
          color: #e2e8f0;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        /* Featured Section */
        .featured-section {
          padding: 4rem 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          color: var(--text-light);
          font-size: 1.125rem;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .featured-card {
          background: white;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: all 0.3s ease;
          height: 100%;
        }

        .featured-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }

        .card-image {
          height: 200px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          position: relative;
        }

        .image-container {
          position: relative;
          height: 100%;
          width: 100%;
        }

        .category-tag {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: white;
          color: var(--primary);
          padding: 0.25rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .card-stats {
          position: absolute;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          display: flex;
          gap: 1rem;
          color: white;
          font-size: 0.75rem;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          opacity: 0.9;
        }

        .card-content {
          padding: 1.5rem;
        }

        .card-meta {
          display: flex;
          justify-content: space-between;
          color: var(--text-light);
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .card-title {
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
        }

        .card-excerpt {
          color: var(--text-light);
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .card-tags {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: var(--background-alt);
          color: var(--text-light);
          border-radius: 2rem;
          font-size: 0.75rem;
        }

        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .read-more {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .icon-btn {
          background: none;
          border: none;
          color: var(--text-lighter);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
        }

        .icon-btn:hover {
          color: var(--primary);
          background: var(--background-alt);
        }

        /* Main Content Layout */
        .main-content {
          padding: 4rem 0;
          background: var(--background-alt);
        }

        .content-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        /* Recent Section */
        .recent-section {
          background: white;
          padding: 2rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .recent-section .section-header {
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 0.5rem 1rem;
          background: var(--background-alt);
          border: 1px solid var(--border);
          border-radius: 2rem;
          font-size: 0.875rem;
          color: var(--text-light);
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-tab.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .filter-tab:hover:not(.active) {
          background: var(--border-light);
        }

        .articles-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .article-card {
          padding: 1.5rem;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          transition: all 0.2s;
        }

        .article-card:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-md);
        }

        .article-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .article-category {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .article-date {
          color: var(--text-light);
          font-size: 0.875rem;
        }

        .article-title {
          margin-bottom: 0.75rem;
        }

        .article-title a {
          color: inherit;
          text-decoration: none;
        }

        .article-title a:hover {
          color: var(--primary);
        }

        .article-excerpt {
          color: var(--text-light);
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .article-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .article-meta {
          display: flex;
          gap: 1rem;
          color: var(--text-light);
          font-size: 0.75rem;
        }

        .author, .reading-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .article-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .load-more-container {
          margin-top: 3rem;
        }

        /* Sidebar */
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sidebar-widget {
          background: white;
          padding: 1.5rem;
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
        }

        .widget-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .widget-header h3 {
          margin: 0;
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          color: var(--text);
          text-decoration: none;
          border-radius: var(--radius);
          transition: all 0.2s;
        }

        .category-item:hover {
          background: var(--background-alt);
          color: var(--primary);
        }

        .category-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .category-count {
          background: var(--background-alt);
          padding: 0.25rem 0.5rem;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-light);
        }

        .trending-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .trending-item {
          display: flex;
          gap: 1rem;
          text-decoration: none;
          color: inherit;
          padding: 0.75rem;
          border-radius: var(--radius);
          transition: background 0.2s;
        }

        .trending-item:hover {
          background: var(--background-alt);
        }

        .trending-rank {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border-radius: var(--radius);
          font-weight: 700;
          flex-shrink: 0;
        }

        .trending-content h4 {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          line-height: 1.4;
        }

        .trending-meta {
          color: var(--text-light);
          font-size: 0.75rem;
        }

        .tags-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag-item {
          padding: 0.375rem 0.75rem;
          background: var(--background-alt);
          color: var(--text-light);
          border-radius: 2rem;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .tag-item:hover {
          background: var(--primary);
          color: white;
        }

        .newsletter-widget {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
        }

        .newsletter-widget h3,
        .newsletter-widget p {
          color: white;
        }

        .newsletter-widget p {
          opacity: 0.9;
          margin-bottom: 1rem;
        }

        .subscribe-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .subscribe-form input {
          padding: 0.75rem;
          border: none;
          border-radius: var(--radius);
          font-size: 0.875rem;
        }

        .subscribe-form input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
        }

        /* CTA Section */
        .cta-section {
          padding: 6rem 0;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: white;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }

        .cta-icon-wrapper {
          margin-bottom: 1.5rem;
        }

        .cta-content h2 {
          color: white;
          margin-bottom: 1rem;
        }

        .cta-content p {
          color: #cbd5e1;
          font-size: 1.125rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .cta-form {
          max-width: 480px;
          margin: 0 auto;
        }

        .input-group {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .cta-form input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid #475569;
          background: transparent;
          color: white;
          border-radius: var(--radius);
          font-size: 1rem;
        }

        .cta-form input:focus {
          outline: none;
          border-color: var(--primary);
        }

        .form-note {
          color: #94a3b8;
          font-size: 0.75rem;
        }

        /* Footer */
        .footer {
          background: var(--background);
          border-top: 1px solid var(--border);
          padding: 4rem 0 2rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
          margin-bottom: 3rem;
        }

        .footer-brand .logo {
          margin-bottom: 1rem;
        }

        .footer-logo-title {
          font-size: 1.5rem;
          margin: 0;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-tagline {
          color: var(--text-light);
          font-size: 0.875rem;
          margin: 0.25rem 0 1rem;
        }

        .footer-description {
          color: var(--text-light);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          color: var(--text);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }

        .social-link:hover {
          color: var(--primary);
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .link-column h4 {
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .link-column ul {
          list-style: none;
        }

        .link-column li {
          margin-bottom: 0.5rem;
        }

        .link-column a {
          color: var(--text-light);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }

        .link-column a:hover {
          color: var(--primary);
        }

        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-light);
          font-size: 0.875rem;
        }

        .copyright p {
          margin: 0.25rem 0;
        }

        .footer-legal {
          display: flex;
          gap: 1.5rem;
        }

        .footer-legal a {
          color: var(--text-light);
          text-decoration: none;
        }

        .footer-legal a:hover {
          color: var(--primary);
        }

        /* Loading States */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: var(--text-light);
          text-align: center;
        }

        .loading-small {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-light);
          padding: 1rem;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .alert {
          padding: 1rem;
          border-radius: var(--radius);
          margin: 1rem auto;
          max-width: 1280px;
          text-align: center;
        }

        .alert-warning {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fbbf24;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }

          .hero-cta {
            justify-content: center;
          }

          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .content-layout {
            grid-template-columns: 1fr;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .main-nav .nav-links {
            justify-content: center;
          }

          .header-actions {
            width: 100%;
          }

          .search-form input {
            width: 100%;
          }

          .featured-grid {
            grid-template-columns: 1fr;
          }

          .recent-section .section-header {
            flex-direction: column;
            gap: 1rem;
          }

          .input-group {
            flex-direction: column;
          }

          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .hero-cta {
            flex-direction: column;
          }

          .filter-tabs {
            justify-content: center;
          }

          .footer-links-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default GetStarted;