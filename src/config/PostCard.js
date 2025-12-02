import React from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Tag, ChevronRight, User, Clock } from 'lucide-react';
import { formatDate, calculateReadTime } from '../middleware/helpers';

function PostCard({ post, type = 'recent' }) {
  if (type === 'featured') {
    return (
      <article className="post-card featured">
        <div className="post-image" style={{
          background: `linear-gradient(135deg, #3b82f6, #8b5cf6)`,
          backgroundImage: post?.image ? `url(${post.image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          {post?.category && (
            <div className="category-badge">{post.category.Category || 'Uncategorized'}</div>
          )}
          <div className="image-overlay">
            <div className="post-stats">
              <span><Heart size={16} /> {post?.likes || 0}</span>
              <span><MessageCircle size={16} /> {post?.comments || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="post-content">
          <div className="post-meta">
            <span className="author">{post?.author || 'Unknown Author'}</span>
            <span className="date">{formatDate(post?.created_at)}</span>
            <span className="read-time">{calculateReadTime(post?.content)}</span>
          </div>
          
          <h3 className="post-title">{post?.title || 'Untitled Post'}</h3>
          <p className="post-excerpt">
            {post?.content ? post.content.substring(0, 150) + '...' : 'No content available'}
          </p>
          
          <div className="post-tags">
            {Array.isArray(post?.tag) && post.tag.slice(0, 3).map((tag) => (
              <span key={tag} className="tag"><Tag size={12} /> {tag || 'Tag'}</span>
            ))}
          </div>
          
          <div className="post-actions">
            <a href={`/blog/${post?.slug}`} className="btn-read" onClick={(e) => window.location.href = `/blog/${post?.slug}`}>
              Read More <ChevronRight size={16} />
            </a>
            <div className="action-icons">
              <button title="Save"><Bookmark size={18} /></button>
              <button title="Share"><Share2 size={18} /></button>
            </div>
          </div>
        </div>

        <style jsx>{`
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
        `}</style>
      </article>
    );
  }

  // Recent post type
  return (
    <article className="post-card recent">
      <div className="post-content">
        <div className="post-header">
          {post?.category && (
            <span className="post-category">{post.category.Category || 'Uncategorized'}</span>
          )}
          <span className="post-date">{formatDate(post?.created_at)}</span>
        </div>
        
        <h3 className="post-title">{post?.title || 'Untitled Post'}</h3>
        <p className="post-excerpt">
          {post?.content ? post.content.substring(0, 200) + '...' : 'No content available'}
        </p>
        
        <div className="post-footer">
          <div className="author-info">
            <User size={14} />
            <span>{post?.author || 'Unknown Author'}</span>
          </div>
          <div className="post-meta">
            <Clock size={14} />
            <span>{calculateReadTime(post?.content)}</span>
          </div>
          <a href={`/blog/${post?.slug}`} className="btn-read-sm" onClick={(e) => window.location.href = `/blog/${post?.slug}`}>
            Read <ChevronRight size={14} />
          </a>
        </div>
      </div>

      <style jsx>{`
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

        .post-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .author-info {
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
      `}</style>
    </article>
  );
}

export default PostCard;