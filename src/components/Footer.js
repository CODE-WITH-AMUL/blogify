import React from 'react';
import { motion } from 'framer-motion';
import { Box, Link, Typography } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#111827',
    color: 'white',
    padding: '3rem 0 1rem',
    marginTop: '5rem',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  };

  const sectionStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '2rem',
    marginBottom: '2rem',
  };

  const textSecondary = { color: '#9ca3af' };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      style={footerStyle}
    >
      <div style={containerStyle}>
        <Box sx={sectionStyle}>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <Typography variant="h6" gutterBottom>Code With Amul</Typography>
            <Typography variant="body2" sx={textSecondary}>Crafting stories with elegance.</Typography>
            <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
              <Link href="#" sx={{ color: 'inherit', '&:hover': { color: '#667eea' } }}><Facebook /></Link>
              <Link href="#" sx={{ color: 'inherit', '&:hover': { color: '#667eea' } }}><Twitter /></Link>
              <Link href="#" sx={{ color: 'inherit', '&:hover': { color: '#667eea' } }}><LinkedIn /></Link>
              <Link href="#" sx={{ color: 'inherit', '&:hover': { color: '#667eea' } }}><Instagram /></Link>
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <Typography variant="h6" gutterBottom>Quick Links</Typography>
            <Link href="/" display="block" sx={{ ...textSecondary, marginBottom: 1, textDecoration: 'none' }}>Home</Link>
            <Link href="/blog" display="block" sx={{ ...textSecondary, marginBottom: 1, textDecoration: 'none' }}>Blog</Link>
            <Link href="/about" display="block" sx={{ ...textSecondary, marginBottom: 1, textDecoration: 'none' }}>About</Link>
            <Link href="/contact" display="block" sx={{ ...textSecondary, textDecoration: 'none' }}>Contact</Link>
          </Box>
          <Box sx={{ flex: 1, minWidth: '200px' }}>
            <Typography variant="h6" gutterBottom>Contact</Typography>
            <Typography variant="body2" sx={{ ...textSecondary, marginBottom: 1 }}>Email: amulshar80@gmail.com</Typography>
          </Box>
        </Box>
        <hr style={{ borderColor: '#374151', margin: '2rem 0' }} />
        <Typography variant="body2" align="center" sx={textSecondary}>
          © 2025 Code With Amul. All rights reserved.
        </Typography>
      </div>
    </motion.footer>
  );
};

export default Footer;