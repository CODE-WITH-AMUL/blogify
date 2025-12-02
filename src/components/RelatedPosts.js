import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock } from 'lucide-react';
import { formatDate, calculateReadTime } from '../middleware/helpers';

const RelatedPosts = ({ posts }) => {
  const navigate = useNavigate();

  if (!posts.length) return null;

  return (
    <>
      <div className="related-posts">
        <h3 className="related-title">Related Articles</h3>
        <div className="related-list">
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              className="related-card"
              onClick={() => navigate(`/blog/${post.slug}`)}
              role="button"
              tabIndex={0}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="related-card-header">
                <span className="related-category">{post.category?.Category}</span>
                <time className="related-date">{formatDate(post.created_at)}</time>
              </div>
              <h4 className="related-card-title">{post.title}</h4>
              <div className="related-card-meta">
                <Clock size={14} />
                <span>{calculateReadTime(post.content)}</span>
              </div>
              <div className="related-card-action">
                <span>Read</span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .related-posts {
          animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .related-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }

        :global([data-theme="dark"]) .related-title {
          color: #f1f5f9;
          border-bottom-color: #334155;
        }

        .related-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .related-card {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid #e2e8f0;
          padding: 1.25rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: cardAppear 0.4s ease-out forwards;
          opacity: 0;
        }

        :global([data-theme="dark"]) .related-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-color: #334155;
        }

        @keyframes cardAppear {
          to {
            opacity: 1;
          }
        }

        .related-card:hover {
          background: linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%);
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
          transform: translateY(-2px);
        }

        :global([data-theme="dark"]) .related-card:hover {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }

        .related-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          gap: 0.75rem;
        }

        .related-category {
          background: linear-gradient(135deg, #dbeafe, #e0e7ff);
          color: #1e40af;
          padding: 0.25rem 0.625rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }

        :global([data-theme="dark"]) .related-category {
          background: linear-gradient(135deg, #1e3a8a, #312e81);
          color: #93c5fd;
        }

        .related-date {
          color: #6b7280;
          font-size: 0.75rem;
          white-space: nowrap;
        }

        :global([data-theme="dark"]) .related-date {
          color: #cbd5e1;
        }

        .related-card-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.75rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        :global([data-theme="dark"]) .related-card-title {
          color: #f1f5f9;
        }

        .related-card-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.8rem;
          margin-bottom: 0.75rem;
        }

        :global([data-theme="dark"]) .related-card-meta {
          color: #cbd5e1;
        }

        .related-card-action {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.5rem;
          color: #3b82f6;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .related-card:hover .related-card-action {
          gap: 0.75rem;
        }

        :global([data-theme="dark"]) .related-card-action {
          color: #60a5fa;
        }

        .related-card-action svg {
          transition: transform 0.2s;
        }

        .related-card:hover .related-card-action svg {
          transform: translateX(2px);
        }

        @media (max-width: 640px) {
          .related-card {
            padding: 1rem;
          }

          .related-card-title {
            font-size: 0.875rem;
          }

          .related-card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .related-date {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default RelatedPosts;
