import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, LayoutGrid, List, BookOpen, ChevronDown, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import PostCard from '../config/PostCard';
import LoadingSpinner from '../config/LoadingSpinner';
import { fetchAllPosts, fetchCategories, fetchTags } from '../middleware/api';

function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
      const [postsData, categoriesData, tagsData] = await Promise.all([
        fetchAllPosts(),
        fetchCategories(),
        fetchTags()
      ]);
      
      setPosts(postsData);
      setFilteredPosts(postsData);
      setCategories(categoriesData);
      setTags(tagsData);
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

    if (selectedTags.length > 0) {
      result = result.filter(post => {
        const postTags = Array.isArray(post.tag) ? post.tag : [];
        return selectedTags.some(selectedTag =>
          postTags.some(postTag =>
            postTag.toLowerCase() === selectedTag.toLowerCase()
          )
        );
      });
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
  }, [posts, selectedCategory, selectedTags, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedTags([]);
    setSearchQuery('');
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedTags.length > 0 || searchQuery;

  return (
    <div className="blog-page">
      <Navbar onSearch={handleNavbarSearch} onRefresh={handleRefresh} />
      
      {/* Hero Section */}
      <div className="blog-hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-icon">
              <BookOpen size={28} />
            </div>
            <h1 className="hero-title">Programming Blog</h1>
            <p className="hero-description">
              Tutorials, guides, and insights on web development
            </p>
          </div>
        </div>
      </div>

      <div className="blog-container">
        {/* Search & Controls */}
        <div className="main-controls">
          <div className="search-section">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search articles"
              />
            </div>
            
            {/* Mobile Filter Toggle */}
            <button 
              className="mobile-filter-btn"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              aria-label="Toggle filters"
            >
              <Filter size={18} />
              <span>Filters</span>
              <ChevronDown size={16} className={`chevron ${showMobileFilters ? 'open' : ''}`} />
            </button>
          </div>

          <div className="controls-section">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              aria-label="Sort articles"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>

            <div className="view-section">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <LayoutGrid size={18} />
                <span className="view-label">Grid</span>
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={18} />
                <span className="view-label">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="active-filters">
            <div className="filter-chips">
              {selectedCategory !== 'All' && (
                <span className="filter-chip">
                  {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className="remove-filter"
                    aria-label={`Remove ${selectedCategory} filter`}
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {selectedTags.map(tag => (
                <span key={tag} className="filter-chip">
                  {tag}
                  <button 
                    onClick={() => toggleTag(tag)}
                    className="remove-filter"
                    aria-label={`Remove ${tag} tag filter`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              {searchQuery && (
                <span className="filter-chip">
                  "{searchQuery}"
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="remove-filter"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              <button 
                onClick={clearAllFilters}
                className="clear-all-btn"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        <div className={`filters-section ${showMobileFilters ? 'mobile-show' : ''}`}>
          {/* Categories */}
          <div className="filter-group">
            <h3 className="filter-group-title">Categories</h3>
            <div className="filter-options">
              <button
                className={`filter-option ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('All')}
              >
                All <span className="count">({posts.length})</span>
              </button>
              {Array.isArray(categories) && categories.map(cat => (
                <button
                  key={cat.Category}
                  className={`filter-option ${selectedCategory === cat.Category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.Category)}
                >
                  {cat.Category} <span className="count">({cat.post_count || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="filter-group">
              <h3 className="filter-group-title">Tags</h3>
              <div className="filter-options">
                {tags.map(tag => (
                  <button
                    key={tag.id || tag.Tag}
                    className={`filter-option ${selectedTags.includes(tag.Tag) ? 'active' : ''}`}
                    onClick={() => toggleTag(tag.Tag)}
                  >
                    {tag.Tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Loading articles..." />
        ) : filteredPosts.length > 0 ? (
          <>
            <div className="results-header">
              <h2 className="results-title">
                {filteredPosts.length} Article{filteredPosts.length !== 1 ? 's' : ''}
              </h2>
            </div>

            <div className={`posts-grid ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
              {filteredPosts.map(post => (
                <div key={post.id} className="post-item-wrapper">
                  <PostCard 
                    post={post} 
                    type={viewMode === 'grid' ? 'featured' : 'recent'} 
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">📄</div>
            <h3 className="no-results-title">No articles found</h3>
            <p className="no-results-description">
              Try adjusting your search terms or filters
            </p>
            <button 
              className="no-results-action"
              onClick={clearAllFilters}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .blog-page {
          min-height: 100vh;
          background: #f9fafb;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* Hero Section */
        .blog-hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 3rem 0;
        }

        .hero-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .hero-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .hero-description {
          font-size: 1.125rem;
          opacity: 0.9;
          margin: 0;
          line-height: 1.6;
        }

        .blog-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        /* Main Controls */
        .main-controls {
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1 1 300px;
        }

        .search-box {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          font-size: 0.938rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: #667eea;
        }

        .mobile-filter-btn {
          display: none;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .chevron {
          transition: transform 0.2s;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .controls-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .sort-select {
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          font-size: 0.875rem;
          cursor: pointer;
          outline: none;
          color: #1f2937;
        }

        .sort-select:focus {
          border-color: #667eea;
        }

        .view-section {
          display: flex;
          gap: 0.25rem;
          background: #f3f4f6;
          padding: 0.25rem;
          border-radius: 8px;
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .view-btn:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .view-btn.active {
          background: white;
          color: #667eea;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        /* Active Filters */
        .active-filters {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          background: white;
          border: 1px solid #93c5fd;
          border-radius: 16px;
          color: #1e40af;
          font-size: 0.813rem;
          font-weight: 500;
        }

        .remove-filter {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: #1e40af;
        }

        .remove-filter:hover {
          opacity: 0.7;
        }

        .clear-all-btn {
          padding: 0.375rem 0.75rem;
          background: transparent;
          border: 1px solid #f87171;
          color: #dc2626;
          border-radius: 16px;
          font-size: 0.813rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .clear-all-btn:hover {
          background: #fef2f2;
        }

        /* Filters Section */
        .filters-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .filter-group {
          margin-bottom: 1.5rem;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-group-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 0.75rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .filter-option {
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border: none;
          border-radius: 20px;
          color: #4b5563;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .filter-option:hover {
          background: #e5e7eb;
        }

        .filter-option.active {
          background: #667eea;
          color: white;
        }

        .count {
          opacity: 0.7;
          font-size: 0.813rem;
        }

        /* Results Header */
        .results-header {
          margin-bottom: 1.5rem;
        }

        .results-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        /* Posts Grid */
        .posts-grid {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .posts-grid.grid-view {
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        }

        .posts-grid.list-view {
          grid-template-columns: 1fr;
        }

        .post-item-wrapper {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 12px;
          max-width: 500px;
          margin: 0 auto;
        }

        .no-results-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-results-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .no-results-description {
          color: #6b7280;
          margin: 0 0 1.5rem 0;
        }

        .no-results-action {
          padding: 0.75rem 1.5rem;
          background: #667eea;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .no-results-action:hover {
          background: #5568d3;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .blog-hero-section {
            padding: 2.5rem 0;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .main-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .search-section {
            width: 100%;
          }

          .mobile-filter-btn {
            display: flex;
            width: 100%;
            justify-content: center;
          }

          .controls-section {
            width: 100%;
            justify-content: space-between;
          }

          .filters-section {
            display: none;
          }

          .filters-section.mobile-show {
            display: block;
            animation: slideDown 0.3s ease;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .view-label {
            display: none;
          }

          .posts-grid.grid-view {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .blog-container {
            padding: 1.5rem 1rem 3rem;
          }

          .hero-title {
            font-size: 1.75rem;
          }

          .controls-section {
            flex-direction: column;
            gap: 0.75rem;
          }

          .sort-select,
          .view-section {
            width: 100%;
          }

          .view-section {
            justify-content: center;
          }

          .filter-chips {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-chip,
          .clear-all-btn {
            justify-content: space-between;
          }
        }

        /* Dark Mode */
        @media (prefers-color-scheme: dark) {
          .blog-page {
            background: #111827;
            color: #f3f4f6;
          }

          .main-controls,
          .filters-section,
          .no-results {
            background: #1f2937;
            border-color: #374151;
          }

          .search-input,
          .sort-select {
            background: #374151;
            border-color: #4b5563;
            color: #f3f4f6;
          }

          .search-input::placeholder {
            color: #9ca3af;
          }

          .filter-option:not(.active) {
            background: #374151;
            color: #d1d5db;
          }

          .filter-option:not(.active):hover {
            background: #4b5563;
          }

          .results-title,
          .no-results-title {
            color: #f3f4f6;
          }

          .no-results-description {
            color: #9ca3af;
          }
        }

        /* Print */
        @media print {
          .main-controls,
          .filters-section,
          .active-filters {
            display: none;
          }

          .posts-grid {
            display: block;
          }

          .post-item-wrapper {
            page-break-inside: avoid;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Blog;