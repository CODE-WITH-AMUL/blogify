import React from 'react';
import { User, Twitter, Github, Globe } from 'lucide-react';

const AuthorBio = ({ author }) => {
  const authorData = {
    name: author || 'Code With Amul',
    bio: 'Passionate about creating educational programming content. Sharing knowledge through tutorials, guides, and real-world projects.',
    role: 'Technical Writer & Developer',
    social: {
      twitter: '#',
      github: '#',
      website: '#'
    }
  };

  return (
    <>
      <div className="author-bio">
        <div className="author-header">
          <div className="author-avatar-large">
            <User size={28} />
          </div>
          <div className="author-info">
            <h3>{authorData.name}</h3>
            <p className="author-role">{authorData.role}</p>
          </div>
        </div>
        <p className="author-description">{authorData.bio}</p>
        <div className="author-social">
          <a href={authorData.social.twitter} aria-label="Twitter">
            <Twitter size={20} />
          </a>
          <a href={authorData.social.github} aria-label="GitHub">
            <Github size={20} />
          </a>
          <a href={authorData.social.website} aria-label="Website">
            <Globe size={20} />
          </a>
        </div>
      </div>

      <style jsx>{`
        .author-bio {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid #e2e8f0;
          padding: 2rem;
          border-radius: 12px;
          margin-top: 3rem;
          animation: slideUp 0.4s ease-out;
        }

        :global([data-theme="dark"]) .author-bio {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-color: #334155;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .author-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .author-avatar-large {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }

        .author-info {
          display: flex;
          flex-direction: column;
        }

        .author-info h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        :global([data-theme="dark"]) .author-info h3 {
          color: #f1f5f9;
        }

        .author-role {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0.25rem 0 0;
        }

        :global([data-theme="dark"]) .author-role {
          color: #cbd5e1;
        }

        .author-description {
          color: #374151;
          line-height: 1.6;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        :global([data-theme="dark"]) .author-description {
          color: #cbd5e1;
        }

        .author-social {
          display: flex;
          gap: 1rem;
        }

        .author-social a {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          color: #6b7280;
          transition: all 0.3s ease;
          background: white;
        }

        :global([data-theme="dark"]) .author-social a {
          background: #334155;
          border-color: #475569;
          color: #cbd5e1;
        }

        .author-social a:hover {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }

        @media (max-width: 640px) {
          .author-bio {
            padding: 1.5rem;
            margin-top: 2rem;
          }

          .author-header {
            gap: 1rem;
          }

          .author-avatar-large {
            width: 60px;
            height: 60px;
          }

          .author-info h3 {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </>
  );
};

export default AuthorBio;
