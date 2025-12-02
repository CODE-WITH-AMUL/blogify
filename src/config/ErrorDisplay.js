import React from 'react';
import { AlertCircle } from 'lucide-react';

function ErrorDisplay({ message }) {
  return (
    <div className="error-display">
      <div className="error-container">
        <AlertCircle size={24} className="error-icon" />
        <div className="error-content">
          <p className="error-message">{message}</p>
          <p className="error-subtitle">Using mock data for demonstration.</p>
        </div>
        <button 
          className="error-dismiss" 
          onClick={() => window.location.reload()}
          title="Refresh page"
        >
          ⟳
        </button>
      </div>

      <style jsx>{`
        .error-display {
          position: sticky;
          top: 0;
          z-index: 9999;
          animation: slideDown 0.3s ease-out;
        }

        .error-container {
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          border: 1px solid #fecaca;
          border-radius: 8px;
          margin: 1rem auto;
          max-width: 1280px;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.1);
        }

        .error-icon {
          color: #dc2626;
          flex-shrink: 0;
        }

        .error-content {
          flex: 1;
        }

        .error-message {
          color: #991b1b;
          font-weight: 600;
          margin-bottom: 0.25rem;
          font-size: 0.95rem;
        }

        .error-subtitle {
          color: #b91c1c;
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .error-dismiss {
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 6px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .error-dismiss:hover {
          background: #b91c1c;
          transform: rotate(90deg);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .error-container {
            margin: 1rem;
            padding: 0.75rem 1rem;
          }

          .error-content {
            text-align: center;
          }

          .error-message {
            font-size: 0.9rem;
          }

          .error-subtitle {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ErrorDisplay;