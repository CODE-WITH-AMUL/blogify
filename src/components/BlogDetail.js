// src/pages/BlogDetail.js (Enhanced UI Version)
import React, { useState, useEffect } from 'react';
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
  IconButton,
  Breadcrumbs,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
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
  Person as UserIcon,
  Schedule as ClockIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Visibility as EyeIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
  BookmarkBorder as BookmarkBorderIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import api from '../api/axiosInstance';

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
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);

  useEffect(() => {
    fetchPost();
    fetchRelated();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/posts/${slug}/`);
      setPost(response.data);
      setLikesCount(response.data.likes || 0);
      setViewsCount(response.data.views || 0);
      // Simulate checking if post is bookmarked/liked (replace with actual API calls)
      setIsBookmarked(Math.random() > 0.5);
      setIsLiked(Math.random() > 0.5);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load the article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async () => {
    try {
      const response = await api.get('/api/posts/');
      // Filter related posts by categories
      if (post) {
        const related = response.data
          .filter(p => p.id !== post.id)
          .filter(p => 
            p.categories && 
            post.categories && 
            p.categories.some(cat => 
              post.categories.some(postCat => postCat.id === cat.id)
            )
          )
          .slice(0, 3);
        setRelatedPosts(related);
      } else {
        setRelatedPosts(response.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching related posts:', err);
    }
  };

  const generateTOC = (content) => {
    if (!content) return [];
    const headings = content.match(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/g) || [];
    return headings.map((h, i) => {
      const text = h.replace(/<[^>]*>/g, '');
      const level = h.match(/<h([2-4])/)[1];
      return { 
        id: `toc-${i}`, 
        text: text,
        level: parseInt(level)
      };
    });
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        setLikesCount(prev => prev - 1);
      } else {
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      await api.post(`/api/posts/${post.id}/like/`);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarked(!isBookmarked);
      await api.post(`/api/posts/${post.id}/bookmark/`);
    } catch (err) {
      console.error('Error bookmarking post:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
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

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
          Loading article...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/blog')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Articles
        </Button>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Article not found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          The article you're looking for doesn't exist or has been moved.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/blog')}
          startIcon={<ArrowBackIcon />}
        >
          Browse All Articles
        </Button>
      </Container>
    );
  }

  const tocItems = generateTOC(post.content);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Breadcrumb Navigation */}
      <Box sx={{ 
        backgroundColor: '#f8fafc', 
        py: 3,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Container maxWidth="lg">
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Home
            </Link>
            <Link to="/blog" style={{ textDecoration: 'none', color: 'inherit' }}>
              Blog
            </Link>
            <Typography color="text.primary">{post.title}</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={6}>
          {/* Article Content */}
          <Grid item xs={12} lg={tocItems.length > 0 ? 8 : 9}>
            {/* Back Button */}
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/blog')}
              sx={{ mb: 4 }}
            >
              Back to Articles
            </Button>

            {/* Featured Image */}
            {post.featured_image && (
              <Box sx={{
                mb: 5,
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                position: 'relative'
              }}>
                <motion.img
                  src={post.featured_image}
                  alt={post.title}
                  style={{
                    width: '100%',
                    height: '400px',
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
            <Typography variant="h1" sx={{
              fontSize: { xs: '2.5rem', md: '3.2rem' },
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
              mb: 5,
              alignItems: 'center',
              color: 'text.secondary'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                  {post.author?.charAt(0) || 'A'}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {post.author || 'Anonymous'}
                  </Typography>
                  <Typography variant="caption">
                    Senior Developer
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    {formatDate(post.created_date)}
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
                    {viewsCount.toLocaleString()} views
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Categories */}
            <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {post.categories?.map(cat => (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  sx={{
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'primary.main'
                    }
                  }}
                />
              ))}
            </Box>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <Box sx={{ mb: 5, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1, fontWeight: 600 }}>
                  Tags:
                </Typography>
                {post.tags.map(tag => (
                  <Chip
                    key={tag.id || tag}
                    label={typeof tag === 'string' ? tag : tag.name}
                    size="small"
                    variant="outlined"
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

            {/* Article Content */}
            <Paper sx={{ 
              p: { xs: 3, md: 5 }, 
              mb: 6,
              borderRadius: 3,
              backgroundColor: 'background.paper'
            }}>
              <Box
                sx={{
                  lineHeight: 1.8,
                  fontSize: '1.125rem',
                  color: 'text.primary',
                  '& h2': {
                    fontSize: '2rem',
                    fontWeight: 700,
                    mt: 4,
                    mb: 2,
                    color: 'text.primary'
                  },
                  '& h3': {
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    mt: 3,
                    mb: 1.5,
                    color: 'text.primary'
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
                    backgroundColor: '#f1f5f9',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '0.25rem',
                    fontFamily: '"Fira Code", monospace',
                    fontSize: '0.9em'
                  },
                  '& pre': {
                    backgroundColor: '#1e293b',
                    color: '#e2e8f0',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    overflowX: 'auto',
                    mb: 2,
                    fontFamily: '"Fira Code", monospace'
                  },
                  '& blockquote': {
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    pl: 3,
                    py: 1,
                    my: 3,
                    backgroundColor: 'action.hover',
                    fontStyle: 'italic'
                  },
                  '& img': {
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '0.5rem',
                    my: 3
                  }
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </Paper>

            {/* Action Bar */}
            <Box sx={{
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
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={handleLike}
                  sx={{
                    color: isLiked ? 'error.main' : 'text.secondary',
                    borderColor: isLiked ? 'error.main' : 'divider'
                  }}
                >
                  {isLiked ? 'Liked' : 'Like'} ({likesCount})
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  onClick={handleBookmark}
                >
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </Box>

              {/* Share */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Share:
                </Typography>
                <IconButton>
                  <FacebookShareButton url={currentUrl} quote={post.title}>
                    <FacebookIcon size={28} round />
                  </FacebookShareButton>
                </IconButton>
                <IconButton>
                  <TwitterShareButton url={currentUrl} title={post.title}>
                    <TwitterIcon size={28} round />
                  </TwitterShareButton>
                </IconButton>
                <IconButton>
                  <LinkedinShareButton url={currentUrl} title={post.title}>
                    <LinkedinIcon size={28} round />
                  </LinkedinShareButton>
                </IconButton>
                <IconButton>
                  <WhatsappShareButton url={currentUrl} title={post.title}>
                    <WhatsappIcon size={28} round />
                  </WhatsappShareButton>
                </IconButton>
              </Box>
            </Box>

            {/* Author Bio */}
            <Paper sx={{ 
              p: 4, 
              mb: 6,
              borderRadius: 3,
              backgroundColor: 'background.default'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                  {post.author?.charAt(0) || 'A'}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {post.author || 'Anonymous'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Senior Developer & Technical Writer
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1">
                Passionate about sharing knowledge and helping developers grow. 
                Specializes in modern web technologies and best practices.
              </Typography>
            </Paper>
          </Grid>

          {/* Table of Contents (Desktop) */}
          {tocItems.length > 0 && !isMobile && (
            <Grid item xs={12} lg={4}>
              <Paper sx={{ 
                p: 3, 
                position: 'sticky',
                top: 100,
                borderRadius: 3,
                backgroundColor: 'background.paper'
              }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  📋 Table of Contents
                </Typography>
                <List sx={{ 
                  maxHeight: '400px', 
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px'
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '3px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#c1c1c1',
                    borderRadius: '3px'
                  }
                }}>
                  {tocItems.map((item, index) => (
                    <ListItem 
                      key={item.id} 
                      component="a" 
                      href={`#${item.id}`}
                      sx={{ 
                        pl: item.level * 2,
                        py: 0.75,
                        textDecoration: 'none',
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'action.hover'
                        },
                        borderRadius: 1
                      }}
                    >
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: item.level === 2 ? 600 : 400
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
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
              Related Articles
            </Typography>
            <Divider sx={{ mb: 4 }} />
            <Grid container spacing={4}>
              {relatedPosts.map((relatedPost, index) => (
                <Grid item xs={12} md={4} key={relatedPost.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/blog/${relatedPost.slug || relatedPost.id}`} style={{ textDecoration: 'none' }}>
                      <Paper sx={{
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
                        }
                      }}>
                        {relatedPost.featured_image && (
                          <Box
                            component="img"
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            sx={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover'
                            }}
                          />
                        )}
                        <Box sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ 
                            mb: 1.5,
                            fontWeight: 600,
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {relatedPost.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {relatedPost.content?.substring(0, 120)}...
                          </Typography>
                          <Button 
                            endIcon={<NavigateNextIcon />}
                            sx={{ color: 'primary.main', fontWeight: 600 }}
                          >
                            Read Article
                          </Button>
                        </Box>
                      </Paper>
                    </Link>
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