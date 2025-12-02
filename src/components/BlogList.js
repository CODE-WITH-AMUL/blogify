// src/pages/BlogList.js (Enhanced UI Version - Fixed)
import React, { useState, useEffect } from 'react';
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
  IconButton,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  CalendarToday as CalendarIcon,
  Person as UserIcon,
  Schedule as ClockIcon,
  TrendingUp as TrendingIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  KeyboardArrowRight as ArrowRightIcon,
  ViewQuilt as QuiltViewIcon
} from '@mui/icons-material';
import api from '../api/axiosInstance';

const BlogList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [cardStyle, setCardStyle] = useState('vertical');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  
  // Enhanced categories with icons and colors
  const categories = [
    { id: 'all', name: 'All Posts', icon: '', color: '#667eea' },
    { id: 'react', name: 'React', icon: '', color: '#61dafb' },
    { id: 'javascript', name: 'JavaScript', icon: '', color: '#f7df1e' },
    { id: 'python', name: 'Python', icon: '', color: '#3776ab' },
    { id: 'django', name: 'Django', icon: '', color: '#092e20' },
    { id: 'css', name: 'CSS', icon: '', color: '#264de4' },
    { id: 'nodejs', name: 'Node.js', icon: '', color: '#68a063' },
    { id: 'typescript', name: 'TypeScript', icon: '', color: '#3178c6' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: '' },
    { value: 'popular', label: 'Most Popular', icon: '' },
    { value: 'trending', label: 'Trending', icon: '' },
    { value: 'views', label: 'Most Views', icon: '' },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/posts/');
      
      // Ensure response data is an array
      const postsData = Array.isArray(response.data.results) ? response.data.results : [];
      
      setPosts(postsData);
      setFilteredPosts(postsData);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blogs. Please try again later.');
      // Set empty arrays on error
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ensure filteredPosts is always an array
    const results = Array.isArray(posts) ? [...posts] : [];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = results.filter(post => {
        if (!post || typeof post !== 'object') return false;
        
        const titleMatch = post.title && post.title.toLowerCase().includes(query);
        const contentMatch = post.content && post.content.toLowerCase().includes(query);
        const authorMatch = post.author && post.author.toLowerCase().includes(query);
        
        return titleMatch || contentMatch || authorMatch;
      });
      
      // Update with filtered results
      const finalResults = Array.isArray(filtered) ? filtered : results;
      applySortingAndSetState(finalResults);
      return;
    }
    
    // Apply sorting and update state
    applySortingAndSetState(results);
  }, [searchQuery, sortBy, categoryFilter, posts]);

  // Helper function to apply sorting and update filteredPosts
  const applySortingAndSetState = (resultsArray) => {
    if (!Array.isArray(resultsArray)) {
      setFilteredPosts([]);
      return;
    }
    
    // Category filter
    let filteredResults = resultsArray;
    if (categoryFilter !== 'All') {
      filteredResults = resultsArray.filter(post => {
        if (!post || !post.categories) return false;
        
        return Array.isArray(post.categories) && 
          post.categories.some(cat => {
            if (!cat) return false;
            const catName = typeof cat === 'string' ? cat : cat.name;
            const catId = typeof cat === 'string' ? cat : cat.id;
            
            return catName?.toLowerCase() === categoryFilter.toLowerCase() ||
                   catId?.toLowerCase() === categoryFilter.toLowerCase();
          });
      });
    }
    
    // Sort results
    const sortedResults = [...filteredResults].sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          const dateA = a.created_date || a.date || 0;
          const dateB = b.created_date || b.date || 0;
          return new Date(dateB) - new Date(dateA);
        case 'popular':
          return (b.likes || 0) - (a.likes || 0);
        case 'trending':
          const scoreA = (a.views || 0) * 0.7 + (a.likes || 0) * 0.3;
          const scoreB = (b.views || 0) * 0.7 + (b.likes || 0) * 0.3;
          return scoreB - scoreA;
        case 'views':
          return (b.views || 0) - (a.views || 0);
        default:
          const defaultDateA = a.created_date || a.date || 0;
          const defaultDateB = b.created_date || b.date || 0;
          return new Date(defaultDateB) - new Date(defaultDateA);
      }
    });
    
    setFilteredPosts(sortedResults);
    setCurrentPage(1);
  };

  // Safe array slicing function
  const safeSlice = (array, start, end) => {
    if (!array || !Array.isArray(array)) return [];
    return array.slice(start, end);
  };

  const currentPosts = safeSlice(filteredPosts, (currentPage - 1) * postsPerPage, currentPage * postsPerPage);
  const totalPages = Math.ceil((Array.isArray(filteredPosts) ? filteredPosts.length : 0) / postsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Recent';
    }
  };

  const calculateReadTime = (content) => {
    if (!content) return '5 min read';
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const handleCardStyleChange = (event, newStyle) => {
    if (newStyle !== null) {
      setCardStyle(newStyle);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
          Loading articles...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchPosts}>
          Try Again
        </Button>
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
        mb: 6
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h1" sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 2,
              lineHeight: 1.2
            }}>
              Explore Our Articles
            </Typography>
            <Typography variant="h6" sx={{
              mb: 4,
              opacity: 0.9,
              fontWeight: 400
            }}>
              Discover {(Array.isArray(posts) ? posts.length : 0)}+ tutorials, guides, and insights on modern programming
            </Typography>
            
            {/* Search Bar */}
            <Box sx={{
              maxWidth: 600,
              mx: 'auto',
              mb: 4
            }}>
              <TextField
                fullWidth
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  }
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

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
            alignItems: 'center'
          }}>
            <Typography variant="body2" sx={{ mr: 2, fontWeight: 600, color: 'text.secondary' }}>
              <FilterIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Filter by:
            </Typography>
            {categories.map(category => (
              <Chip
                key={category.id}
                label={category.name}
                onClick={() => setCategoryFilter(category.id === 'all' ? 'All' : category.name)}
                variant={categoryFilter === (category.id === 'all' ? 'All' : category.name) ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: categoryFilter === (category.id === 'all' ? 'All' : category.name) ? category.color : 'transparent',
                  color: categoryFilter === (category.id === 'all' ? 'All' : category.name) ? 'white' : 'inherit',
                  borderColor: category.color,
                  '&:hover': {
                    backgroundColor: `${category.color}20`,
                  }
                }}
              />
            ))}
          </Box>

          {/* Sort and View Controls */}
          <Box sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center'
          }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
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
            >
              <ToggleButton value="vertical" aria-label="vertical cards">
                <GridViewIcon />
              </ToggleButton>
              <ToggleButton value="horizontal" aria-label="horizontal cards">
                <ListViewIcon />
              </ToggleButton>
              <ToggleButton value="masonry" aria-label="masonry layout">
                <QuiltViewIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Results Info */}
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Showing {currentPosts.length} of {(Array.isArray(filteredPosts) ? filteredPosts.length : 0)} articles
          {searchQuery && ` for "${searchQuery}"`}
        </Typography>

        {/* Posts Grid */}
        <Grid container spacing={4}>
          {currentPosts.length > 0 ? (
            currentPosts.map((post, index) => (
              <Grid item xs={12} sm={cardStyle === 'vertical' ? 6 : 12} md={cardStyle === 'vertical' ? 4 : 12} key={post?.id || index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card sx={{
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                      transform: 'translateY(-8px)'
                    }
                  }}>
                    {/* Thumbnail */}
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height={cardStyle === 'vertical' ? 200 : 180}
                        image={post?.thumbnail || post?.featured_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop'}
                        alt={post?.title || 'Blog Post'}
                        sx={{ objectFit: 'cover' }}
                      />
                      {/* Category Badge */}
                      {post?.categories?.[0] && (
                        <Chip
                          label={typeof post.categories[0] === 'string' ? post.categories[0] : post.categories[0].name}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            backgroundColor: 'white',
                            color: 'primary.main',
                            fontWeight: 600,
                            boxShadow: 1
                          }}
                        />
                      )}
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      {/* Meta Info */}
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <CalendarIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption">
                              {formatDate(post?.created_date || post?.date)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <ClockIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption">
                              {calculateReadTime(post?.content)}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <FavoriteIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption">
                              {post?.likes || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <CommentIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption">
                              {post?.comments_count || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Title */}
                      <Typography variant="h6" sx={{
                        mb: 2,
                        fontWeight: 700,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        <Link to={`/blog/${post?.slug || post?.id || '#'}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {post?.title || 'Untitled Post'}
                        </Link>
                      </Typography>

                      {/* Description */}
                      <Typography variant="body2" sx={{
                        mb: 3,
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {post?.content?.substring(0, 200) || 'No description available'}...
                      </Typography>

                      {/* Tags */}
                      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {Array.isArray(post?.tags) && post.tags.slice(0, 3).map(tag => (
                          <Chip
                            key={typeof tag === 'string' ? tag : tag?.id || tag}
                            label={typeof tag === 'string' ? tag : tag?.name || 'Tag'}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>

                      {/* Author and Read More */}
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            {post?.author?.charAt(0) || 'A'}
                          </Avatar>
                          <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {post?.author || 'Anonymous'}
                          </Typography>
                        </Box>
                        
                        <Link to={`/blog/${post?.slug || post?.id || '#'}`} style={{ textDecoration: 'none' }}>
                          <Button
                            variant="text"
                            endIcon={<ArrowRightIcon />}
                            sx={{
                              color: 'primary.main',
                              fontWeight: 600,
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
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
                  No articles found
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                  Try adjusting your search or filter criteria
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('All');
                    setSortBy('newest');
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                  mx: 0.5
                }
              }}
            />
          </Box>
        )}
      </Container>
    </motion.div>
  );
};

export default BlogList;