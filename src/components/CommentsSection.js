import React, { useState } from 'react';
import { MessageCircle, Send, User, ThumbsUp } from 'lucide-react';

const CommentsSection = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        text: comment,
        author: 'You',
        date: new Date().toISOString(),
        likes: 0
      };
      setComments([newComment, ...comments]);
      setComment('');
    }
  };

  const handleLike = (commentId) => {
    setComments(comments.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    ));
  };

  return (
    <>
      <div className="comments-section" id="comments">
        <h3 className="comments-title">
          <MessageCircle size={20} />
          Comments ({comments.length})
        </h3>
        
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="comment-input-group">
            <User size={20} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              required
            />
          </div>
          <button type="submit" className="comment-submit">
            <Send size={18} />
            Post Comment
          </button>
        </form>

        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  <div className="comment-avatar">
                    {comment.author[0]}
                  </div>
                  <div>
                    <strong>{comment.author}</strong>
                    <time>{new Date(comment.date).toLocaleDateString()}</time>
                  </div>
                </div>
                <button 
                  onClick={() => handleLike(comment.id)}
                  className="comment-like"
                >
                  <ThumbsUp size={16} />
                  {comment.likes > 0 && <span>{comment.likes}</span>}
                </button>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .comments-section {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        :global([data-theme="dark"]) .comments-section {
          border-top-color: #334155;
        }

        .comments-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 2rem;
        }

        :global([data-theme="dark"]) .comments-title {
          color: #f1f5f9;
        }

        .comment-form {
          margin-bottom: 2rem;
        }

        .comment-input-group {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        }

        :global([data-theme="dark"]) .comment-input-group {
          background: #1e293b;
          border-color: #334155;
          color: #f1f5f9;
        }

        .comment-input-group svg {
          color: #6b7280;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }

        :global([data-theme="dark"]) .comment-input-group svg {
          color: #cbd5e1;
        }

        textarea {
          flex: 1;
          border: none;
          background: transparent;
          resize: none;
          font-family: inherit;
          font-size: 1rem;
          color: #1f2937;
          outline: none;
        }

        :global([data-theme="dark"]) textarea {
          color: #f1f5f9;
        }

        textarea::placeholder {
          color: #9ca3af;
        }

        :global([data-theme="dark"]) textarea::placeholder {
          color: #64748b;
        }

        .comment-submit {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .comment-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .comment-item {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          animation: slideIn 0.3s ease-out;
        }

        :global([data-theme="dark"]) .comment-item {
          background: #1e293b;
          border-color: #334155;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .comment-author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .comment-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
        }

        .comment-author strong {
          display: block;
          color: #1f2937;
          font-weight: 600;
        }

        :global([data-theme="dark"]) .comment-author strong {
          color: #f1f5f9;
        }

        .comment-author time {
          display: block;
          color: #6b7280;
          font-size: 0.75rem;
        }

        :global([data-theme="dark"]) .comment-author time {
          color: #cbd5e1;
        }

        .comment-like {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        :global([data-theme="dark"]) .comment-like {
          border-color: #475569;
          color: #cbd5e1;
        }

        .comment-like:hover {
          background: #f3f4f6;
          color: #dc2626;
          border-color: #dc2626;
        }

        :global([data-theme="dark"]) .comment-like:hover {
          background: #334155;
        }

        .comment-text {
          color: #374151;
          line-height: 1.6;
        }

        :global([data-theme="dark"]) .comment-text {
          color: #cbd5e1;
        }

        @media (max-width: 640px) {
          .comment-item {
            padding: 1rem;
          }

          .comment-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default CommentsSection;
