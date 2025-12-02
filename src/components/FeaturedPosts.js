import React from 'react';

import { Star, ChevronRight } from 'lucide-react';
import PostCard from '../config/PostCard';
import LoadingSpinner from '../config/LoadingSpinner';

function FeaturedPosts({ posts, loading }) {
  if (loading) {
    return (
      <section className="featured-posts">
        <div className="section-header">
          <h2>
            <Star size={24} />
            Featured Articles
          </h2>
        </div>
        <LoadingSpinner message="Loading featured articles..." />
      </section>
    );
  }

  return (
    <section className="featured-posts">
      <div className="section-header">
        <h2>
          <Star size={24} />
          Featured Articles
        </h2>
        <a href="#" className="view-all">
          View All <ChevronRight size={16} />
        </a>
      </div>
      
      <div className="featured-grid">
        {Array.isArray(posts) && posts.slice(0, 3).map((post) => (
          <PostCard key={post?.id} post={post} type="featured" />
        ))}
      </div>
    </section>
  );
}

export default FeaturedPosts;