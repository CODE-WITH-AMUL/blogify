import React, { useState } from 'react';
import Navbar from './components/nav';
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
  Flask,
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

} from 'lucide-react';

function GetStarted() {
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPosts = [
    {
      id: 1,
      title: "React 18 Concurrent Features Explained",
      excerpt: "Deep dive into the latest React 18 features including concurrent rendering, automatic batching, and transitions.",
      author: "Sarah Chen",
      date: "Dec 15, 2023",
      readTime: "8 min read",
      category: "Frontend",
      likes: 245,
      comments: 42,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      tags: ["React", "JavaScript", "Web Dev"]
    },
    {
      id: 2,
      title: "Building Scalable APIs with Node.js & TypeScript",
      excerpt: "Learn how to build production-ready REST APIs with proper error handling, validation, and testing.",
      author: "Alex Rivera",
      date: "Dec 12, 2023",
      readTime: "12 min read",
      category: "Backend",
      likes: 189,
      comments: 31,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w-800",
      tags: ["Node.js", "TypeScript", "API"]
    },
    {
      id: 3,
      title: "Modern CSS Techniques You Should Know in 2024",
      excerpt: "Explore cutting-edge CSS features including container queries, :has selector, and CSS nesting.",
      author: "Maya Patel",
      date: "Dec 10, 2023",
      readTime: "6 min read",
      category: "Frontend",
      likes: 312,
      comments: 56,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      tags: ["CSS", "Web Design", "Frontend"]
    }
  ];

  const recentPosts = [
    {
      id: 4,
      title: "Mastering State Management with Zustand",
      excerpt: "A comprehensive guide to state management using Zustand for React applications.",
      author: "David Kim",
      date: "Dec 8, 2023",
      readTime: "7 min read",
      category: "React"
    },
    {
      id: 5,
      title: "Docker for Frontend Developers",
      excerpt: "Learn how to containerize your frontend applications for consistent development and deployment.",
      author: "Lisa Wang",
      date: "Dec 5, 2023",
      readTime: "10 min read",
      category: "DevOps"
    },
    {
      id: 6,
      title: "Next.js 14 App Router Best Practices",
      excerpt: "Optimize your Next.js applications with the new App Router and server components.",
      author: "Tom Wilson",
      date: "Dec 3, 2023",
      readTime: "9 min read",
      category: "Next.js"
    },
    {
      id: 7,
      title: "GraphQL vs REST: Making the Right Choice",
      excerpt: "Comparing both approaches to help you decide which fits your project needs.",
      author: "Emma Davis",
      date: "Nov 30, 2023",
      readTime: "11 min read",
      category: "API"
    }
  ];

const categories = [
    // Existing categories
    { name: "React", icon: <Zap size={20} />, count: 128 },
    { name: "JavaScript", icon: <Code size={20} />, count: 156 },
    { name: "TypeScript", icon: <BookOpen size={20} />, count: 89 },
    { name: "Node.js", icon: <Database size={20} />, count: 72 },
    { name: "CSS", icon: <PenTool size={20} />, count: 103 },
    { name: "Mobile", icon: <Smartphone size={20} />, count: 45 }, // Note: 'Mobile' isn't in your Python list, but I kept it.

    // --- Added from TAG_DEFULT_CHOICES ---

    // Programming Languages
    { name: "Python", icon: <Terminal size={20} />, count: 95 },
    { name: "Java", icon: <Cpu size={20} />, count: 60 },
    { name: "C++", icon: <Brackets size={20} />, count: 48 },
    { name: "Go", icon: <Anchor size={20} />, count: 35 },
    { name: "C#", icon: <Code size={20} />, count: 25 },

    // Web Markup/Frameworks
    { name: "HTML", icon: <Layout size={20} />, count: 88 },
    { name: "Django", icon: <Globe size={20} />, count: 55 },
    { name: "Angular", icon: <Aperture size={20} />, count: 40 },
    { name: "Vue.js", icon: <Heart size={20} />, count: 52 },

    // Databases
    { name: "SQL", icon: <Database size={20} />, count: 78 },
    { name: "MongoDB", icon: <Server size={20} />, count: 42 },
    { name: "PostgreSQL", icon: <Disc size={20} />, count: 22 },
];
  const popularTags = [
    "React", "JavaScript", "TypeScript", "CSS", "Node.js", 
    "Next.js", "Tailwind", "GraphQL", "Docker", "AWS"
  ];

  const trendingPosts = [
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

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed successfully with: ${email}`);
      setEmail('');
    }
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

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge">TRENDING</span>
          </div>
          <div className="hero-image">
    <div className="image-placeholder">
        {/* Replace the original <div className="code-preview"> block entirely */}
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
    {[
        // Frontend/JavaScript Ecosystem
        "React",
        "JavaScript",
        "TypeScript",
        "Hooks",
        "Frontend",
        "Node.js",
        "Angular",
        "Vue.js",

        // Backend/Full Stack
        "Python",
        "Django",
        "Flask",
        "Java",
        "Spring Boot",
        "PHP",
        "Laravel",
        "Go",

        // Databases
        "SQL",
        "NoSQL",
        "MongoDB",
        "PostgreSQL",

        // Styling/Markup
        "CSS",
        "HTML",
        "Tailwind CSS",
        "Sass",

        // Version Control/DevOps
        "Git",
        "Docker",
        "AWS",
        "Kubernetes",
        "CI/CD",
        "Web Dev" // Kept existing tag
    ].map((tag) => (
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
        
        <div className="featured-grid">
          {featuredPosts.map((post) => (
            <article key={post.id} className="post-card featured">
              <div className="post-image">
                <div className="category-badge">{post.category}</div>
                <div className="image-overlay">
                  <div className="post-stats">
                    <span><Heart size={16} /> {post.likes}</span>
                    <span><MessageCircle size={16} /> {post.comments}</span>
                  </div>
                </div>
              </div>
              
              <div className="post-content">
                <div className="post-meta">
                  <span className="author">{post.author}</span>
                  <span className="date">{post.date}</span>
                  <span className="read-time">{post.readTime}</span>
                </div>
                
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag"><Tag size={12} /> {tag}</span>
                  ))}
                </div>
                
                <div className="post-actions">
                  <button className="btn-read">
                    Read More <ChevronRight size={16} />
                  </button>
                  <div className="action-icons">
                    <button><Bookmark size={18} /></button>
                    <button><Share2 size={18} /></button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          {/* Recent Posts */}
          <section className="recent-posts">
            <div className="section-header">
              <h2>Latest Articles</h2>
              <div className="filter-options">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">React</button>
                <button className="filter-btn">JavaScript</button>
                <button className="filter-btn">CSS</button>
              </div>
            </div>
            
            <div className="posts-list">
              {recentPosts.map((post) => (
                <article key={post.id} className="post-card recent">
                  <div className="post-content">
                    <div className="post-header">
                      <span className="post-category">{post.category}</span>
                      <span className="post-date">{post.date}</span>
                    </div>
                    
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-excerpt">{post.excerpt}</p>
                    
                    <div className="post-footer">
                      <div className="author-info">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                      <div className="post-meta">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                      <button className="btn-read-sm">
                        Read <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="load-more">
              <button className="btn-load">
                Load More Articles
              </button>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="sidebar">
            {/* Categories */}
            <div className="sidebar-widget">
              <h3>
                <BookOpen size={20} />
                Categories
              </h3>
              <div className="categories-list">
                {categories.map((category) => (
                  <a key={category.name} href="#" className="category-item">
                    <div className="category-info">
                      {category.icon}
                      <span>{category.name}</span>
                    </div>
                    <span className="category-count">{category.count}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Trending Posts */}
            <div className="sidebar-widget">
              <h3>
                <TrendingUp size={20} />
                Trending Now
              </h3>
              <div className="trending-list">
                {trendingPosts.map((post) => (
                  <a key={post.id} href="#" className="trending-item">
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
              <div className="tags-cloud">
                {popularTags.map((tag) => (
                  <a key={tag} href="#" className="tag-item">
                    #{tag}
                  </a>
                ))}
              </div>
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
              {['Python', 'JavaScript', 'React', 'Backend', 'DevOps'].map((link) => (
                <a key={link} href="#">{link}</a>
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
          <p>© 2025 Code With Amul All rights reserved </p>
          <div className="footer-meta">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
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