import React, { useState, useEffect } from 'react';
import { Search, Filter, LayoutGrid, List, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import PostCard from '../config/PostCard';
import LoadingSpinner from '../config/LoadingSpinner';
import { fetchAllPosts, fetchCategories } from '../middleware/api';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadData();
    window.scrollTo(0, 0);
  }, [refreshTrigger]);

  const handleNavbarSearch = async (query, e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, categoriesData] = await Promise.all([
        fetchAllPosts(),
        fetchCategories()
      ]);
      
      setPosts(postsData);
      setFilteredPosts(postsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...posts];

    if (selectedCategory !== 'All') {
      result = result.filter(post => 
        post.category?.Category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredPosts(result);
  }, [posts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="blog-page">
      <Navbar onSearch={handleNavbarSearch} onRefresh={handleRefresh} />
      
      <div className="blog-hero-section">
        <div className="hero-background">
          <div className="hero-blob blob-1"></div>
          <div className="hero-blob blob-2"></div>
          <div className="hero-blob blob-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-icon">
            <BookOpen size={48} />
          </div>
          <h1>Blog & Articles</h1>
          <p>Explore our collection of in-depth articles and tutorials on web development, programming, and technology</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{posts.length}</span>
              <span className="stat-label">Articles</span>
            </div>
            <div className="stat">
              <span className="stat-number">{categories.length}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>
      </div>

      <div className="blog-container">
        <div className="blog-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <div className="sort-control">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="categories-filter">
          <button
            className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            <Filter size={16} />
            All Articles ({posts.length})
          </button>
          {Array.isArray(categories) && categories.map(cat => (
            <button
              key={cat.Category}
              className={`category-btn ${selectedCategory === cat.Category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.Category)}
            >
              {cat.Category} ({cat.post_count || 0})
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner message="Loading articles..." />
        ) : filteredPosts.length > 0 ? (
          <>
            <div className={`posts-grid ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
              {filteredPosts.map(post => (
                <div key={post.id} className="post-item-wrapper">
                  <PostCard post={post} type={viewMode === 'grid' ? 'featured' : 'recent'} />
                </div>
              ))}
            </div>

            <div className="results-info">
              Showing {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
            </div>
          </>
        ) : (
          <div className="no-results">
            <h3>No articles found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .blog-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
        }

        .blog-hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6rem 2rem;
          text-align: center;
          animation: fadeIn 0.6s ease-out;
          position: relative;
          overflow: hidden;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .hero-blob {
          position: absolute;
          border-radius: 50%;
          opacity: 0.2;
          animation: blob 7s ease-in-out infinite;
        }

        .blob-1 {
          width: 300px;
          height: 300px;
          background: white;
          top: -50px;
          right: 50px;
          animation-delay: 0s;
        }

        .blob-2 {
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.5);
          bottom: 50px;
          left: 50px;
          animation-delay: 2s;
        }

        .blob-3 {
          width: 250px;
          height: 250px;
          background: rgba(255, 255, 255, 0.3);
          top: 50%;
          left: 50%;
          animation-delay: 4s;
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
        }

        .hero-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          margin-bottom: 1.5rem;
          animation: scaleIn 0.6s ease-out;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .hero-content h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          animation: slideDown 0.6s ease-out;
          letter-spacing: -1px;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-content p {
          font-size: 1.2rem;
          opacity: 0.95;
          animation: slideUp 0.6s ease-out 0.1s both;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 2rem;
          animation: slideUp 0.6s ease-out 0.2s both;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem 2.5rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .stat:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-5px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          display: block;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.95rem;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .blog-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .blog-controls {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          align-items: center;
          animation: slideUp 0.6s ease-out 0.3s both;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          flex: 1;
          min-width: 250px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .search-box:focus-within {
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .search-input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 1rem;
          color: #1f2937;
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .filter-group {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .sort-control {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.6rem 1rem;
          transition: all 0.3s;
        }

        .sort-control:focus-within {
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .sort-control label {
          color: #6b7280;
          font-weight: 600;
          white-space: nowrap;
          font-size: 0.95rem;
        }

        .sort-control select {
          border: none;
          outline: none;
          color: #1f2937;
          font-weight: 600;
          cursor: pointer;
          background: transparent;
          font-size: 0.95rem;
        }

        .view-toggle {
          display: flex;
          gap: 0.5rem;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.4rem;
          transition: all 0.3s;
        }

        .view-btn {
          background: transparent;
          border: none;
          padding: 0.5rem 0.75rem;
          color: #6b7280;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .view-btn:hover {
          background: white;
          color: #3b82f6;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }

        .view-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .view-btn.active:hover {
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
          transform: translateY(-1px);
        }

        .categories-filter {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
          animation: slideUp 0.6s ease-out 0.4s both;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          color: #6b7280;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.95rem;
        }

        .category-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          background: #f0f7ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
        }

        .category-btn.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: transparent;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          transform: translateY(-2px);
        }

        .category-btn.active:hover {
          box-shadow: 0 8px 28px rgba(102, 126, 234, 0.5);
          transform: translateY(-4px);
        }

        .posts-grid {
          display: grid;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .posts-grid.grid-view {
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }

        .posts-grid.list-view {
          grid-template-columns: 1fr;
        }

        .post-item-wrapper {
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .results-info {
          text-align: center;
          color: #6b7280;
          font-size: 0.95rem;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          font-weight: 600;
          animation: slideUp 0.6s ease-out;
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #f9fafb, #f3f4f6);
          border-radius: 12px;
          animation: fadeIn 0.6s ease-out;
          border: 2px dashed #e5e7eb;
        }

        .no-results h3 {
          font-size: 1.5rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .no-results p {
          color: #6b7280;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .blog-hero-section {
            padding: 3rem 1rem;
            min-height: 400px;
          }

          .hero-icon {
            width: 60px;
            height: 60px;
          }

          .hero-icon svg {
            width: 32px;
            height: 32px;
          }

          .hero-content h1 {
            font-size: 2.2rem;
            margin-bottom: 0.75rem;
          }

          .hero-content p {
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }

          .hero-stats {
            gap: 1.5rem;
            flex-direction: column;
            align-items: stretch;
          }

          .stat {
            padding: 1rem 1.5rem;
          }

          .blog-controls {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .search-box {
            min-width: 100%;
          }

          .sort-control {
            width: 100%;
            justify-content: space-between;
          }

          .view-toggle {
            margin-left: auto;
          }

          .posts-grid.grid-view {
            grid-template-columns: 1fr;
          }

          .categories-filter {
            gap: 0.75rem;
            padding: 1rem;
            overflow-x: auto;
          }

          .category-btn {
            padding: 0.6rem 1rem;
            font-size: 0.9rem;
            white-space: nowrap;
          }

          .blog-container {
            padding: 1.5rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .blog-hero-section {
            padding: 2rem 1rem;
            min-height: 350px;
          }

          .hero-content h1 {
            font-size: 1.75rem;
          }

          .hero-content p {
            font-size: 0.95rem;
          }

          .hero-stats {
            gap: 1rem;
          }

          .stat {
            padding: 0.75rem 1rem;
          }

          .stat-number {
            font-size: 2rem;
          }

          .stat-label {
            font-size: 0.85rem;
          }

          .blog-controls {
            flex-direction: column;
            gap: 0.75rem;
            padding: 1rem;
          }

          .filter-group {
            width: 100%;
            flex-direction: column;
            gap: 0.75rem;
          }

          .sort-control {
            width: 100%;
          }

          .view-toggle {
            width: 100%;
            margin-left: 0;
          }

          .category-btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.85rem;
          }

          .posts-grid {
            gap: 1rem;
          }

          .no-results {
            padding: 2rem 1rem;
          }

          .results-info {
            padding: 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Blog;
