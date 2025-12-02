import React, { useState } from 'react';
import { Hash, ChevronDown } from 'lucide-react';

const TableOfContents = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const extractHeadings = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const headings = tempDiv.querySelectorAll('h2, h3');
    return Array.from(headings).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent,
      level: heading.tagName.toLowerCase(),
      element: heading
    }));
  };

  const headings = extractHeadings(content);

  if (headings.length === 0) return null;

  return (
    <>
      <div className={`table-of-contents ${isExpanded ? 'expanded' : ''}`}>
        <button 
          className="toc-header"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <Hash size={18} />
          <span>Table of Contents</span>
          <ChevronDown size={18} className={`chevron ${isExpanded ? 'expanded' : ''}`} />
        </button>
        {isExpanded && (
          <nav className="toc-content">
            <ul>
              {headings.map((heading) => (
                <li key={heading.id} className={`toc-item level-${heading.level}`}>
                  <a href={`#${heading.id}`} onClick={(e) => {
                    e.preventDefault();
                    heading.element.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <style jsx>{`
        .table-of-contents {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          position: sticky;
          top: 100px;
          animation: slideIn 0.4s ease-out;
        }

        :global([data-theme="dark"]) .table-of-contents {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-color: #334155;
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

        .toc-header {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 600;
          color: #1f2937;
          text-align: left;
          transition: all 0.2s;
        }

        :global([data-theme="dark"]) .toc-header {
          color: #f1f5f9;
        }

        .toc-header:hover {
          background: rgba(59, 130, 246, 0.05);
        }

        :global([data-theme="dark"]) .toc-header:hover {
          background: rgba(59, 130, 246, 0.1);
        }

        .chevron {
          transition: transform 0.3s ease;
          color: #6b7280;
        }

        :global([data-theme="dark"]) .chevron {
          color: #cbd5e1;
        }

        .chevron.expanded {
          transform: rotate(180deg);
        }

        .toc-content {
          padding: 0 1rem 1rem;
          animation: slideDown 0.3s ease-out;
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

        .toc-content ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .toc-item {
          margin-bottom: 0.5rem;
        }

        .toc-item.level-h3 {
          margin-left: 1.5rem;
        }

        .toc-item a {
          display: block;
          padding: 0.5rem 0;
          color: #3b82f6;
          text-decoration: none;
          font-size: 0.9rem;
          line-height: 1.5;
          transition: all 0.2s;
          border-left: 2px solid transparent;
          padding-left: 0.75rem;
          margin-left: -0.75rem;
        }

        :global([data-theme="dark"]) .toc-item a {
          color: #60a5fa;
        }

        .toc-item a:hover {
          color: #2563eb;
          border-left-color: #2563eb;
          font-weight: 500;
        }

        :global([data-theme="dark"]) .toc-item a:hover {
          color: #93c5fd;
          border-left-color: #93c5fd;
        }

        @media (max-width: 1024px) {
          .table-of-contents {
            position: static;
            margin-bottom: 2rem;
          }
        }

        @media (max-width: 640px) {
          .toc-item.level-h3 {
            margin-left: 0.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default TableOfContents;
