import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { 
      name: "Blog", 
      link: "/blog",
      submenu: [
        { name: "All Posts", link: "/blog" },
        { name: "Popular", link: "/blog/popular" },
        { name: "Categories", link: "/blog/categories" },
      ]
    },
    { name: "Contact", link: "/contact" },
  ];

  const location = useLocation();

  const handleMouseEnter = (itemName) => {
    setHoveredItem(itemName);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo with animation */}
          <div className="navbar-logo">
            <Link to="/">
              <span className="logo-text">Blogify</span>
              <span className="logo-dot">.</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="navbar-menu">
            {navItems.map((item) => (
              <li
                key={item.name}
                className={`navbar-item ${
                  location.pathname === item.link ? "active" : ""
                } ${hoveredItem === item.name ? "hovered" : ""}`}
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link to={item.link} className="navbar-link">
                  {item.name}
                  {item.submenu && (
                    <ChevronDown size={16} className="dropdown-icon" />
                  )}
                </Link>
                
                {/* Submenu Dropdown */}
                {item.submenu && hoveredItem === item.name && (
                  <div className="submenu">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.link}
                        className="submenu-item"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Call to Action Button */}
          <Link to="/subscribe" className="cta-button">
            Subscribe
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <ul className="mobile-menu-list">
          {navItems.map((item) => (
            <li
              key={item.name}
              className={`mobile-menu-item ${
                location.pathname === item.link ? "active" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Link to={item.link} className="mobile-menu-link">
                {item.name}
              </Link>
              {item.submenu && (
                <div className="mobile-submenu">
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.link}
                      className="mobile-submenu-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
          <li className="mobile-menu-item">
            <Link 
              to="/subscribe" 
              className="mobile-cta-button"
              onClick={() => setIsMenuOpen(false)}
            >
              Subscribe
            </Link>
          </li>
        </ul>
      </div>

      <style jsx>{`
        /* Navbar container */
        .navbar {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          padding: 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(10px);
          background-color: rgba(31, 41, 55, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.75rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }

        /* Logo */
        .navbar-logo a {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: transform 0.3s ease;
        }

        .navbar-logo a:hover {
          transform: scale(1.05);
        }

        .logo-text {
          color: #ffffff;
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-dot {
          color: #3b82f6;
          font-size: 2rem;
          font-weight: bold;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Desktop Menu */
        .navbar-menu {
          list-style: none;
          display: flex;
          gap: 2rem;
          margin: 0;
          padding: 0;
          position: relative;
        }

        .navbar-item {
          position: relative;
        }

        .navbar-link {
          text-decoration: none;
          color: #d1d5db;
          padding: 0.5rem 0;
          font-weight: 500;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.3s ease;
          position: relative;
        }

        .navbar-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
        }

        .navbar-item:hover .navbar-link::after {
          width: 100%;
        }

        .navbar-item:hover .navbar-link {
          color: #ffffff;
        }

        .navbar-item.active .navbar-link {
          color: #ffffff;
        }

        .navbar-item.active .navbar-link::after {
          width: 100%;
        }

        .dropdown-icon {
          transition: transform 0.3s ease;
        }

        .navbar-item:hover .dropdown-icon {
          transform: rotate(180deg);
        }

        /* Submenu */
        .submenu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: rgba(31, 41, 55, 0.98);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0.75rem 0;
          min-width: 180px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .navbar-item:hover .submenu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .submenu-item {
          display: block;
          padding: 0.75rem 1.5rem;
          color: #d1d5db;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .submenu-item:hover {
          color: #ffffff;
          background: rgba(59, 130, 246, 0.1);
          padding-left: 1.75rem;
        }

        /* CTA Button */
        .cta-button {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          border: none;
          cursor: pointer;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        /* Mobile Menu Button */
        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }

        .mobile-menu-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        /* Mobile Menu */
        .mobile-menu {
          display: none;
          background: rgba(31, 41, 55, 0.98);
          backdrop-filter: blur(10px);
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          padding: 1rem 2rem;
          transform: translateY(-100%);
          opacity: 0;
          transition: all 0.3s ease;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
        }

        .mobile-menu-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .mobile-menu-item {
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-menu-link {
          color: #d1d5db;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 500;
          display: block;
          transition: color 0.3s ease;
        }

        .mobile-menu-item.active .mobile-menu-link {
          color: #3b82f6;
        }

        .mobile-menu-link:hover {
          color: #ffffff;
        }

        .mobile-submenu {
          padding-left: 1rem;
          margin-top: 0.5rem;
        }

        .mobile-submenu-item {
          display: block;
          padding: 0.5rem 0;
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.3s ease;
        }

        .mobile-submenu-item:hover {
          color: #3b82f6;
        }

        .mobile-cta-button {
          display: block;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          padding: 1rem;
          border-radius: 12px;
          text-decoration: none;
          text-align: center;
          font-weight: 600;
          margin-top: 1rem;
          transition: all 0.3s ease;
        }

        .mobile-cta-button:hover {
          transform: scale(1.02);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .cta-button {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .navbar-menu,
          .navbar-container .cta-button {
            display: none;
          }

          .mobile-menu-button {
            display: block;
          }

          .mobile-menu {
            display: block;
          }

          .navbar-container {
            padding: 0.75rem 1rem;
          }

          .logo-text {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .navbar-container {
            padding: 0.75rem;
          }

          .mobile-menu {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;