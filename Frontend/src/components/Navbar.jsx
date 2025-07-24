import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiLogOut, FiMenu, FiX, FiHome, FiBarChart2, FiUserCheck,
  FiGift, FiMessageSquare, FiTrendingUp, FiCloud
} from 'react-icons/fi';

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth });
  useEffect(() => {
    function handleResize() { setWindowDimensions({ width: window.innerWidth }); }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimensions;
};

const Navbar = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('farmerToken');
    navigate('/');
  };

  const styles = {
    navbar: {
      backgroundColor: '#FFFFFF',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      position: 'sticky',   // 🔥 Stick to top
      top: 0,                // 🔥 Stick to top
      zIndex: 1000,
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#16A34A',
      textDecoration: 'none',
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
    },
    navLink: {
      fontSize: '1rem',
      fontWeight: '500',
      color: '#374151',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    profileContainer: {
      position: 'relative',
    },
    profileButton: {
      backgroundColor: '#F3F4F6',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    profileDropdown: {
      position: 'absolute',
      right: 0,
      top: '50px',
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      width: '160px',
      overflow: 'hidden',
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      color: '#374151',
      cursor: 'pointer',
      fontSize: '0.9rem',
      textDecoration: 'none',
    },
    mobileMenuIcon: {
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
    },
    mobileMenu: {
      position: 'absolute',
      top: '64px',
      left: 0,
      right: 0,
      backgroundColor: '#FFFFFF',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 999,
    }
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/farmer-home" style={styles.logo} onClick={closeAllMenus}>Farmly</Link>

      {isMobile ? (
        <div style={styles.rightSection}>
          <div style={styles.profileContainer} ref={profileDropdownRef}>
            <button style={styles.profileButton} onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <FiUser size={20} color="#4B5563" />
            </button>
            {isProfileOpen && (
              <div style={styles.profileDropdown}>
                <Link to="/farmer-profile" style={styles.dropdownItem} onClick={closeAllMenus}>
                  <FiUserCheck size={16} /> Profile
                </Link>
                <div style={styles.dropdownItem} onClick={handleLogout}>
                  <FiLogOut size={16} /> Logout
                </div>
              </div>
            )}
          </div>
          <button style={styles.mobileMenuIcon} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FiX size={28} color="#4B5563" /> : <FiMenu size={28} color="#4B5563" />}
          </button>
        </div>
      ) : (
        <div style={styles.navLinks}>
          <Link to="/farmer-dashboard" style={styles.navLink}><FiHome /> Home</Link>
          <Link to="/farmer-insights" style={styles.navLink}><FiBarChart2 /> Insights</Link>
          <Link to="/farmer-schemes" style={styles.navLink}><FiGift /> Schemes</Link>
          <Link to="/chat-stream" style={styles.navLink}><FiMessageSquare /> Chat</Link>
          <Link to="/sell" style={styles.navLink}><FiTrendingUp /> Sell</Link>
          <Link to="/weather-alert" style={styles.navLink}><FiCloud /> Weather</Link>
          <div style={styles.profileContainer} ref={profileDropdownRef}>
            <button style={styles.profileButton} onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <FiUser size={20} color="#4B5563" />
            </button>
            {isProfileOpen && (
              <div style={styles.profileDropdown}>
                <Link to="/farmer-profile" style={styles.dropdownItem} onClick={closeAllMenus}>
                  <FiUserCheck size={16} /> Profile
                </Link>
                <div style={styles.dropdownItem} onClick={handleLogout}>
                  <FiLogOut size={16} /> Logout
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isMobile && isMobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/farmer-home" style={styles.navLink} onClick={closeAllMenus}><FiHome /> Home</Link>
          <Link to="/farmer-insights" style={styles.navLink} onClick={closeAllMenus}><FiBarChart2 /> Insights</Link>
          <Link to="/farmer-schemes" style={styles.navLink} onClick={closeAllMenus}><FiGift /> Schemes</Link>
          <Link to="/chat-stream" style={styles.navLink} onClick={closeAllMenus}><FiMessageSquare /> Chat</Link>
          <Link to="/sell" style={styles.navLink} onClick={closeAllMenus}><FiTrendingUp /> Sell</Link>
          <Link to="/weather-alert" style={styles.navLink} onClick={closeAllMenus}><FiCloud /> Weather</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
