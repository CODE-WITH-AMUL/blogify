// src/pages/LandingPage.js (Complete Fixed Code with Available Icons)
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  CircularProgress,
  TextField
} from '@mui/material';
import {
  ArrowForward as ArrowRightIcon,
  CalendarToday as CalendarIcon,
  Schedule as ClockIcon,
  Favorite as HeartIcon,
  KeyboardArrowRight as ChevronRightIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Tag as TagIcon,
  MenuBook as MenuBookIcon,
  Computer as ComputerIcon,
  Code as CodeIcon,
  DataObject as DataObjectIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Smartphone as SmartphoneIcon,
  Email as MailIcon,
  Visibility as EyeIcon,
  Terminal as TerminalIcon
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import api from '../api/axiosInstance';

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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
  const [allTags, setAllTags] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);

  const getPostsFromResponse = (response) => {
    if (response && response.data) {
      if (Array.isArray(response.data.results)) {
        return response.data.results;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
    }
    return [];
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading({
        featured: true,
        recent: true,
        categories: true,
        tags: true
      });
      setError(null);

      // Fetch recent posts first (main data source)
      const recentResponse = await api.get('/api/posts/');
      const recentPostsData = Array.isArray(recentResponse.data) ? recentResponse.data : [];
      setRecentPosts(recentPostsData.slice(0, 7));

      // Fetch featured posts or use first 3 recent posts as featured
      try {
        const featuredResponse = await api.get('/api/featured-posts/');
        const featuredData = Array.isArray(featuredResponse.data) 
          ? featuredResponse.data 
          : recentPostsData.slice(0, 3);
        setFeaturedPosts(featuredData);
      } catch (featuredError) {
        console.log('Using recent posts as featured:', featuredError);
        setFeaturedPosts(recentPostsData.slice(0, 3));
      }

      // Extract categories from posts
      const categoriesData = [...new Set(recentPostsData.flatMap(post => 
        (post.categories || []).map(cat => cat.name)
      ))].map(cat => ({
        name: cat,
        icon: getCategoryIcon(cat),
        count: recentPostsData.filter(post => 
          (post.categories || []).some(c => c.name === cat)
        ).length
      }));
      setCategories(categoriesData);

      // Extract tags from posts
      const tagsData = [...new Set(recentPostsData.flatMap(post => 
        (post.tags || []).map(tag => tag.name)
      ))];
      setAllTags(tagsData);

      // Calculate popular tags
      const tagCounts = {};
      recentPostsData.forEach(post => {
        (post.tags || []).forEach(tag => {
          tagCounts[tag.name] = (tagCounts[tag.name] || 0) + 1;
        });
      });
      const sortedTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag]) => tag);
      setPopularTags(sortedTags);

      // Calculate trending posts
      const trendingData = recentPostsData
        .filter(post => post.views !== undefined)
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 3)
        .map((post, index) => ({
          id: post.id,
          title: post.title,
          rank: index + 1,
          views: post.views || `${Math.floor(Math.random() * 20 + 5)}.${Math.floor(Math.random() * 9)}K`,
          slug: post.slug || post.id
        }));
      setTrendingPosts(trendingData.length > 0 ? trendingData : getMockTrendingPosts());

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
      // Fallback mock data
      setFeaturedPosts(getMockFeaturedPosts());
      setRecentPosts(getMockRecentPosts());
      setCategories(getMockCategories());
      setPopularTags(getMockPopularTags());
      setTrendingPosts(getMockTrendingPosts());
    } finally {
      setLoading({
        featured: false,
        recent: false,
        categories: false,
        tags: false
      });
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Technology': <ComputerIcon fontSize="small" />,
      'Coding': <CodeIcon fontSize="small" />,
      'Programming': <TerminalIcon fontSize="small" />,
      'JavaScript': <CodeIcon fontSize="small" />,
      'Python': <TerminalIcon fontSize="small" />,
      'React': <ComputerIcon fontSize="small" />,
      'CSS': <PaletteIcon fontSize="small" />,
      'HTML': <LanguageIcon fontSize="small" />,
      'Django': <LanguageIcon fontSize="small" />,
      'NodeJS': <DataObjectIcon fontSize="small" />,
      'SQL': <StorageIcon fontSize="small" />,
      'MongoDB': <StorageIcon fontSize="small" />,
      'PostgreSQL': <StorageIcon fontSize="small" />,
      'Java': <ComputerIcon fontSize="small" />,
      'C++': <CodeIcon fontSize="small" />,
      'Go': <CodeIcon fontSize="small" />,
      'C#': <CodeIcon fontSize="small" />,
      'Angular': <ComputerIcon fontSize="small" />,
      'Vue': <ComputerIcon fontSize="small" />,
      'TypeScript': <MenuBookIcon fontSize="small" />,
      'PHP': <LanguageIcon fontSize="small" />,
      'Mobile': <SmartphoneIcon fontSize="small" />
    };
    return iconMap[category] || <MenuBookIcon fontSize="small" />;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      await api.post('/api/search/', { query: searchQuery });
      const searchResponse = await api.get(`/api/posts/?q=${encodeURIComponent(searchQuery)}`);
      if (searchResponse.data && Array.isArray(searchResponse.data)) {
        setRecentPosts(searchResponse.data);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed successfully with: ${email}`);
      setEmail('');
    }
  };

  const handleFilter = async (category) => {
    try {
      if (category === 'All') {
        const response = await api.get('/api/posts/');
        if (response.data && Array.isArray(response.data)) {
          setRecentPosts(response.data.slice(0, 7));
        }
      } else {
        const response = await api.get(`/api/posts/?category=${encodeURIComponent(category)}`);
        if (response.data && Array.isArray(response.data)) {
          setRecentPosts(response.data.slice(0, 7));
        }
      }
    } catch (err) {
      console.error('Filter error:', err);
    }
  };

  // Mock fallback data
  const getMockFeaturedPosts = () => [
    {
      id: 1,
      title: "React 18 Concurrent Features Explained",
      content: "Deep dive into the latest React 18 features including concurrent rendering, automatic batching, and transitions.",
      author: "Sarah Chen",
      created_date: "2023-12-15",
      views: 245,
      featured_image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      categories: [{ name: "Technology" }],
      tags: [{name: "REACT"}, {name: "JAVASCRIPT"}, {name: "WEB DEV"}],
      slug: "react-18-concurrent-features"
    },
    {
      id: 2,
      title: "Python Django Best Practices 2024",
      content: "Learn the most effective Django patterns for building scalable web applications.",
      author: "Alex Rivera",
      created_date: "2023-12-10",
      views: 189,
      featured_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      categories: [{ name: "Programming" }],
      tags: [{name: "PYTHON"}, {name: "DJANGO"}, {name: "BACKEND"}],
      slug: "python-django-best-practices"
    },
    {
      id: 3,
      title: "Advanced JavaScript Patterns",
      content: "Master modern JavaScript patterns including closures, prototypes, and async programming.",
      author: "Michael Zhang",
      created_date: "2023-12-05",
      views: 312,
      featured_image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
      categories: [{ name: "Coding" }],
      tags: [{name: "JAVASCRIPT"}, {name: "ES6"}, {name: "PATTERNS"}],
      slug: "advanced-javascript-patterns"
    }
  ];

  const getMockRecentPosts = () => [
    {
      id: 4,
      title: "Mastering State Management with Zustand",
      content: "A comprehensive guide to state management using Zustand for React applications.",
      author: "David Kim",
      created_date: "2023-12-08",
      views: 167,
      categories: [{ name: "Coding" }],
      tags: [{name: "REACT"}, {name: "STATE"}],
      slug: "mastering-state-management-zustand"
    },
    {
      id: 5,
      title: "Building REST APIs with Node.js",
      content: "Step-by-step guide to creating secure and scalable REST APIs using Node.js and Express.",
      author: "Jessica Park",
      created_date: "2023-12-07",
      views: 203,
      categories: [{ name: "Backend" }],
      tags: [{name: "NODEJS"}, {name: "API"}, {name: "EXPRESS"}],
      slug: "building-rest-apis-nodejs"
    },
    {
      id: 6,
      title: "CSS Grid vs Flexbox: When to Use Which",
      content: "Detailed comparison between CSS Grid and Flexbox with practical examples.",
      author: "Chris Wilson",
      created_date: "2023-12-06",
      views: 145,
      categories: [{ name: "CSS" }],
      tags: [{name: "CSS"}, {name: "GRID"}, {name: "FLEXBOX"}],
      slug: "css-grid-vs-flexbox"
    },
    {
      id: 7,
      title: "TypeScript for JavaScript Developers",
      content: "Transition smoothly from JavaScript to TypeScript with this comprehensive guide.",
      author: "Emma Davis",
      created_date: "2023-12-05",
      views: 178,
      categories: [{ name: "TypeScript" }],
      tags: [{name: "TYPESCRIPT"}, {name: "JAVASCRIPT"}],
      slug: "typescript-for-javascript-developers"
    }
  ];

  const getMockCategories = () => [
    { name: "REACT", icon: <ComputerIcon fontSize="small" />, count: 128 },
    { name: "JAVASCRIPT", icon: <CodeIcon fontSize="small" />, count: 156 },
    { name: "PYTHON", icon: <TerminalIcon fontSize="small" />, count: 95 },
    { name: "DJANGO", icon: <LanguageIcon fontSize="small" />, count: 55 },
    { name: "CSS", icon: <PaletteIcon fontSize="small" />, count: 103 },
    { name: "NODEJS", icon: <DataObjectIcon fontSize="small" />, count: 72 },
  ];

  const getMockPopularTags = () => [
    "REACT", "JAVASCRIPT", "TYPESCRIPT", "CSS", "NODEJS",
    "PYTHON", "DJANGO", "HTML", "SQL", "MONGODB"
  ];

  const getMockTrendingPosts = () => [
    {
      id: 8,
      title: "The Future of Web Development: AI Integration",
      rank: 1,
      views: "15.2K",
      slug: "future-web-development-ai"
    },
    {
      id: 9,
      title: "Building Microfrontends with Module Federation",
      rank: 2,
      views: "12.8K",
      slug: "microfrontends-module-federation"
    },
    {
      id: 10,
      title: "Web Performance Optimization Guide 2024",
      rank: 3,
      views: "10.5K",
      slug: "web-performance-optimization"
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return '5 min read';
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  // Safe array slicing function - FIXED THE BUG HERE
  const safeSlice = (array, start, end) => {
    if (!array || !Array.isArray(array)) return [];
    return array.slice(start, end);
  };

  return (
    <>
      <Helmet>
        <title>Code With Amul</title>
        <meta name="description" content="Explore premium articles on technology, design, AI, and more. Join thousands of readers discovering quality content daily." />
        <meta name="keywords" content="blog, articles, technology, design, AI, premium content" />
        <meta property="og:title" content="Code With Amul" />
        <meta property="og:description" content="Discover inspiring stories and insights from the world's best writers." />
        <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <link rel="canonical" href="https://yourdomain.com/" />
      </Helmet>

      {error && (
        <Box sx={{ padding: 2, backgroundColor: '#fff3cd', color: '#856404', textAlign: 'center', borderRadius: 1, margin: 2 }}>
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}

      {/* Hero Section */}
      <Box sx={{ 
        padding: { xs: '3rem 0', md: '5rem 0' }, 
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' 
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Text Content on Left */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Box sx={{ maxWidth: 600 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    marginBottom: 3 
                  }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: '#667eea' 
                    }} />
                    <Typography variant="overline" sx={{ 
                      color: '#667eea', 
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      letterSpacing: '2px'
                    }}>
                      TRENDING NOW
                    </Typography>
                  </Box>
                  
                  <Typography variant="h1" sx={{ 
                    fontSize: { xs: '2.8rem', md: '3.8rem', lg: '4.2rem' },
                    marginBottom: 2, 
                    fontWeight: 900,
                    lineHeight: 1.1,
                    background: 'linear-gradient(135deg, #1e293b 0%, #667eea 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Master Modern Programming
                  </Typography>
                  
                  <Typography variant="h2" sx={{ 
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    marginBottom: 3, 
                    fontWeight: 700,
                    color: 'text.primary',
                    lineHeight: 1.3
                  }}>
                    With Practical Examples
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    marginBottom: 4, 
                    color: 'text.secondary', 
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    maxWidth: '90%'
                  }}>
                    Expert tutorials on React, Python, Django, JavaScript, and full-stack development. 
                    Learn through real-world projects and industry best practices.
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 3, 
                    marginBottom: 4, 
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: 'primary.main',
                        fontSize: '0.875rem'
                      }}>
                        PB
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Code With Amul
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Expert Authors
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <CalendarIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                      <Typography variant="body2">
                        Updated Weekly
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <ClockIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                      <Typography variant="body2">
                        5-15 min reads
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Link to="/blog" style={{ textDecoration: 'none' }}>
                      <Button 
                        variant="contained" 
                        size="large" 
                        sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          padding: '12px 32px',
                          fontSize: '1rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: 4
                          }
                        }}
                      >
                        Start Learning <ArrowRightIcon sx={{ marginLeft: 1 }} />
                      </Button>
                    </Link>
                    <Link to="/about" style={{ textDecoration: 'none' }}>
                      <Button 
                        variant="outlined" 
                        size="large"
                        sx={{ 
                          padding: '12px 32px',
                          fontSize: '1rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        View Featured
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Image/Code Block on Right */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card sx={{ 
                  borderRadius: 3, 
                  overflow: 'hidden', 
                  boxShadow: 4,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    transition: 'transform 0.3s ease'
                  }
                }}>
                  <CardContent sx={{ padding: 0 }}>
                    <Box sx={{ 
                      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                      padding: 3 
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: 2 
                      }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Box sx={{ 
                            width: 14, 
                            height: 14, 
                            borderRadius: '50%', 
                            backgroundColor: '#ef4444',
                            boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'
                          }} />
                          <Box sx={{ 
                            width: 14, 
                            height: 14, 
                            borderRadius: '50%', 
                            backgroundColor: '#f59e0b',
                            boxShadow: '0 0 8px rgba(245, 158, 11, 0.5)'
                          }} />
                          <Box sx={{ 
                            width: 14, 
                            height: 14, 
                            borderRadius: '50%', 
                            backgroundColor: '#10b981',
                            boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)'
                          }} />
                        </Box>
                        <Typography variant="body1" sx={{ 
                          color: '#cbd5e1', 
                          fontFamily: '"Fira Code", "Monaco", monospace',
                          fontWeight: 500,
                          fontSize: '0.9rem'
                        }}>
                          example.js
                        </Typography>
                      </Box>
                      <pre style={{ 
                        margin: 0, 
                        color: '#e2e8f0', 
                        fontFamily: '"Fira Code", "Monaco", monospace', 
                        fontSize: '1rem', 
                        lineHeight: 1.6,
                        overflowX: 'auto',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        padding: '1.5rem',
                        borderRadius: '0.5rem'
                      }}>
                        <code>
{`// Modern React Pattern
const useCustomHook = () => {
  const [state, setState] = useState();
  
  useEffect(() => {
    // Clean, readable code
    fetchData().then(data => {
      setState(data);
    });
  }, []);
  
  return state;
};

// Example usage
const Component = () => {
  const data = useCustomHook();
  return <div>{data}</div>;
};`}
                        </code>
                      </pre>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Articles */}
      <Box sx={{ padding: { xs: '3rem 0', md: '4rem 0' } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, marginBottom: 1 }}>
              <StarIcon sx={{ fontSize: 24, color: 'primary.main' }} />
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                Featured Articles
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Handpicked quality content for deep learning
            </Typography>
          </Box>
          
          {loading.featured ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', paddingY: 4 }}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {safeSlice(featuredPosts, 0, 3).map((post, index) => (
                <Grid item xs={12} md={4} key={post.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card sx={{ 
                      height: '100%', 
                      borderRadius: 2, 
                      overflow: 'hidden', 
                      boxShadow: 1,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={post.featured_image || post.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop'}
                          alt={post.title}
                          sx={{ objectFit: 'cover' }}
                        />
                        <Chip 
                          label={post.categories?.[0]?.name || 'Featured'} 
                          sx={{ 
                            position: 'absolute', 
                            top: 16, 
                            left: 16, 
                            backgroundColor: 'white', 
                            color: 'primary.main', 
                            fontWeight: 600 
                          }} 
                        />
                        <Box sx={{ 
                          position: 'absolute', 
                          bottom: 16, 
                          left: 16, 
                          right: 16, 
                          display: 'flex', 
                          gap: 2 
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white' }}>
                            <EyeIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">{post.views || 0}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white' }}>
                            <HeartIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">{post.likes || 0}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <CardContent sx={{ padding: 2 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {formatDate(post.created_date)} • {calculateReadTime(post.content)}
                        </Typography>
                        <Typography variant="h6" sx={{ marginTop: 1, marginBottom: 1, fontWeight: 700 }}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 2 }}>
                          {post.content?.substring(0, 120) || 'No content available'}...
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, marginBottom: 2, flexWrap: 'wrap' }}>
                          {safeSlice(post.tags || [], 0, 2).map(tag => (
                            <Chip 
                              key={tag.id || tag.name} 
                              label={tag.name} 
                              size="small" 
                              sx={{ fontSize: '0.75rem' }} 
                            />
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                              {post.author?.charAt(0) || 'A'}
                            </Avatar>
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>
                              {post.author || 'Anonymous'}
                            </Typography>
                          </Box>
                          <Link to={`/blog/${post.slug || post.id}`} style={{ textDecoration: 'none' }}>
                            <Button variant="text" endIcon={<ChevronRightIcon />}>
                              Read
                            </Button>
                          </Link>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
          
          <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <Link to="/blog" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" size="large">
                View All Articles <ArrowRightIcon sx={{ marginLeft: 1 }} />
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ padding: { xs: '3rem 0', md: '4rem 0' }, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Recent Posts */}
            <Grid item xs={12} lg={8}>
              <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h3" sx={{ marginBottom: 1 }}>
                  Latest Tutorials
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Fresh content updated regularly
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, marginBottom: 3, flexWrap: 'wrap' }}>
                <Button variant="outlined" size="small" onClick={() => handleFilter('All')}>
                  All Topics
                </Button>
                {safeSlice(categories, 0, 4).map(cat => (
                  <Button 
                    key={cat.name} 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleFilter(cat.name)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </Box>
              
              {loading.recent ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', paddingY: 4 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : (
                <>
                  <Grid container spacing={3}>
                    {safeSlice(recentPosts, 0, 6).map(post => (
                      <Grid item xs={12} md={6} key={post.id}>
                        <Card sx={{ 
                          height: '100%',
                          '&:hover': {
                            boxShadow: 3
                          }
                        }}>
                          <CardContent>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              marginBottom: 2 
                            }}>
                              <Chip 
                                label={post.categories?.[0]?.name || 'Programming'} 
                                size="small" 
                              />
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {formatDate(post.created_date)}
                              </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 700 }}>
                              <Link 
                                to={`/blog/${post.slug || post.id}`} 
                                style={{ textDecoration: 'none', color: 'inherit' }}
                              >
                                {post.title}
                              </Link>
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 2 }}>
                              {(post.content || '').substring(0, 160)}...
                            </Typography>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center' 
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                  {(post.author || 'A').charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="caption" sx={{ fontWeight: 500, display: 'block' }}>
                                    {post.author || 'Anonymous'}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {calculateReadTime(post.content)}
                                  </Typography>
                                </Box>
                              </Box>
                              <Link to={`/blog/${post.slug || post.id}`} style={{ textDecoration: 'none' }}>
                                <Button variant="text" endIcon={<ChevronRightIcon />}>
                                  Read
                                </Button>
                              </Link>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                    <Button variant="outlined" onClick={fetchAllData}>
                      Load More Articles
                    </Button>
                  </Box>
                </>
              )}
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Categories */}
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                      <MenuBookIcon />
                      <Typography variant="h6">Topics</Typography>
                    </Box>
                    {loading.categories ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, paddingY: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2">Loading topics...</Typography>
                      </Box>
                    ) : (
                      safeSlice(categories, 0, 6).map(cat => (
                        <Link 
                          key={cat.name} 
                          to={`/category/${cat.name.toLowerCase()}`} 
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            paddingY: 1,
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.04)',
                              borderRadius: 1
                            }
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {cat.icon}
                              <Typography variant="body2">{cat.name}</Typography>
                            </Box>
                            <Typography variant="caption">{cat.count}</Typography>
                          </Box>
                        </Link>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Trending Posts */}
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                      <TrendingUpIcon />
                      <Typography variant="h6">Trending Now</Typography>
                    </Box>
                    {safeSlice(trendingPosts, 0, 3).map(post => (
                      <Link 
                        key={post.id} 
                        to={`/blog/${post.slug || post.id}`} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1, 
                          paddingY: 1, 
                          alignItems: 'center',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.04)',
                            borderRadius: 1
                          }
                        }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              minWidth: 32, 
                              textAlign: 'center',
                              color: post.rank === 1 ? '#f59e0b' : 
                                     post.rank === 2 ? '#94a3b8' : 
                                     post.rank === 3 ? '#d97706' : 'text.secondary'
                            }}
                          >
                            {post.rank}
                          </Typography>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                              {post.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {post.views} views
                            </Typography>
                          </Box>
                        </Box>
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                      <TagIcon />
                      <Typography variant="h6">Popular Tags</Typography>
                    </Box>
                    {loading.tags ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, paddingY: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2">Loading tags...</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {safeSlice(popularTags, 0, 10).map(tag => (
                          <Link 
                            key={tag} 
                            to={`/tag/${tag.toLowerCase()}`} 
                            style={{ textDecoration: 'none' }}
                          >
                            <Chip 
                              label={`#${tag}`} 
                              size="small" 
                              sx={{ 
                                fontSize: '0.75rem',
                                '&:hover': {
                                  backgroundColor: 'primary.light',
                                  color: 'white'
                                }
                              }} 
                            />
                          </Link>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
                      <MailIcon />
                      <Typography variant="h6">Stay Updated</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ marginBottom: 2, color: 'text.secondary' }}>
                      Get weekly programming insights delivered to your inbox
                    </Typography>
                    <form onSubmit={handleSubscribe}>
                      <TextField
                        fullWidth
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ marginBottom: 2 }}
                      />
                      <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      >
                        Subscribe
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

    </>
  );
};

export default LandingPage;