// src/components/BlogDetail.js (Enhanced: TOC Links Now Functional, CSS Classes Added for Beauty, All Fixes Applied)
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  Container,
  Avatar,
  Breadcrumbs,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  IconButton
} from '@mui/material';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon
} from 'react-share';
import {
  CalendarToday as CalendarIcon,
  Schedule as ClockIcon,
  Favorite as FavoriteIcon,
  Visibility as EyeIcon,
  Bookmark as BookmarkIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
  BookmarkBorder as BookmarkBorderIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Tag as TagIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import api from '../api/axiosInstance';


// Enhanced HTML sanitizer: Adds IDs to headings for TOC functionality
const sanitizeHTML = (html) => {
  if (!html) return '';
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove potentially dangerous elements
  const dangerousTags = ['script', 'iframe', 'embed', 'object', 'form'];
  dangerousTags.forEach(tag => {
    const elements = tempDiv.getElementsByTagName(tag);
    Array.from(elements).forEach(el => el.remove());
  });
  
  // FIXED: Add IDs to headings for TOC links (h2, h3, h4)
  const headings = tempDiv.querySelectorAll('h2, h3, h4');
  headings.forEach((heading, index) => {
    const id = `section-${index}`;
    heading.id = id;
  });
  
  return tempDiv.innerHTML;
};

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch the blog post
  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/api/posts/${slug}/`);
      
      if (!response) {
        throw new Error('No response received from server');
      }
      if (!response.data) {
        throw new Error('Invalid response: No data received from server');
      }
      
      setPost(response.data);
      
      // Check if user has liked/bookmarked
      const savedLikes = JSON.parse(localStorage.getItem('blog_likes') || '[]');
      const savedBookmarks = JSON.parse(localStorage.getItem('blog_bookmarks') || '[]');
      
      setIsLiked(savedLikes.includes(response.data.id));
      setIsBookmarked(savedBookmarks.includes(response.data.id));
    } catch (err) {
      console.error('Error fetching blog post:', err);
      
      if (err.response?.status === 404) {
        setError('Blog post not found. It may have been removed or the URL is incorrect.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        setError(err.message || 'Failed to load the blog post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Fetch related posts
  const fetchRelatedPosts = useCallback(async () => {
    try {
      if (!post?.id) {
        setRelatedPosts([]);
        return;
      }

      const response = await api.get('/api/posts/', {
        params: {
          limit: 3,
        }
      });
      
      if (!response) {
        console.warn('No response for related posts');
        setRelatedPosts([]);
        return;
      }
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Invalid related posts data:', response.data);
        setRelatedPosts([]);
        return;
      }
      
      let filteredPosts = response.data;
      
      // Filter by category if available (client-side fallback)
      if (post?.category) {
        const postCategory = typeof post.category === 'object' ? post.category?.id : post.category;
        filteredPosts = response.data.filter(blog => {
          const blogCategory = typeof blog.category === 'object' ? blog.category?.id : blog.category;
          return blogCategory === postCategory && blog.id !== post.id;
        });
      }
      
      // Exclude current post and limit to 3
      const related = filteredPosts
        .filter(blog => blog.id !== post.id)
        .slice(0, 3);
      
      setRelatedPosts(related);
    } catch (err) {
      console.error('Error fetching related posts:', err);
      setRelatedPosts([]);
    }
  }, [post]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    if (post) {
      fetchRelatedPosts();
    }
  }, [post, fetchRelatedPosts]);

  // Generate Table of Contents from HTML content
  const generateTOC = (content) => {
    if (!content) return [];
    
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      
      const headings = Array.from(tempDiv.querySelectorAll('h2, h3, h4'));
      
      return headings.map((heading, index) => {
        const text = heading.textContent || '';
        const level = parseInt(heading.tagName.charAt(1));
        const id = `section-${index}`;
        
        return { 
          id, 
          text: text.substring(0, 100),
          level
        };
      });
    } catch (err) {
      console.error('Error generating TOC:', err);
      return [];
    }
  };

  // Handle like action
  const handleLike = async () => {
    try {
      const savedLikes = JSON.parse(localStorage.getItem('blog_likes') || '[]');
      
      if (isLiked) {
        const updatedLikes = savedLikes.filter(id => id !== post.id);
        localStorage.setItem('blog_likes', JSON.stringify(updatedLikes));
      } else {
        savedLikes.push(post.id);
        localStorage.setItem('blog_likes', JSON.stringify(savedLikes));
      }
      
      setIsLiked(!isLiked);
      
      // Update like count locally
      setPost(prev => ({
        ...prev,
        likes_count: (prev.likes_count || 0) + (isLiked ? -1 : 1)
      }));
      
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  // Handle bookmark action
  const handleBookmark = async () => {
    try {
      const savedBookmarks = JSON.parse(localStorage.getItem('blog_bookmarks') || '[]');
      
      if (isBookmarked) {
        const updatedBookmarks = savedBookmarks.filter(id => id !== post.id);
        localStorage.setItem('blog_bookmarks', JSON.stringify(updatedBookmarks));
      } else {
        savedBookmarks.push(post.id);
        localStorage.setItem('blog_bookmarks', JSON.stringify(savedBookmarks));
      }
      
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Error updating bookmark:', err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (err) {
      return 'Recent';
    }
  };

  // Calculate read time
  const calculateReadTime = (content) => {
    if (!content) return '3 min read';
    
    try {
      const text = content.replace(/<[^>]*>/g, ' ');
      const words = text.split(/\s+/).filter(word => word.length > 0).length;
      const minutes = Math.ceil(words / 200);
      
      if (minutes === 0) return '< 1 min read';
      if (minutes === 1) return '1 min read';
      return `${minutes} min read`;
    } catch (err) {
      return '5 min read';
    }
  };

  // Get current URL for sharing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Render loading state
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
        <CircularProgress size={60} thickness={4} className="blog-spinner" />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
          Loading blog post...
        </Typography>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: 30
            }
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body1">
            {error}
          </Typography>
        </Alert>
        <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/blog')}
            startIcon={<ArrowBackIcon />}
            size="large"
          >
            Back to Blog
          </Button>
          <Button 
            variant="outlined" 
            onClick={fetchPost}
            size="large"
          >
            Try Again
          </Button>
          <Button 
            variant="text" 
            onClick={() => navigate('/')}
            size="large"
          >
            Go Home
          </Button>
        </Box>
      </Container>
    );
  }

  // Render not found state
  if (!post) {
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
        <Typography variant="h3" sx={{ mb: 3, color: 'text.primary', fontWeight: 700 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Blog Post Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: '600px' }}>
          The blog post you're looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/blog')}
            startIcon={<ArrowBackIcon />}
            size="large"
          >
            Browse All Posts
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
            size="large"
          >
            Go Home
          </Button>
        </Box>
      </Container>
    );
  }

  // Generate TOC
  const tocItems = generateTOC(post.content);

  // Sanitize HTML content (now with IDs added)
  const sanitizedContent = sanitizeHTML(post.content || '');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb Navigation */}
      <Box sx={{ 
        backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50', 
        py: 3,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Container maxWidth="lg">
          <Breadcrumbs 
            aria-label="breadcrumb" 
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ 
              '& .MuiBreadcrumbs-ol': {
                flexWrap: 'nowrap',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }
            }}
          >
            <Link 
              to="/" 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit'
              }}
            >
              Home
            </Link>
            <Link 
              to="/blog" 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit'
              }}
            >
              Blog
            </Link>
            <Typography color="text.primary" noWrap>
              {post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title}
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {/* Article Content */}
          <Grid item xs={12} lg={tocItems.length > 0 && !isMobile ? 8 : 12}>
            {/* Back Button */}
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/blog')}
              sx={{ mb: 4 }}
              variant="text"
            >
              Back to Blog
            </Button>

            {/* Featured Image */}
            {post.featured_image && (
              <Box className="blog-image-overlay" sx={{
                mb: 5,
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                position: 'relative',
                height: { xs: '250px', md: '400px' }
              }}>
                <motion.img
                  src={post.featured_image}
                  alt={post.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </Box>
            )}

            {/* Title */}
            <Typography variant="h1" className="blog-title" sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              mb: 3,
              lineHeight: 1.2,
              color: 'text.primary'
            }}>
              {post.title}
            </Typography>

            {/* Meta Information */}
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              mb: 4,
              alignItems: 'center',
              color: 'text.secondary'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: 'primary.main',
                  fontSize: '1.2rem'
                }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {post.author || post.author_name || 'Anonymous Author'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">
                        {formatDate(post.published_date || post.created_date)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ClockIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">
                        {calculateReadTime(post.content)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EyeIcon sx={{ fontSize: 16 }} />
                      <Typography variant="body2">
                        {(post.views || 0).toLocaleString()} views
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Categories and Tags */}
            <Box sx={{ mb: 4 }}>
              {/* Categories */}
              {post.category && (
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                  <CategoryIcon sx={{ fontSize: 18, mr: 1 }} />
                  <Chip
                    label={typeof post.category === 'object' ? post.category.name : post.category}
                    sx={{
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'primary.main'
                      }
                    }}
                    size="small"
                  />
                </Box>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                  <TagIcon sx={{ fontSize: 18, mr: 1 }} />
                  {post.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={typeof tag === 'string' ? tag : tag.name}
                      size="small"
                      variant="outlined"
                      className="blog-tag-chip"
                      sx={{
                        fontSize: '0.75rem',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Article Content */}
            <Paper className="blog-card-shadow" sx={{ 
              p: { xs: 3, md: 4 }, 
              mb: 6,
              borderRadius: 3,
              backgroundColor: 'background.paper'
            }}>
              <Box
                sx={{
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  color: 'text.primary',
                  '& h2': {
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                    fontWeight: 700,
                    mt: 4,
                    mb: 2,
                    color: 'text.primary',
                    scrollMarginTop: '80px' // For smooth scroll offset
                  },
                  '& h3': {
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 600,
                    mt: 3,
                    mb: 1.5,
                    color: 'text.primary',
                    scrollMarginTop: '80px'
                  },
                  '& h4': {
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    fontWeight: 600,
                    mt: 2.5,
                    mb: 1,
                    color: 'text.primary',
                    scrollMarginTop: '80px'
                  },
                  '& p': {
                    mb: 2
                  },
                  '& a': {
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  },
                  '& code': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '0.25rem',
                    fontFamily: 'monospace',
                    fontSize: '0.9em'
                  },
                  '& pre': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
                    color: theme.palette.mode === 'dark' ? 'grey.100' : 'grey.900',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    overflowX: 'auto',
                    mb: 2,
                    fontFamily: 'monospace',
                    fontSize: '0.9rem'
                  },
                  '& blockquote': {
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    pl: 3,
                    py: 1,
                    my: 3,
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                    fontStyle: 'italic',
                    borderRadius: '0 0.5rem 0.5rem 0'
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '0.5rem',
                    my: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  },
                  '& ul, & ol': {
                    pl: 3,
                    mb: 2
                  },
                  '& li': {
                    mb: 0.5
                  }
                }}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </Paper>

            {/* Action Bar */}
            <Box className="blog-card-shadow" sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 6,
              p: 3,
              backgroundColor: 'background.default',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              {/* Like and Bookmark */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={handleLike}
                  sx={{
                    color: isLiked ? 'error.main' : 'text.secondary',
                    borderColor: isLiked ? 'error.main' : 'divider',
                    '&:hover': {
                      borderColor: isLiked ? 'error.dark' : 'text.primary'
                    }
                  }}
                >
                  {isLiked ? 'Liked' : 'Like'} ({post.likes_count || 0})
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  onClick={handleBookmark}
                  sx={{
                    color: isBookmarked ? 'primary.main' : 'text.secondary',
                    borderColor: isBookmarked ? 'primary.main' : 'divider'
                  }}
                >
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </Box>

              {/* Share */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <ShareIcon sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', mr: 2 }}>
                  Share:
                </Typography>
                <IconButton size="small">
                  <FacebookShareButton url={currentUrl} quote={post.title}>
                    <FacebookIcon size={28} round />
                  </FacebookShareButton>
                </IconButton>
                <IconButton size="small">
                  <TwitterShareButton url={currentUrl} title={post.title}>
                    <TwitterIcon size={28} round />
                  </TwitterShareButton>
                </IconButton>
                <IconButton size="small">
                  <LinkedinShareButton url={currentUrl} title={post.title}>
                    <LinkedinIcon size={28} round />
                  </LinkedinShareButton>
                </IconButton>
                <IconButton size="small">
                  <WhatsappShareButton url={currentUrl} title={post.title}>
                    <WhatsappIcon size={28} round />
                  </WhatsappShareButton>
                </IconButton>
              </Box>
            </Box>

            {/* Author Bio */}
            <Paper className="blog-card-shadow" sx={{ 
              p: 4, 
              mb: 6,
              borderRadius: 3,
              backgroundColor: 'background.default',
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                About the Author
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Avatar sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}>
                  {(post.author || post.author_name || 'A').charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                    {post.author || post.author_name || 'Anonymous Author'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {post.author_title || 'Senior Developer & Technical Writer'}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {post.author_bio || 'Passionate about web development technologies and sharing knowledge with the community. Specializes in modern web technologies and best practices.'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Table of Contents (Desktop) */}
          {tocItems.length > 0 && !isMobile && (
            <Grid item xs={12} lg={4}>
              <Paper className="blog-card-shadow" sx={{ 
                p: 3, 
                position: 'sticky',
                top: 100,
                borderRadius: 3,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                maxHeight: 'calc(100vh - 140px)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  📋 Table of Contents
                </Typography>
                <List sx={{ 
                  flex: 1,
                  overflow: 'auto',
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '6px'
                  },
                  '&::-webkit-scrollbar-track': {
                    background: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                    borderRadius: '3px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.400',
                    borderRadius: '3px'
                  }
                }}>
                  {tocItems.map((item, index) => (
                    <ListItem 
                      key={index} 
                      component="a" 
                      href={`#${item.id}`}
                      sx={{ 
                        pl: item.level === 2 ? 2 : item.level === 3 ? 4 : 6,
                        py: 1,
                        textDecoration: 'none',
                        color: 'text.secondary',
                        borderLeft: '2px solid',
                        borderColor: 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'action.hover',
                          borderColor: 'primary.main'
                        },
                        borderRadius: '0 8px 8px 0',
                        mb: 0.5
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(item.id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                    >
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: item.level === 2 ? 600 : 400,
                          noWrap: true,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" sx={{ 
              mb: 4, 
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2rem' }
            }}>
              📚 Related Articles
            </Typography>
            <Divider sx={{ mb: 4 }} />
            <Grid container spacing={3}>
              {relatedPosts.map((relatedPost, index) => (
                <Grid item xs={12} sm={6} md={4} key={relatedPost.id || index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="blog-card-shadow blog-card-hover" sx={{
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                      }
                    }}>
                      {relatedPost.featured_image && (
                        <CardMedia
                          component="img"
                          height="180"
                          image={relatedPost.featured_image}
                          alt={relatedPost.title}
                          sx={{
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography 
                          variant="h6" 
                          className="blog-title"
                          sx={{ 
                            mb: 1.5,
                            fontWeight: 600,
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '3em'
                          }}
                        >
                          {relatedPost.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '4.5em'
                          }}
                        >
                          {relatedPost.excerpt || relatedPost.content?.substring(0, 120)?.replace(/<[^>]*>/g, '') || 'No description available'}...
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          mt: 'auto'
                        }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(relatedPost.published_date || relatedPost.created_date)}
                          </Typography>
                          <Button 
                            endIcon={<NavigateNextIcon />}
                            sx={{ 
                              color: 'primary.main', 
                              fontWeight: 600,
                              textTransform: 'none',
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.04)'
                              }
                            }}
                            component={Link}
                            to={`/blog/${relatedPost.slug || relatedPost.id}`}
                          >
                            Read
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </motion.div>
  );
};

export default BlogDetail;