import React from 'react';
import { ArrowRight, User, Clock, Tag as TagIcon } from 'lucide-react';

function HeroSection({ allTags, onSubscribe, email, setEmail }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge">TRENDING</span>
        </div>
        
        <div className="hero-image">
          <div className="image-placeholder">
            <img
              src="/amul.png"
              alt="Code With Amul logo"
              className="hero-main-image"
            />
          </div>
        </div>
        
        <h1 className="hero-title">
          Master Programming: Tips, Projects & Best Practices
        </h1>
        
        <p className="hero-description">
          Learn coding with real-world projects and tutorials. Explore React, Python, Django, and modern web development techniques to level up your skills.
        </p>
        
        <div className="hero-meta">
          <div className="author">
            <User size={16} />
            <span>Written by Code With Amul</span>
          </div>
          <div className="read-time">
            <Clock size={16} />
            <span>15 min read</span>
          </div>
        </div>
        
        <div className="hero-tags">
          {allTags.slice(0, 15).map((tag) => (
            <span key={tag} className="tag">
              <TagIcon size={12} /> {tag}
            </span>
          ))}
        </div>
        
        <a href="/blog">
          <button className="btn-primary btn-hero">
            Read All Articles <ArrowRight size={20} />
          </button>
        </a>
      </div>
    </section>
  );
}

export default HeroSection;