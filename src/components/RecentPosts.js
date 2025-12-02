import React from 'react';
import PostCard from '../config/PostCard';
import LoadingSpinner from '../config/LoadingSpinner';

function RecentPosts({ posts, categories, loading, onFilter, onLoadMore }) {
  if (loading) {
    return (
      <section className="recent-posts">
        <div className="section-header">
          <h2>Latest Articles</h2>
        </div>
        <LoadingSpinner message="Loading latest articles..." />
      </section>
    );
  }

  return (
    <section className="recent-posts">
      <div className="section-header">
        <h2>Latest Articles</h2>
        <div className="filter-options">
          <button className="filter-btn active" onClick={() => onFilter('All')}>
            All
          </button>
          {Array.isArray(categories) && categories.slice(0, 4).map(cat => (
            <button 
              key={cat?.name} 
              className="filter-btn"
              onClick={() => onFilter(cat?.name)}
            >
              {cat?.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="posts-list">
        {Array.isArray(posts) && posts.map((post) => (
          <PostCard key={post?.id} post={post} type="recent" />
        ))}
      </div>
      
      <div className="load-more">
        <button className="btn-load" onClick={onLoadMore}>
          Load More Articles
        </button>
      </div>
    </section>
  );
}

export default RecentPosts;