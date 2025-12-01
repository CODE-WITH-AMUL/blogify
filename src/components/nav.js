import React, { useState } from 'react';
import { Search, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <div className="logo">
            <span className="logo-main">CodeWithAmul</span>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search articles, tutorials, guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <ul className="nav-menu">
            <li><a href="#home" className="nav-link active">Home</a></li>
            <li><a href="#blog" className="nav-link">Blog</a></li>
            <li><a href="#tutorials" className="nav-link">Tutorials</a></li>
            <li><a href="#projects" className="nav-link">Projects</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>

          {/* User Actions */}
          <div className="nav-actions">
            <button className="btn-login">
              <User size={18} />
              <span>Login</span>
            </button>
            <button className="btn-primary">Get Started</button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-search">
            <form onSubmit={handleSearch} className="mobile-search-form">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          
          <ul className="mobile-nav-menu">
            <li><a href="#home" className="mobile-nav-link active">Home</a></li>
            <li><a href="#blog" className="mobile-nav-link">Blog</a></li>
            <li><a href="#tutorials" className="mobile-nav-link">Tutorials</a></li>
            <li><a href="#projects" className="mobile-nav-link">Projects</a></li>
            <li><a href="#about" className="mobile-nav-link">About</a></li>
            <li><a href="#contact" className="mobile-nav-link">Contact</a></li>
          </ul>

          <div className="mobile-actions">
            <button className="btn-login-mobile">
              <User size={18} />
              <span>Login</span>
            </button>
            <button className="btn-primary-mobile">Get Started</button>
          </div>
        </div>
      </nav>

      <style jsx>{`
        /* Navbar Base Styles */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          z-index: 1000;
          border-bottom: 1px solid #f0f0f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          padding: 1rem 0;
          transition: all 0.3s ease;
        }

        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        /* Logo Styles */
        .logo {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .logo-main {
          color: #1a1a1a;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-dot {
          color: #3b82f6;
          font-size: 2rem;
          line-height: 1;
        }

        /* Search Bar Styles */
        .search-container {
          flex: 1;
          max-width: 500px;
        }

        .search-form {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: #666;
          transition: color 0.2s;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.95rem;
          background: #f9fafb;
          transition: all 0.2s;
          outline: none;
        }

        .search-input:focus {
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        /* Desktop Navigation Menu */
        .nav-menu {
          display: flex;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          color: #4b5563;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.5rem 0;
          position: relative;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #3b82f6;
        }

        .nav-link.active {
          color: #3b82f6;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #3b82f6;
          border-radius: 2px;
        }

        /* User Actions */
        .nav-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-shrink: 0;
        }

        .btn-login {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.5rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #4b5563;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-login:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .btn-primary {
          padding: 0.5rem 1.5rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        /* Mobile Menu Toggle */
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #4b5563;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .mobile-menu-toggle:hover {
          background: #f3f4f6;
        }

        /* Mobile Menu */
        .mobile-menu {
          display: none;
          background: white;
          border-top: 1px solid #f0f0f0;
          padding: 1.5rem 2rem;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transform: translateY(-10px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .mobile-search {
          margin-bottom: 1.5rem;
        }

        .mobile-search-form {
          position: relative;
          display: flex;
          align-items: center;
        }

        .mobile-search-form svg {
          position: absolute;
          left: 1rem;
          color: #666;
        }

        .mobile-search-form input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          background: #f9fafb;
        }

        .mobile-nav-menu {
          list-style: none;
          margin: 0 0 1.5rem 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-nav-link {
          display: block;
          padding: 0.75rem;
          color: #4b5563;
          text-decoration: none;
          font-weight: 500;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: #f3f4f6;
          color: #3b82f6;
        }

        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .btn-login-mobile {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #4b5563;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-primary-mobile {
          padding: 0.75rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .nav-container {
            padding: 0 1.5rem;
            gap: 1.5rem;
          }
          
          .search-container {
            max-width: 400px;
          }
        }

        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }
          
          .search-container {
            display: none;
          }
          
          .mobile-menu-toggle {
            display: block;
          }
          
          .mobile-menu {
            display: block;
          }
          
          .nav-container {
            padding: 0 1rem;
          }
          
          .nav-actions {
            display: none;
          }
          
          .logo {
            font-size: 1.25rem;
          }
          
          .logo-dot {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            padding: 0 0.75rem;
          }
          
          .mobile-menu {
            padding: 1rem;
          }
        }

        /* Scrolled State */
        .navbar.scrolled {
          padding: 0.5rem 0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
};

export default Navbar;