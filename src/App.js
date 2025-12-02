// src/App.js (Complete Code - Includes HelmetProvider to Fix All Errors)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { motion } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async'; // Fixes HelmetDispatcher 'add' error by providing context
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import Footer from './components/Footer';

const theme = createTheme({
  palette: {
    primary: { main: '#333' },
    secondary: { main: '#667eea' },
    text: {
      secondary: '#6b7280',
    },
    grey: {
      500: '#6b7280',
      600: '#4b5563',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelmetProvider> {/* Essential wrapper - resolves all 'Cannot read properties of undefined (reading 'add')' errors */}
        <Router>
          <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ flex: 1 }}
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </motion.main>
            <Footer />
          </div>
        </Router>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;