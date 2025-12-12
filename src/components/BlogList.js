// src/pages/BlogList.js (Fixed Production Version)
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Pagination,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  Container,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  CalendarToday as CalendarIcon,
  Schedule as ClockIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  KeyboardArrowRight as ArrowRightIcon,
  ViewQuilt as QuiltViewIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../api/axiosInstance';

const BlogList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cardStyle, setCardStyle] = useState('vertical');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'views', label: 'Most Views' },
  ];

  // Fetch blog posts from API
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // FIXED: Use correct API endpoint for blogs
      const response = await api.get('/api/blogs/');
      
      let postsData = [];
      
      // Handle different API response structures
      if (response.data && Array.isArray(response.data)) {
        postsData = response.data;
      } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
        postsData = response.data.results;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        postsData = response.data.data;
      }
      
      setPosts(postsData);
      setFilteredPosts(postsData);
      
    } catch (err) {
      console.error('Error fetching blogs:', err);
      
      let errorMessage = 'Failed to load blogs. ';
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage += 'API endpoint not found. Please check backend configuration.';
        } else if (err.response.status === 500) {
          errorMessage += 'Server error. Please try again later.';
        } else {
          errorMessage += `Error ${err.response.status}: ${err.response.statusText}`;
        }
      } else if (err.request) {
        errorMessage += 'Cannot connect to server. Check your network connection.';
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      
      // Try to fetch categories from API
      const response = await api.get('/api/categories/');
      
      let categoriesData = [];
      
      if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data && response.data.results && Array.isArray(response.data.results)) {
        categoriesData = response.data.results;
      }
      
      // Add "All" category at the beginning
      setCategories([
        { id: 'all', name: 'All Posts', slug: 'all' },
        ...categoriesData
      ]);
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      
      // Use fallback categories if API fails
      setCategories([
        { id: 'all', name: 'All Posts', slug: 'all' },
        { id: 'react', name: 'React', slug: 'react' },
        { id: 'javascript', name: 'JavaScript', slug: 'javascript' },
        { id: 'python', name: 'Python', slug: 'python' },
        { id: 'django', name: 'Django', slug: 'django' },
        { id: 'css', name: 'CSS', slug: 'css' },
        { id: 'web-dev', name: 'Web Development', slug: 'web-dev' },
        { id: 'programming', name: 'Programming', slug: 'programming' },
      ]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  // Apply filtering and sorting
  useEffect(() => {
    const applyFiltersAndSorting = () => {
      let results = [...posts];
      
      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        results = results.filter(post => {
          if (!post) return false;
          
          const titleMatch = post.title && post.title.toLowerCase().includes(query);
          const contentMatch = post.content && post.content.toLowerCase().includes(query);
          const excerptMatch = post.excerpt && post.excerpt.toLowerCase().includes(query);
          const authorMatch = post.author && post.author.toLowerCase().includes(query);
          
          return titleMatch || contentMatch || excerptMatch || authorMatch;
        });
      }
      
      // Apply category filter
      if (categoryFilter !== 'all') {
        results = results.filter(post => {
          if (!post || !post.category) return false;
          
          // Handle different category formats
          const postCategory = post.category;
          const postCategorySlug = typeof postCategory === 'string' ? postCategory : postCategory.slug;
          const postCategoryId = typeof postCategory === 'string' ? postCategory : postCategory.id;
          
          return postCategorySlug === categoryFilter || postCategoryId === categoryFilter;
        });
      }
      
      // Apply sorting
      results.sort((a, b) => {
        const dateA = new Date(a.published_date || a.created_date || 0);
        const dateB = new Date(b.published_date || b.created_date || 0);
        
        switch(sortBy) {
          case 'newest':
            return dateB - dateA;
          case 'oldest':
            return dateA - dateB;
          case 'popular':
            return (b.likes_count || b.likes || 0) - (a.likes_count || a.likes || 0);
          case 'views':
            return (b.views || 0) - (a.views || 0);
          default:
            return dateB - dateA;
        }
      });
      
      setFilteredPosts(results);
      setCurrentPage(1);
    };
    
    if (posts.length > 0) {
      applyFiltersAndSorting();
    }
  }, [searchQuery, categoryFilter, sortBy, posts]);

  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recent';
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Recent';
    }
  };

  // Calculate read time safely
  const calculateReadTime = (content) => {
    if (!content) return '5 min read';
    
    try {
      // Strip HTML tags for word count
      const text = content.replace(/<[^>]*>/g, ' ');
      const words = text.split(/\s+/).filter(word => word.length > 0).length;
      const minutes = Math.ceil(words / 200);
      
      if (minutes === 0) return '< 1 min read';
      if (minutes === 1) return '1 min read';
      return `${minutes} min read`;
    } catch (e) {
      return '5 min read';
    }
  };

  // Get category color
  const getCategoryColor = (categorySlug) => {
    const colors = {
      'react': '#61DAFB',
      'javascript': '#F7DF1E',
      'python': '#3776AB',
      'django': '#092E20',
      'css': '#264DE4',
      'web-dev': '#8B5CF6',
      'programming': '#10B981',
      'default': '#667EEA'
    };
    
    return colors[categorySlug] || colors.default;
  };

  // Handle card style change
  const handleCardStyleChange = (event, newStyle) => {
    if (newStyle !== null) {
      setCardStyle(newStyle);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setSortBy('newest');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ 
        py: 8, 
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
          Loading blog posts...
        </Typography>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 6, md: 8 },
        mb: 6,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }} />
        
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto', position: 'relative', zIndex: 1 }}>
            <Typography variant="h1" sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 2,
              lineHeight: 1.2
            }}>
              Blog & Tutorials
            </Typography>
            <Typography variant="h6" sx={{
              mb: 4,
              opacity: 0.9,
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}>
              {posts.length > 0 
                ? `Discover ${posts.length} articles, tutorials, and guides` 
                : 'Explore programming tutorials and guides'}
            </Typography>
            
            {/* Search Bar */}
            <Box sx={{
              maxWidth: 600,
              mx: 'auto',
              mb: 2
            }}>
              <TextField
                fullWidth
                placeholder="Search articles by title, content, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  borderRadius: 3,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                      borderWidth: 2
                    },
                  }
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  endAdornment: searchQuery && (
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery('')}
                      sx={{ mr: -1 }}
                    >
                      <ClearIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
            
            {/* Active Filters Info */}
            {(searchQuery || categoryFilter !== 'all') && (
              <Box sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1
              }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Active filters:
                </Typography>
                {searchQuery && (
                  <Chip
                    label={`Search: "${searchQuery}"`}
                    size="small"
                    onDelete={() => setSearchQuery('')}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '0.75rem'
                    }}
                  />
                )}
                {categoryFilter !== 'all' && (
                  <Chip
                    label={`Category: ${categories.find(c => c.id === categoryFilter || c.slug === categoryFilter)?.name || categoryFilter}`}
                    size="small"
                    onDelete={() => setCategoryFilter('all')}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '0.75rem'
                    }}
                  />
                )}
                <Button
                  size="small"
                  onClick={handleClearFilters}
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Clear all
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Error Display */}
      {error && (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-icon': { fontSize: 30 }
            }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={fetchPosts}
                startIcon={<RefreshIcon />}
              >
                Retry
              </Button>
            }
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Unable to load blog posts
            </Typography>
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
        </Container>
      )}

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Filters and Controls */}
        <Box sx={{
          mb: 6,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between'
        }}>
          {/* Categories Filter */}
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'center',
            minHeight: '40px'
          }}>
            <Typography variant="body2" sx={{ mr: 2, fontWeight: 600, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
              <FilterIcon fontSize="small" sx={{ mr: 1 }} />
              Categories:
            </Typography>
            
            {categoriesLoading ? (
              <CircularProgress size={20} />
            ) : (
              categories.map(category => (
                <Chip
                  key={category.id || category.slug}
                  label={category.name}
                  onClick={() => setCategoryFilter(category.id === 'all' ? 'all' : category.slug || category.id)}
                  variant={categoryFilter === (category.id === 'all' ? 'all' : category.slug || category.id) ? 'filled' : 'outlined'}
                  sx={{
                    backgroundColor: categoryFilter === (category.id === 'all' ? 'all' : category.slug || category.id) 
                      ? getCategoryColor(category.slug) 
                      : 'transparent',
                    color: categoryFilter === (category.id === 'all' ? 'all' : category.slug || category.id) 
                      ? 'white' 
                      : 'inherit',
                    borderColor: getCategoryColor(category.slug),
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: `${getCategoryColor(category.slug)}20`,
                    }
                  }}
                  size={isMobile ? "small" : "medium"}
                />
              ))
            )}
          </Box>

          {/* Sort and View Controls */}
          <Box sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ backgroundColor: 'background.paper' }}
              >
                {sortOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ToggleButtonGroup
              value={cardStyle}
              exclusive
              onChange={handleCardStyleChange}
              size="small"
              aria-label="card style"
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              <ToggleButton 
                value="vertical" 
                aria-label="vertical cards"
                sx={{ px: 2 }}
              >
                <GridViewIcon />
              </ToggleButton>
              <ToggleButton 
                value="horizontal" 
                aria-label="horizontal cards"
                sx={{ px: 2 }}
              >
                <ListViewIcon />
              </ToggleButton>
              <ToggleButton 
                value="masonry" 
                aria-label="masonry layout"
                sx={{ px: 2 }}
              >
                <QuiltViewIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Results Info */}
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Showing {Math.min(currentPosts.length, postsPerPage)} of {filteredPosts.length} articles
          {searchQuery && ` for "${searchQuery}"`}
          {categoryFilter !== 'all' && ` in "${categories.find(c => c.slug === categoryFilter || c.id === categoryFilter)?.name || categoryFilter}"`}
        </Typography>

        {/* Posts Grid */}
        {currentPosts.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 10,
            backgroundColor: 'background.default',
            borderRadius: 3,
            border: '1px dashed',
            borderColor: 'divider'
          }}>
            <SearchIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
              No articles found
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 500, mx: 'auto' }}>
              {searchQuery || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'No blog posts available yet. Check back soon!'}
            </Typography>
            {(searchQuery || categoryFilter !== 'all') && (
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                size="large"
              >
                Clear All Filters
              </Button>
            )}
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {currentPosts.map((post, index) => {
                // Get category info
                const postCategory = post.category || {};
                const categorySlug = typeof postCategory === 'string' ? postCategory : postCategory.slug;
                const categoryName = typeof postCategory === 'string' ? postCategory : postCategory.name;
                
                return (
                  <Grid 
                    item 
                    xs={12} 
                    sm={cardStyle === 'vertical' ? (isMobile ? 12 : 6) : 12} 
                    md={cardStyle === 'vertical' ? 4 : 12} 
                    key={post.id || `post-${index}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card sx={{
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: cardStyle === 'horizontal' && !isMobile ? 'row' : 'column',
                        '&:hover': {
                          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                        }
                      }}>
                        {/* Thumbnail */}
                        <Box 
                          sx={{ 
                            position: 'relative',
                            flex: cardStyle === 'horizontal' && !isMobile ? '0 0 300px' : 'auto'
                          }}
                        >
                          <CardMedia
                            component="img"
                            height={cardStyle === 'horizontal' && !isMobile ? '100%' : 200}
                            image={post.featured_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80'}
                            alt={post.title}
                            sx={{ 
                              objectFit: 'cover',
                              width: '100%',
                              height: cardStyle === 'horizontal' && !isMobile ? '100%' : 200
                            }}
                          />
                          
                          {/* Category Badge */}
                          {categoryName && categoryName !== 'Uncategorized' && (
                            <Chip
                              label={categoryName}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                backgroundColor: getCategoryColor(categorySlug),
                                color: 'white',
                                fontWeight: 600,
                                boxShadow: 2,
                                fontSize: '0.7rem'
                              }}
                            />
                          )}
                        </Box>

                        <CardContent sx={{ 
                          p: 3, 
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          {/* Meta Info */}
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                            flexWrap: 'wrap',
                            gap: 1
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                <CalendarIcon sx={{ fontSize: 14 }} />
                                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                  {formatDate(post.published_date || post.created_date)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                <ClockIcon sx={{ fontSize: 14 }} />
                                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                  {calculateReadTime(post.content)}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                <FavoriteIcon sx={{ fontSize: 14 }} />
                                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                  {post.likes_count || post.likes || 0}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                <CommentIcon sx={{ fontSize: 14 }} />
                                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                  {post.comments_count || 0}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          {/* Title */}
                          <Typography 
                            variant="h6" 
                            sx={{
                              mb: 2,
                              fontWeight: 700,
                              lineHeight: 1.4,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              fontSize: { xs: '1rem', sm: '1.125rem' }
                            }}
                          >
                            <Link 
                              to={`/blog/${post.slug || post.id}`} 
                              style={{ 
                                textDecoration: 'none', 
                                color: 'inherit',
                                '&:hover': {
                                  color: 'primary.main'
                                }
                              }}
                            >
                              {post.title || 'Untitled Post'}
                            </Link>
                          </Typography>

                          {/* Excerpt/Description */}
                          <Typography 
                            variant="body2" 
                            sx={{
                              mb: 3,
                              color: 'text.secondary',
                              lineHeight: 1.6,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              flexGrow: 1,
                              fontSize: '0.875rem'
                            }}
                          >
                            {post.excerpt || post.content?.substring(0, 200)?.replace(/<[^>]*>/g, '') || 'No description available'}...
                          </Typography>

                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <Box sx={{ 
                              mb: 3, 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              gap: 0.5,
                              alignItems: 'center'
                            }}>
                              {post.tags.slice(0, 3).map((tag, tagIndex) => {
                                const tagName = typeof tag === 'string' ? tag : tag.name;
                                return tagName ? (
                                  <Chip
                                    key={tagIndex}
                                    label={tagName}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                      fontSize: '0.7rem',
                                      height: '24px'
                                    }}
                                  />
                                ) : null;
                              })}
                              {post.tags.length > 3 && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
                                  +{post.tags.length - 3} more
                                </Typography>
                              )}
                            </Box>
                          )}

                          {/* Author and Read More */}
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pt: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            mt: 'auto'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar 
                                sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  bgcolor: getCategoryColor(categorySlug),
                                  fontSize: '0.875rem'
                                }}
                              >
                                {(post.author_name || post.author || 'A').charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                                {post.author_name || post.author || 'Anonymous'}
                              </Typography>
                            </Box>
                            
                            <Link 
                              to={`/blog/${post.slug || post.id}`} 
                              style={{ textDecoration: 'none' }}
                            >
                              <Button
                                variant="text"
                                endIcon={<ArrowRightIcon />}
                                sx={{
                                  color: 'primary.main',
                                  fontWeight: 600,
                                  fontSize: '0.875rem',
                                  textTransform: 'none',
                                  '&:hover': {
                                    backgroundColor: 'rgba(102, 126, 234, 0.1)'
                                  }
                                }}
                              >
                                Read More
                              </Button>
                            </Link>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  showFirstButton
                  showLastButton
                  siblingCount={isMobile ? 0 : 1}
                  boundaryCount={isMobile ? 1 : 2}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2,
                      mx: 0.5,
                      fontSize: isMobile ? '0.875rem' : '1rem'
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default BlogList;