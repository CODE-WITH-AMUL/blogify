import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, List, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import PostCard from '../config/PostCard';
import LoadingSpinner from '../config/LoadingSpinner';
import { fetchAllPosts, fetchCategories } from '../middleware/api';
import '../static/style/main.css';

function Category() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadData();
    window.scrollTo(0, 0);
  }, [categoryName]);

  const handleNavbarSearch = async (query, e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, categoriesData] = await Promise.all([
        fetchAllPosts(),
        fetchCategories()
      ]);
      
      const decodedCategoryName = decodeURIComponent(categoryName);
      const category = categoriesData.find(
        cat => cat.Category.toLowerCase() === decodedCategoryName.toLowerCase()
      );

      if (category) {
        const categoryPosts = postsData.filter(
          post => post.category?.Category?.toLowerCase() === decodedCategoryName.toLowerCase()
        );
        setPosts(categoryPosts);
        setFilteredPosts(categoryPosts);
      } else {
        setPosts([]);
        setFilteredPosts([]);
      }
    } catch (error) {
      console.error('Error loading category data:', error);
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...posts];

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
  }, [posts, searchQuery, sortBy]);

  if (loading) {
    return <LoadingSpinner message="Loading category..." />;
  }

  const categoryDisplayName = decodeURIComponent(categoryName);

  return (
    <div className="category-page">
      <Navbar onSearch={handleNavbarSearch} />
      
      <div className="category-hero-section">
        <div className="hero-background">
          <div className="hero-blob blob-1"></div>
          <div className="hero-blob blob-2"></div>
          <div className="hero-blob blob-3"></div>
        </div>
        <div className="hero-content">
          <button className="back-btn" onClick={() => navigate('/blog')} title="Back to Blog">
            <ArrowLeft size={24} />
            Back to Blog
          </button>
          <h1>{categoryDisplayName}</h1>
          <p>Explore all articles in the {categoryDisplayName} category</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{posts.length}</span>
              <span className="stat-label">Articles</span>
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
              placeholder="Search in this category..."
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

        {filteredPosts.length > 0 ? (
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
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;
