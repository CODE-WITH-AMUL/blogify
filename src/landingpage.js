import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturedPosts from './components/FeaturedPosts';
import RecentPosts from './components/RecentPosts';
import Sidebar from './components/Sidebar';
import NewsletterCTA from './components/NewsletterCTA';
import Footer from './components/Footer';
import ErrorDisplay from './config/ErrorDisplay';
import useBlogData from './hooks/useBlogData';



function GetStarted() {
  const [email, setEmail] = useState('');
  const {
    featuredPosts,
    recentPosts,
    categories,
    popularTags,
    trendingPosts,
    loading,
    error,
    handleSearch,
    handleFilter,
    handleManualRefresh,
    fetchAllData
  } = useBlogData();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed successfully with: ${email}`);
      setEmail('');
    }
  };

  return (
    <div className="blog-landing-page">
      <Navbar 
        onSearch={handleSearch}
        onRefresh={handleManualRefresh}
      />
      
      {error && <ErrorDisplay message={error} />}
      
      <HeroSection 
        allTags={popularTags}
        onSubscribe={handleSubscribe}
        email={email}
        setEmail={setEmail}
      />
      
      <FeaturedPosts 
        posts={featuredPosts}
        loading={loading.featured}
      />
      
      <div className="main-content">
        <div className="content-wrapper">
          <RecentPosts 
            posts={recentPosts}
            categories={categories}
            loading={loading.recent}
            onFilter={handleFilter}
            onLoadMore={fetchAllData}
          />
          
          <Sidebar 
            categories={categories}
            trendingPosts={trendingPosts}
            popularTags={popularTags}
            loading={loading}
            onSubscribe={handleSubscribe}
            email={email}
            setEmail={setEmail}
          />
        </div>
      </div>
      
      <NewsletterCTA 
        onSubscribe={handleSubscribe}
        email={email}
        setEmail={setEmail}
      />
      
      <Footer categories={categories} />
    </div>
  );
}

export default GetStarted;