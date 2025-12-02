import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Clock, 
  Calendar, 
  Bookmark,
  Eye,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
  Tag,
  ChevronRight,
  Mail,
  Printer
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { fetchAllPosts } from '../middleware/api';
import { formatDate, calculateReadTime } from '../middleware/helpers';
import LoadingSpinner from '../config/LoadingSpinner';
import TableOfContents from '../components/TableOfContents';
import AuthorBio from '../components/AuthorBio';
import RelatedPosts from '../components/RelatedPosts';
import CommentsSection from '../components/CommentsSection';
import '../static/style/main.css';

function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

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
            .filter(p => p.id !== foundPost.id && (
              p.category?.Category === foundPost.category?.Category ||
              (Array.isArray(p.tag) && Array.isArray(foundPost.tag) && 
               p.tag.some(tag => foundPost.tag.includes(tag)))
            ))
            .slice(0, 4);
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

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.pageYOffset;
      const progress = (scrolled / documentHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || '';
    const text = post?.content?.substring(0, 100) || '';

    switch(platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'mail':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${text}\n\nRead more: ${url}`)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
      case 'print':
        window.print();
        break;
    }
    setShareMenuOpen(false);
  };

  if (loading) {
    return <LoadingSpinner message="Loading article..." />;
  }

  if (!post) {
    return (
      <div className="blog-not-found">
        <Helmet>
          <title>Article Not Found | Code With Amul</title>
        </Helmet>
        <div className="not-found-content">
          <h1>404 - Article Not Found</h1>
          <p>The article you're looking for doesn't exist or has been moved.</p>
          <div className="action-buttons">
            <button onClick={() => navigate('/blog')} className="btn-primary">
              <ArrowLeft size={20} />
              Browse All Articles
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const estimatedReadTime = calculateReadTime(post.content);
  const formattedDate = formatDate(post.created_at);
  const authorInitial = post.author?.[0]?.toUpperCase() || 'A';

  return (
    <>
      <Helmet>
        <title>{post.title} | Code With Amul</title>
        <meta name="description" content={post.content?.substring(0, 160) || 'Programming tutorial and guide'} />
        <meta name="keywords" content={Array.isArray(post.tag) ? post.tag.join(', ') : 'programming, coding'} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content?.substring(0, 300) || ''} />
        <meta property="og:type" content="article" />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="article:published_time" content={post.created_at} />
        <meta property="article:author" content={post.author} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.content?.substring(0, 200) || ''} />
        {post.image && <meta name="twitter:image" content={post.image} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.content?.substring(0, 200),
            "image": post.image || '',
            "datePublished": post.created_at,
            "dateModified": post.updated_at || post.created_at,
            "author": {
              "@type": "Person",
              "name": post.author || "Code With Amul"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Code With Amul",
              "logo": {
                "@type": "ImageObject",
                "url": "/logo.png"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="blog-detail-page">
        {/* Reading Progress Bar */}
        {readingProgress > 0 && (
          <div className="reading-progress">
            <div 
              className="progress-bar" 
              style={{ width: `${readingProgress}%` }}
              aria-hidden="true"
            />
          </div>
        )}

        <Navbar onSearch={handleNavbarSearch} onRefresh={handleRefresh} />
        
        {/* Sticky Navigation */}
        <nav className="article-navigation">
          <div className="container">
            <div className="nav-content">
              <button 
                className="back-btn" 
                onClick={() => navigate('/blog')}
                aria-label="Back to blog"
              >
                <ArrowLeft size={20} />
                <span className="btn-text">All Articles</span>
              </button>
              
              <div className="nav-actions">
                <button 
                  className={`nav-action-btn ${bookmarked ? 'active' : ''}`}
                  onClick={() => setBookmarked(!bookmarked)}
                  aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
                >
                  <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'} />
                  <span className="action-text">Save</span>
                </button>
                
                <div className="share-dropdown">
                  <button 
                    className="nav-action-btn"
                    onClick={() => setShareMenuOpen(!shareMenuOpen)}
                    aria-label="Share article"
                    aria-expanded={shareMenuOpen}
                  >
                    <Share2 size={20} />
                    <span className="action-text">Share</span>
                  </button>
                  {shareMenuOpen && (
                    <div className="share-menu">
                      <button onClick={() => handleShare('copy')} className="share-option">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                      <button onClick={() => handleShare('twitter')} className="share-option">
                        <Twitter size={16} />
                        Twitter
                      </button>
                      <button onClick={() => handleShare('facebook')} className="share-option">
                        <Facebook size={16} />
                        Facebook
                      </button>
                      <button onClick={() => handleShare('linkedin')} className="share-option">
                        <Linkedin size={16} />
                        LinkedIn
                      </button>
                      <button onClick={() => handleShare('mail')} className="share-option">
                        <Mail size={16} />
                        Email
                      </button>
                      <button onClick={() => handleShare('print')} className="share-option">
                        <Printer size={16} />
                        Print
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Article Header */}
        <header className="article-header">
          <div className="container">
            <div className="article-meta">
              <span className="category-badge">
                {post.category?.Category || 'Programming'}
              </span>
              <time className="publish-date" dateTime={post.created_at}>
                <Calendar size={16} />
                {formattedDate}
              </time>
              <span className="read-time">
                <Clock size={16} />
                {estimatedReadTime}
              </span>
              <span className="views">
                <Eye size={16} />
                {post.views || '1.2k'} views
              </span>
            </div>
            
            <h1 className="article-title">{post.title}</h1>
            
            <div className="author-preview">
              <div className="author-avatar">{authorInitial}</div>
              <div className="author-details">
                <span className="author-name">{post.author || 'Code With Amul'}</span>
                <span className="author-role">Technical Writer</span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Hero Image */}
        {post.image && (
          <div className="article-hero">
            <div className="container">
              <img 
                src={post.image} 
                alt={post.title}
                className="hero-image"
                loading="eager"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <figcaption className="image-caption">
                {post.image_caption || 'Featured image for this article'}
              </figcaption>
            </div>
          </div>
        )}

        <main className="article-content" role="main">
          <div className="container">
            <div className="content-layout">
              {/* Main Content */}
              <article className="main-article">
                <div className="content-wrapper">
                  {post.content ? (
                    <div 
                      className="article-body"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  ) : (
                    <p className="no-content">Content coming soon...</p>
                  )}
                  
                  {/* Article Tags */}
                  {Array.isArray(post.tag) && post.tag.length > 0 && (
                    <div className="article-tags">
                      <h3 className="tags-title">
                        <Tag size={18} />
                        Topics
                      </h3>
                      <div className="tags-list">
                        {post.tag.map(tag => (
                          <a 
                            key={tag} 
                            href={`/blog?tag=${encodeURIComponent(tag)}`}
                            className="tag-item"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/blog?tag=${encodeURIComponent(tag)}`);
                            }}
                          >
                            #{tag}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Article Actions */}
                <div className="article-actions">
                  <div className="engagement-buttons">
                    <button 
                      className={`engagement-btn ${liked ? 'liked' : ''}`}
                      onClick={() => setLiked(!liked)}
                      aria-label={liked ? 'Unlike article' : 'Like article'}
                    >
                      <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                      <span>{liked ? 'Liked' : 'Like'}</span>
                    </button>
                    <a href="#comments" className="engagement-btn">
                      <MessageCircle size={20} />
                      <span>Comment</span>
                    </a>
                  </div>
                  
                  <div className="share-section">
                    <span className="share-label">Share:</span>
                    <div className="share-buttons">
                      <button onClick={() => handleShare('twitter')} className="social-share twitter">
                        <Twitter size={18} />
                      </button>
                      <button onClick={() => handleShare('facebook')} className="social-share facebook">
                        <Facebook size={18} />
                      </button>
                      <button onClick={() => handleShare('linkedin')} className="social-share linkedin">
                        <Linkedin size={18} />
                      </button>
                      <button onClick={() => handleShare('copy')} className="social-share copy">
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Author Bio */}
                <AuthorBio author={post.author} />
                
                {/* Comments Section */}
                <CommentsSection postId={post.id} />
              </article>

              {/* Sidebar */}
              <aside className="article-sidebar" aria-label="Article details">
                {/* Table of Contents */}
                {post.content && post.content.length > 1000 && (
                  <TableOfContents content={post.content} />
                )}
                
                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <RelatedPosts posts={relatedPosts} />
                )}
                
                {/* Newsletter CTA */}
                <div className="sidebar-cta">
                  <h3>Stay Updated</h3>
                  <p>Get weekly programming tutorials and tips</p>
                  <button className="cta-btn">
                    <Mail size={16} />
                    Subscribe to Newsletter
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </main>

        {/* Next/Previous Navigation */}
        <nav className="article-navigation-footer">
          <div className="container">
            <div className="nav-links">
              <button className="nav-link prev" onClick={() => navigate('/blog')}>
                <ArrowLeft size={18} />
                <span>Back to Articles</span>
              </button>
              <button 
                className="nav-link next" 
                onClick={() => {
                  if (relatedPosts[0]) {
                    navigate(`/blog/${relatedPosts[0].slug}`);
                  }
                }}
              >
                <span>Next: {relatedPosts[0]?.title || 'More Articles'}</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </nav>
      </div>

      <style jsx>{`
        .blog-detail-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .reading-progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #e5e7eb;
          z-index: 1000;
          width: 100%;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.2s ease;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* Sticky Navigation */
        .article-navigation {
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e5e7eb;
          z-index: 900;
          padding: 0.75rem 0;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          color: #4b5563;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .btn-text {
          display: inline-block;
        }

        .nav-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .nav-action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          color: #4b5563;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .nav-action-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .nav-action-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .action-text {
          display: inline-block;
        }

        .share-dropdown {
          position: relative;
        }

        .share-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.5rem;
          min-width: 160px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          margin-top: 0.5rem;
          animation: slideDown 0.2s ease;
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

        .share-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          color: #4b5563;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .share-option:hover {
          background: #f3f4f6;
        }

        /* Article Header */
        .article-header {
          padding: 3rem 0 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid #e5e7eb;
        }

        .article-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .article-meta > * {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .category-badge {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.75rem;
        }

        .article-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 2rem;
          color: #1f2937;
          background: linear-gradient(135deg, #1e293b, #475569);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .author-preview {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .author-details {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 1rem;
        }

        .author-role {
          color: #6b7280;
          font-size: 0.875rem;
        }

        /* Article Hero Image */
        .article-hero {
          padding: 2rem 0;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .hero-image {
          width: 100%;
          max-height: 500px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          animation: zoomIn 0.6s ease-out;
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .image-caption {
          text-align: center;
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 0.75rem;
          font-style: italic;
        }

        /* Main Content Layout */
        .article-content {
          padding: 3rem 0;
        }

        .content-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 3rem;
        }

        /* Main Article */
        .main-article {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .content-wrapper {
          margin-bottom: 3rem;
        }

        .article-body {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #374151;
        }

        .article-body h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin: 2.5rem 0 1.25rem;
          padding-top: 1rem;
          border-top: 2px solid #f3f4f6;
        }

        .article-body h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin: 2rem 0 1rem;
        }

        .article-body p {
          margin-bottom: 1.5rem;
        }

        .article-body ul, .article-body ol {
          margin: 1.5rem 0 1.5rem 2rem;
        }

        .article-body li {
          margin-bottom: 0.75rem;
        }

        .article-body a {
          color: #3b82f6;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s;
        }

        .article-body a:hover {
          color: #2563eb;
        }

        .article-body code {
          background: #f3f4f6;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
          font-size: 0.95rem;
          color: #1f2937;
        }

        .article-body pre {
          background: #1f2937;
          color: #e5e7eb;
          padding: 1.5rem;
          border-radius: 12px;
          overflow-x: auto;
          margin: 1.5rem 0;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .article-body blockquote {
          border-left: 4px solid #3b82f6;
          padding: 1rem 1.5rem;
          margin: 2rem 0;
          background: #f0f9ff;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #1e40af;
        }

        .no-content {
          text-align: center;
          color: #9ca3af;
          padding: 3rem;
          font-size: 1.125rem;
          border: 2px dashed #e5e7eb;
          border-radius: 12px;
        }

        /* Article Tags */
        .article-tags {
          margin: 3rem 0;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .tags-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .tag-item {
          background: #f3f4f6;
          color: #4b5563;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.2s;
          display: inline-block;
          border: 1px solid #e5e7eb;
        }

        .tag-item:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        /* Article Actions */
        .article-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          margin: 3rem 0;
        }

        .engagement-buttons {
          display: flex;
          gap: 1rem;
        }

        .engagement-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 2px solid #e5e7eb;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          cursor: pointer;
          color: #6b7280;
          font-weight: 600;
          transition: all 0.2s;
          text-decoration: none;
        }

        .engagement-btn:hover {
          background: #f9fafb;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .engagement-btn.liked {
          background: #fee2e2;
          color: #dc2626;
          border-color: #dc2626;
        }

        .share-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .share-label {
          color: #6b7280;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .share-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .social-share {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .social-share:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .social-share.twitter:hover {
          background: #1da1f2;
          color: white;
          border-color: #1da1f2;
        }

        .social-share.facebook:hover {
          background: #1877f2;
          color: white;
          border-color: #1877f2;
        }

        .social-share.linkedin:hover {
          background: #0077b5;
          color: white;
          border-color: #0077b5;
        }

        .social-share.copy:hover {
          background: #10b981;
          color: white;
          border-color: #10b981;
        }

        /* Article Sidebar */
        .article-sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .sidebar-cta {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: white;
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
        }

        .sidebar-cta h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .sidebar-cta p {
          color: #cbd5e1;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .cta-btn {
          width: 100%;
          padding: 0.75rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .cta-btn:hover {
          background: #2563eb;
          transform: translateY(-2px);
        }

        /* Next/Previous Navigation */
        .article-navigation-footer {
          padding: 3rem 0;
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
        }

        .nav-links {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          border: 2px solid #e5e7eb;
          padding: 1rem 1.5rem;
          border-radius: 10px;
          color: #4b5563;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 200px;
        }

        .nav-link:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .nav-link.prev {
          justify-content: flex-start;
        }

        .nav-link.next {
          justify-content: flex-end;
          text-align: right;
        }

        /* Not Found Page */
        .blog-not-found {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 2rem;
        }

        .not-found-content {
          text-align: center;
          max-width: 500px;
        }

        .not-found-content h1 {
          font-size: 2.5rem;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .not-found-content p {
          color: #6b7280;
          margin-bottom: 2rem;
          font-size: 1.125rem;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn-primary, .btn-secondary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: transparent;
          border-color: #e5e7eb;
          color: #4b5563;
        }

        .btn-secondary:hover {
          background: #f3f4f6;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .article-title {
            font-size: 2.5rem;
          }
          
          .content-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .article-sidebar {
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .article-navigation {
            position: static;
          }
          
          .btn-text, .action-text {
            display: none;
          }
          
          .article-title {
            font-size: 2rem;
          }
          
          .article-header {
            padding: 2rem 0 1.5rem;
          }
          
          .main-article {
            padding: 1.5rem;
          }
          
          .article-body {
            font-size: 1rem;
          }
          
          .article-body h2 {
            font-size: 1.5rem;
          }
          
          .article-actions {
            flex-direction: column;
            gap: 1.5rem;
            align-items: stretch;
          }
          
          .share-section {
            justify-content: center;
          }
          
          .nav-links {
            flex-direction: column;
            gap: 1rem;
          }
          
          .nav-link {
            width: 100%;
            min-width: auto;
          }
          
          .hero-image {
            max-height: 300px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 1rem;
          }
          
          .article-title {
            font-size: 1.75rem;
          }
          
          .article-meta {
            gap: 1rem;
          }
          
          .article-hero {
            padding: 1rem 0;
          }
          
          .main-article {
            padding: 1rem;
          }
          
          .article-content {
            padding: 2rem 0;
          }
          
          .engagement-buttons {
            flex-direction: column;
          }
        }

        /* Dark Mode Support */
        :global([data-theme="dark"]) .blog-detail-page {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
        }
        
        :global([data-theme="dark"]) .article-navigation {
          background: rgba(30, 41, 59, 0.95);
          border-bottom-color: #334155;
        }
        
        :global([data-theme="dark"]) .main-article {
          background: #1e293b;
          border-color: #334155;
        }
        
        :global([data-theme="dark"]) .article-title {
          background: linear-gradient(135deg, #f1f5f9, #cbd5e1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        :global([data-theme="dark"]) .article-body {
          color: #cbd5e1;
        }
        
        :global([data-theme="dark"]) .author-name {
          color: #cbd5e1;
        }
        
        :global([data-theme="dark"]) .article-body h2,
        :global([data-theme="dark"]) .article-body h3 {
          color: #f1f5f9;
          border-top-color: #334155;
        }
        
        :global([data-theme="dark"]) .article-body code {
          background: #334155;
          color: #e2e8f0;
        }
        
        :global([data-theme="dark"]) .article-body pre {
          background: #0f172a;
        }
        
        :global([data-theme="dark"]) .article-body a {
          color: #60a5fa;
        }
        
        :global([data-theme="dark"]) .article-body blockquote {
          background: #1e293b;
          color: #60a5fa;
          border-left-color: #3b82f6;
        }
        
        :global([data-theme="dark"]) .tag-item {
          background: #334155;
          color: #cbd5e1;
          border-color: #475569;
        }
        
        :global([data-theme="dark"]) .tag-item:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        :global([data-theme="dark"]) .engagement-btn {
          background: #1e293b;
          border-color: #475569;
          color: #cbd5e1;
        }
        
        :global([data-theme="dark"]) .engagement-btn:hover {
          background: #334155;
          border-color: #3b82f6;
          color: #3b82f6;
        }
        
        :global([data-theme="dark"]) .article-tags {
          border-top-color: #334155;
        }
        
        :global([data-theme="dark"]) .tags-title {
          color: #cbd5e1;
        }
        
        :global([data-theme="dark"]) .share-menu {
          background: #1e293b;
          border-color: #475569;
        }
        
        :global([data-theme="dark"]) .share-option {
          color: #cbd5e1;
        }
        
        :global([data-theme="dark"]) .share-option:hover {
          background: #334155;
        }
        
        :global([data-theme="dark"]) .back-btn {
          border-color: #475569;
          color: #cbd5e1;
        }
        
        :global([data-theme="dark"]) .back-btn:hover {
          background: #334155;
          border-color: #3b82f6;
        }
        
        :global([data-theme="dark"]) .nav-action-btn {
          border-color: #475569;
          color: #cbd5e1;
        }
        
        :global([data-theme="dark"]) .nav-action-btn:hover {
          background: #334155;
          border-color: #3b82f6;
        }
        
        :global([data-theme="dark"]) .nav-link {
          background: #1e293b;
          border-color: #475569;
          color: #cbd5e1;
        }
        
        :global([data-theme="dark"]) .nav-link:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        :global([data-theme="dark"]) .article-header {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-bottom-color: #334155;
        }
        
        :global([data-theme="dark"]) .article-meta {
          color: #cbd5e1;
        }
        
        :global([data-theme="dark"]) .author-role {
          color: #cbd5e1;
        }
        
        :global([data-theme="dark"]) .article-hero {
          background: #1e293b;
          border-bottom-color: #334155;
        }
        
        :global([data-theme="dark"]) .blog-not-found {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }
        
        :global([data-theme="dark"]) .not-found-content h1 {
          color: #f1f5f9;
        }
        
        :global([data-theme="dark"]) .not-found-content p {
          color: #94a3b8;
        }
        
        :global([data-theme="dark"]) .btn-secondary {
          border-color: #475569;
          color: #cbd5e1;
        }
        
        :global([data-theme="dark"]) .btn-secondary:hover {
          background: #334155;
        }
        
        :global([data-theme="dark"]) .article-navigation-footer {
          background: #0f172a;
          border-top-color: #334155;
        }
        
        :global([data-theme="dark"]) .sidebar-cta {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }
        
        :global([data-theme="dark"]) .article-content {
          background: transparent;
        }

        /* Print Styles */
        @media print {
          .article-navigation,
          .article-actions,
          .article-sidebar,
          .article-navigation-footer,
          .reading-progress {
            display: none;
          }
          
          .article-title {
            font-size: 2rem;
            -webkit-text-fill-color: black;
            color: black;
          }
          
          .article-body {
            font-size: 12pt;
            line-height: 1.5;
          }
          
          .main-article {
            box-shadow: none;
            border: none;
            padding: 0;
          }
          
          .article-content {
            padding: 0;
          }
          
          .container {
            max-width: 100%;
            padding: 0;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}

export default BlogDetail;