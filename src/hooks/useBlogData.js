import { useState, useEffect, useCallback } from 'react';
import {
    fetchFeaturedPosts,
    fetchRecentPosts,
    fetchCategories
} from '../middleware/api';
import { getCategoryIcon } from '../middleware/helpers';

function useBlogData() {
  const [loading, setLoading] = useState({
    featured: true,
    recent: true,
    categories: true,
    tags: true
  });
  const [error, setError] = useState(null);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading({
        featured: true,
        recent: true,
        categories: true,
        tags: true
      });
      setError(null);

      const [
        featuredData,
        recentData,
        categoriesData
      ] = await Promise.all([
        fetchFeaturedPosts(),
        fetchRecentPosts(),
        fetchCategories()
      ]);

      setFeaturedPosts(featuredData);
      setRecentPosts(recentData.slice(0, 7));

      const mappedCategories = categoriesData.map(cat => ({
        name: cat?.Category || 'Unknown',
        icon: getCategoryIcon(cat?.Category),
        count: Array.isArray(cat?.blog_posts_category) ? cat.blog_posts_category.length : 0
      }));
      setCategories(mappedCategories);

      const tagCounts = {};
      
      recentData.forEach(post => {
        if (Array.isArray(post?.tag)) {
          post.tag.forEach(tag => {
            if (tag) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });

      const sortedTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag]) => tag);
      setPopularTags(sortedTags);

      const trendingData = recentData.slice(0, 3).map((post, index) => ({
        id: post?.id || index,
        title: post?.title || 'Untitled Post',
        rank: index + 1,
        views: `${Math.floor(Math.random() * 20 + 5)}.${Math.floor(Math.random() * 9)}K`
      }));
      setTrendingPosts(trendingData);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading({
        featured: false,
        recent: false,
        categories: false,
        tags: false
      });
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchAllData();
    }
  }, [refreshTrigger, fetchAllData]);

  const handleManualRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    featuredPosts,
    recentPosts,
    categories,
    popularTags,
    trendingPosts,
    loading,
    error,
    handleManualRefresh,
    fetchAllData
  };
}

export default useBlogData;
