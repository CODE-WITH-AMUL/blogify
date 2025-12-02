import React from 'react';
import LoadingSpinner from '../config/LoadingSpinner';
import { BookOpen, TrendingUp, Tag as TagIcon } from 'lucide-react';

function Sidebar({ 
  categories, 
  trendingPosts, 
  popularTags, 
  loading,
  onSubscribe,
  email,
  setEmail 
}) {
  return (
    <aside className="sidebar">
      {/* Categories Widget */}
      <div className="sidebar-widget">
        <h3>
          <BookOpen size={20} />
          Categories
        </h3>
        {loading.categories ? (
          <LoadingSpinner small message="Loading categories..." />
        ) : (
          <div className="categories-list">
            {Array.isArray(categories) && categories.map((category) => (
              <a 
                key={category?.name} 
                href={`/category/${category?.name?.toLowerCase() || ''}`} 
                className="category-item"
              >
                <div className="category-info">
                  {category?.icon}
                  <span>{category?.name}</span>
                </div>
                <span className="category-count">{category?.count || 0}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Trending Posts Widget */}
      <div className="sidebar-widget">
        <h3>
          <TrendingUp size={20} />
          Trending Now
        </h3>
        <div className="trending-list">
          {Array.isArray(trendingPosts) && trendingPosts.map((post) => (
            <a key={post?.id} href={`/blog/${post?.id}`} className="trending-item">
              <div className="trending-rank">{post?.rank}</div>
              <div className="trending-content">
                <h4>{post?.title}</h4>
                <span className="trending-views">{post?.views} views</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Popular Tags Widget */}
      <div className="sidebar-widget">
        <h3>
          <TagIcon size={20} />
          Popular Tags
        </h3>
        {loading.tags ? (
          <LoadingSpinner small message="Loading tags..." />
        ) : (
          <div className="tags-cloud">
            {Array.isArray(popularTags) && popularTags.map((tag) => (
              <a key={tag} href={`/tag/${tag?.toLowerCase() || ''}`} className="tag-item">
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
        <form onSubmit={onSubscribe} className="subscribe-form">
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

      <style jsx>{`
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
      `}</style>
    </aside>
  );
}

export default Sidebar;