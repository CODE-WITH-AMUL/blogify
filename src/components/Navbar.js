import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../config/SearchBar';

function Navbar({ onSearch, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery, e);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo" onClick={() => handleNavigation('/')}>
          <span className="logo-main">Code With Amul</span>
        </div>
        
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSubmit={handleSearchSubmit}
        />
        
        <ul className="nav-menu">
          <li>
            <button 
              className="nav-link"
              onClick={() => handleNavigation('/')}
            >
              Home
            </button>
          </li>
          <li>
            <button 
              className="nav-link"
              onClick={() => handleNavigation('/blog')}
            >
              Blog
            </button>
          </li>
          <li>
            <a href="#about" className="nav-link">About</a>
          </li>
          <li>
            <a href="#contact" className="nav-link">Contact</a>
          </li>
        </ul>
        
        <button 
          className="btn-refresh"
          onClick={onRefresh}
          title="Refresh content from admin panel"
        >
          ↻
        </button>
      </div>

      <style jsx>{`
        .nav-link {
          background: none;
          border: none;
          cursor: pointer;
          color: inherit;
          font-size: inherit;
          padding: 0;
        }

        .logo {
          cursor: pointer;
          transition: transform 0.3s;
        }

        .logo:hover {
          transform: scale(1.05);
        }
      `}</style>
    </nav>
  );
}

export default Navbar;