import React from 'react';

const Header = () => {
  return (
    <header style={{ background: '#f4f4f4', padding: '2rem 0', textAlign: 'center' }}>
      <div className="container">
        <h1 style={{ margin: 0, color: '#333' }}>Welcome to My Professional Blog</h1>
        <p style={{ margin: '0.5rem 0 0', color: '#666' }}>Sharing insights with rich, dynamic content.</p>
      </div>
    </header>
  );
};

export default Header;