import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Inline styles for the component
  const styles = {
    nav: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'all 0.3s ease',
      borderBottom: '1px solid',
      ...(scrolled 
        ? {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }
        : {
            backgroundColor: '#ffffff',
            backdropFilter: 'none',
            boxShadow: 'none'
          }),
      borderColor: '#f3f4f6'
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem',
      height: '64px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 700,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textDecoration: 'none'
    },
    desktopNav: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem'
    },
    navLink: (active) => ({
      position: 'relative',
      padding: '0.25rem 0',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: active 
        ? '#4f46e5'
        : '#4b5563',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      cursor: 'pointer',
      ':hover': {
        color: '#111827'
      }
    }),
    activeIndicator: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '-4px',
      height: '2px',
      backgroundColor: '#4f46e5',
      borderRadius: '2px'
    },
    mobileMenuButton: {
      padding: '0.5rem',
      borderRadius: '0.375rem',
      color: '#4b5563',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: '#f3f4f6'
      }
    },
    mobileMenu: {
      overflow: 'hidden'
    },
    mobileNavItem: (active) => ({
      display: 'block',
      padding: '0.75rem 1rem',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontWeight: 500,
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      color: active 
        ? '#4f46e5'
        : '#4b5563',
      backgroundColor: active 
        ? 'rgba(79, 70, 229, 0.1)'
        : 'transparent',
      ':hover': {
        backgroundColor: '#f3f4f6'
      }
    })
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .hide-on-mobile {
              display: none !important;
            }
          }
          
          @media (min-width: 769px) {
            .hide-on-desktop {
              display: none !important;
            }
          }
        `}
      </style>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20 
        }}
        style={styles.nav}
      >
        <div style={styles.container}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" style={styles.logo}>
              Code With Amul
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hide-on-mobile">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.to}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.to}
                    style={styles.navLink(location.pathname === item.to)}
                    onMouseEnter={(e) => { 
                      if (location.pathname !== item.to) {
                        e.currentTarget.style.color = '#111827';
                      }
                    }}
                    onMouseLeave={(e) => { 
                      if (location.pathname !== item.to) {
                        e.currentTarget.style.color = '#4b5563';
                      }
                    }}
                  >
                    {item.label}
                    {location.pathname === item.to && (
                      <motion.div
                        layoutId="navbar-indicator"
                        style={styles.activeIndicator}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="hide-on-desktop">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={styles.mobileMenuButton}
              aria-expanded={isMenuOpen}
            >
              <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
                {isMenuOpen ? 'Close menu' : 'Open menu'}
              </span>
              {!isMenuOpen ? (
                <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={styles.mobileMenu}
              className="hide-on-desktop"
            >
              <div style={{ padding: '0.5rem 1rem 1rem' }}>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      style={styles.mobileNavItem(location.pathname === item.to)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;