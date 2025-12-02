import React from 'react';
import { motion } from 'framer-motion';
import { Typography, TextField, Button, Box } from '@mui/material';

const ContactPage = () => {
  const pageStyle = { padding: '5rem 0' };
  const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' };
  const formStyle = { maxWidth: '500px', margin: '0 auto' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={pageStyle}
    >
      <div style={containerStyle}>
        <Typography variant="h2" align="center" sx={{ marginBottom: '3rem' }}>Contact Us</Typography>
        <Box component="form" sx={formStyle}>
          <TextField fullWidth label="Name" margin="normal" />
          <TextField fullWidth label="Email" margin="normal" />
          <TextField fullWidth label="Message" multiline rows={4} margin="normal" />
          <Button type="submit" variant="contained" fullWidth sx={{ marginTop: 2, padding: '1rem' }} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            Send Message
          </Button>
        </Box>
      </div>
    </motion.div>
  );
};

export default ContactPage;