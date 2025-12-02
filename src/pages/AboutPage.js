import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '@mui/material';

const AboutPage = () => {
  const pageStyle = { padding: '5rem 0' };
  const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' };
  const contentStyle = { maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={pageStyle}
    >
      <div style={containerStyle}>
        <Typography variant="h2" align="center" sx={{ marginBottom: '3rem' }}>About Code With Amul</Typography>
        <Typography variant="body1" sx={contentStyle}>
          This Blog is your go-to destination for professional, well-crafted articles. 
          Inspired by platforms like Medium and Dev.to, we focus on clean design, 
          responsive layouts, and engaging user experiences.
        </Typography>
      </div>
    </motion.div>
  );
};

export default AboutPage;