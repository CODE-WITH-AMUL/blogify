import React from 'react';

function Footer({ categories }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-main">Code With Amul</span>
          </div>
          <p>A community-driven blog for modern web developers.</p>
          <div className="social-links">
            {['Twitter', 'GitHub', 'Discord', 'LinkedIn'].map((platform) => (
              <a key={platform} href="#" className="social-link">
                {platform}
              </a>
            ))}
          </div>
        </div>
        
        <div className="footer-links">
          <div className="link-column">
            <h4>Content</h4>
            {['Blog', 'Coding', 'Programming', 'Newsletter'].map((link) => (
              <a key={link} href="#">{link}</a>
            ))}
          </div>
          <div className="link-column">
            <h4>Topics</h4>
            {Array.isArray(categories) && categories.slice(0, 5).map((cat) => (
              <a key={cat?.name} href={`/category/${cat?.name?.toLowerCase() || ''}`}>
                {cat?.name}
              </a>
            ))}
          </div>
          <div className="link-column">
            <h4>Company</h4>
            {['About', 'Team', 'Contact', 'Write for Us'].map((link) => (
              <a key={link} href="#">{link}</a>
            ))}
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2025 Code With Amul All rights reserved</p>
        <div className="footer-meta">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          padding: 4rem 2rem 2rem;
        }

        .footer-content {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
          margin-bottom: 3rem;
        }

        .footer-brand p {
          color: #6b7280;
          margin: 1rem 0;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          color: #4b5563;
          text-decoration: none;
          font-size: 0.875rem;
        }

        .social-link:hover {
          color: #3b82f6;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .link-column h4 {
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .link-column a {
          display: block;
          color: #6b7280;
          text-decoration: none;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }

        .link-column a:hover {
          color: #3b82f6;
        }

        .footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .footer-meta {
          display: flex;
          gap: 1.5rem;
        }

        .footer-meta a {
          color: #6b7280;
          text-decoration: none;
        }

        .footer-meta a:hover {
          color: #3b82f6;
        }

        @media (max-width: 1024px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        @media (max-width: 768px) {
          .footer-links {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .footer-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;