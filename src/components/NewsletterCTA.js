import React from 'react';
import { MessageCircle } from 'lucide-react';

function NewsletterCTA({ onSubscribe, email, setEmail }) {
  return (
    <section className="newsletter-cta">
      <div className="cta-content">
        <div className="cta-icon">
          <MessageCircle size={48} />
        </div>
        <h2>Never Miss a Post</h2>
        <p>Join 15,000+ developers who receive our weekly newsletter with the latest articles, tutorials, and coding tips.</p>
        <form onSubmit={onSubscribe} className="cta-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn-cta">
            Subscribe Now
          </button>
        </form>
      </div>

      <style jsx>{`
        .newsletter-cta {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: white;
          padding: 4rem 2rem;
          margin: 4rem 0;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }

        .cta-icon {
          margin: 0 auto 1.5rem;
          color: #3b82f6;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .cta-content p {
          color: #cbd5e1;
          font-size: 1.125rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .cta-form {
          display: flex;
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .cta-form input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid #475569;
          background: transparent;
          border-radius: 6px;
          color: white;
          font-size: 1rem;
        }

        .cta-form input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .btn-cta {
          padding: 0.75rem 2rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cta:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .cta-form {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}

export default NewsletterCTA;