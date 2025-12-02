import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, User, Clock, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import { fetchAllPosts } from '../middleware/api';
import { formatDate, calculateReadTime } from '../middleware/helpers';
import LoadingSpinner from '../config/LoadingSpinner';

function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);

  const handleNavbarSearch = async (query, e) => {
    e.preventDefault();
    navigate(`/blog?search=${encodeURIComponent(query)}`);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const posts = await fetchAllPosts();
        const foundPost = posts.find(p => p.slug === slug);
        
        if (foundPost) {
          setPost(foundPost);
          const related = posts
            .filter(p => p.id !== foundPost.id && p.category?.Category === foundPost.category?.Category)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return <LoadingSpinner message="Loading blog post..." />;
  }

  if (!post) {
    return (
      <div className="blog-not-found">
        <h2>Blog Post Not Found</h2>
        <button onClick={() => navigate('/blog')} className="btn-back">
          Back to Blog
        </button>
        <style jsx>{`
          .blog-not-found {
            text-align: center;
            padding: 4rem 2rem;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2rem;
          }
          .blog-not-found h2 {
            font-size: 2rem;
            color: #1f2937;
          }
          .btn-back {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
          }
          .btn-back:hover {
            background: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <article className="blog-detail">
      <Navbar onSearch={handleNavbarSearch} onRefresh={handleRefresh} />
      
      <div className="blog-header">
        <button className="btn-back" onClick={() => navigate('/blog')}>
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div className="blog-hero">
        {post.image && (
          <img 
            src={post.image} 
            alt={post.title}
            className="blog-hero-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="blog-hero-overlay"></div>
        
        <div className="blog-hero-content">
          <div className="blog-category-badge">
            {post.category?.Category || 'Uncategorized'}
          </div>
          <h1 className="blog-title">{post.title}</h1>
          
          <div className="blog-meta">
            <div className="meta-item">
              <User size={16} />
              <span>{post.author || 'Unknown'}</span>
            </div>
            <div className="meta-item">
              <Calendar size={16} />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>{calculateReadTime(post.content)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="blog-container">
        <div className="blog-content-wrapper">
          <div className="blog-main-content">
            <div className="blog-body">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p>No content available</p>
              )}
            </div>

            <div className="blog-tags">
              {Array.isArray(post.tag) && post.tag.length > 0 && (
                <>
                  <h3>Tags</h3>
                  <div className="tags-list">
                    {post.tag.map(tag => (
                      <a key={tag} href={`/tag/${tag}`} className="tag-link">
                        #{tag}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="blog-actions">
              <button 
                className={`action-btn ${liked ? 'liked' : ''}`}
                onClick={() => setLiked(!liked)}
              >
                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                <span>{liked ? 'Liked' : 'Like'}</span>
              </button>
              <button className="action-btn">
                <MessageCircle size={20} />
                <span>Comment</span>
              </button>
              <button className="action-btn">
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>
          </div>

          <aside className="blog-sidebar">
            <div className="sidebar-box author-box">
              <h3>About Author</h3>
              <div className="author-content">
                <div className="author-avatar">{post.author?.[0]?.toUpperCase()}</div>
                <div className="author-info">
                  <h4>{post.author || 'Unknown Author'}</h4>
                  <p>Passionate about sharing knowledge and insights.</p>
                </div>
              </div>
            </div>

            {relatedPosts.length > 0 && (
              <div className="sidebar-box related-box">
                <h3>Related Posts</h3>
                <div className="related-posts-list">
                  {relatedPosts.map(relPost => (
                    <a 
                      key={relPost.id} 
                      href={`/blog/${relPost.slug}`}
                      className="related-post-item"
                    >
                      <h4>{relPost.title}</h4>
                      <p className="related-post-date">{formatDate(relPost.created_at)}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <style jsx>{`
        .blog-detail {
          min-height: 100vh;
          background: #f9fafb;
          animation: fadeIn 0.6s ease-out;
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

        .blog-header {
          padding: 1.5rem 2rem;
          max-width: 1280px;
          margin: 0 auto;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          color: #3b82f6;
          border: 1px solid #e5e7eb;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }

        .btn-back:hover {
          background: #3b82f6;
          color: white;
          transform: translateX(-4px);
        }

        .blog-hero {
          position: relative;
          height: 400px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }

        .blog-hero-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: zoomIn 0.8s ease-out;
        }

        @keyframes zoomIn {
          from {
            transform: scale(1.1);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .blog-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        }

        .blog-hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          padding: 3rem 2rem;
          max-width: 1280px;
          margin: 0 auto;
          color: white;
          animation: slideUp 0.6s ease-out 0.2s both;
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

        .blog-category-badge {
          display: inline-block;
          background: white;
          color: #667eea;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .blog-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .blog-meta {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .blog-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .blog-content-wrapper {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 3rem;
        }

        .blog-main-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          animation: slideInLeft 0.6s ease-out;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .blog-body {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #374151;
          margin-bottom: 3rem;
        }

        .blog-body h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin: 2rem 0 1rem;
        }

        .blog-body h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #374151;
          margin: 1.5rem 0 0.75rem;
        }

        .blog-body p {
          margin-bottom: 1rem;
        }

        .blog-body ul, .blog-body ol {
          margin: 1rem 0 1rem 2rem;
        }

        .blog-body li {
          margin-bottom: 0.5rem;
        }

        .blog-body a {
          color: #3b82f6;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .blog-body a:hover {
          color: #2563eb;
        }

        .blog-body code {
          background: #f3f4f6;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.95rem;
        }

        .blog-body pre {
          background: #1f2937;
          color: #e5e7eb;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .blog-tags {
          border-top: 1px solid #e5e7eb;
          padding-top: 2rem;
          margin-top: 2rem;
        }

        .blog-tags h3 {
          font-size: 1rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .tag-link {
          background: #f3f4f6;
          color: #4b5563;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.3s;
          display: inline-block;
        }

        .tag-link:hover {
          background: #3b82f6;
          color: white;
          transform: translateY(-2px);
        }

        .blog-actions {
          display: flex;
          gap: 1rem;
          border-top: 1px solid #e5e7eb;
          padding-top: 2rem;
          margin-top: 2rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          cursor: pointer;
          color: #6b7280;
          font-weight: 500;
          transition: all 0.3s;
        }

        .action-btn:hover {
          background: #f9fafb;
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-2px);
        }

        .action-btn.liked {
          background: #fee2e2;
          color: #dc2626;
          border-color: #dc2626;
        }

        .blog-sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          animation: slideInRight 0.6s ease-out;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .sidebar-box {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .sidebar-box h3 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .author-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .author-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .author-info h4 {
          font-size: 1rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .author-info p {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .related-posts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .related-post-item {
          padding: 1rem;
          border-left: 3px solid #3b82f6;
          border-radius: 4px;
          background: #f9fafb;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s;
          display: block;
        }

        .related-post-item:hover {
          background: #eff6ff;
          transform: translateX(4px);
        }

        .related-post-item h4 {
          font-size: 0.95rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .related-post-date {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        @media (max-width: 768px) {
          .blog-hero-content {
            padding: 1.5rem 1rem;
          }

          .blog-title {
            font-size: 1.75rem;
          }

          .blog-meta {
            gap: 1rem;
          }

          .blog-content-wrapper {
            grid-template-columns: 1fr;
          }

          .blog-main-content {
            padding: 1.5rem;
          }

          .blog-body {
            font-size: 1rem;
          }

          .blog-actions {
            flex-direction: column;
          }

          .action-btn {
            justify-content: center;
          }
        }
      `}</style>
    </article>
  );
}

export default BlogDetail;
