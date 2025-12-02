import React from 'react';

const Hero = () => {
  return (
    <section style={{ background: 'linear-gradient(to right, #667eea, #764ba2)', color: 'white', padding: '4rem 0', textAlign: 'center' }}>
      <div className="container">
        <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Discover Amazing Stories</h2>
        <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>Explore our latest posts crafted with professional flair.</p>
      </div>
    </section>
  );
};

export default Hero;