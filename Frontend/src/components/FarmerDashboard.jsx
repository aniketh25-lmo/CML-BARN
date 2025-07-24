import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { FiCamera, FiMessageSquare, FiTrendingUp, FiClock } from 'react-icons/fi';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom'; // ✅ Added

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth });
  useEffect(() => {
    const handleResize = () => setWindowDimensions({ width: window.innerWidth });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimensions;
};

const FarmerHome = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 640;

  const [uploadCardHover, setUploadCardHover] = useState(false);
  const [insightsCardHover, setInsightsCardHover] = useState(false);
  const [farmer, setFarmer] = useState(null);

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const token = localStorage.getItem('farmerToken');
        if (!token) throw new Error('No token found');

        const decoded = jwtDecode(token);
        const aadharNumber = decoded.aadharNumber;
        if (!aadharNumber) throw new Error('Invalid token: Aadhar number missing');

        const res = await fetch(`http://localhost:5000/api/farmers/get/${aadharNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch farmer data');
        const data = await res.json();
        setFarmer(data);
      } catch (error) {
        console.error('Error fetching farmer:', error);
      }
    };
    fetchFarmerData();
  }, []);

  const styles = {
    pageWrapper: { minHeight: '100vh', backgroundColor: '#F9FAFB' },
    container: { fontFamily: 'sans-serif', padding: isSmallScreen ? '24px' : '32px' },
    maxWidthWrapper: { maxWidth: '1280px', margin: '0 auto' },
    header: { marginBottom: '40px' },
    greeting: { fontSize: '1.125rem', color: '#6B7280' },
    userName: { fontSize: isSmallScreen ? '1.875rem' : '2.25rem', fontWeight: 'bold', color: '#1F2937', marginTop: '4px' },
    subheading: { fontSize: '1rem', color: '#6B7280', marginTop: '4px' },
    section: { marginBottom: '40px' },
    sectionTitle: { fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '16px' },
    grid: { display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(2, 1fr)', gap: '24px' },
    card: {
      backgroundColor: '#FFFFFF',
      padding: '24px',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease-in-out',
      cursor: 'pointer',
      textDecoration: 'none'
    },
    cardHover: { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' },
    cardTitle: { fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginTop: '12px' },
    cardSubtitle: { fontSize: '0.875rem', color: '#6B7280' },
    statNumber: { fontSize: '2.25rem', fontWeight: 'bold', color: '#1F2937', marginTop: '8px' },
    statLabel: { color: '#6B7280' },
    activityList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    infoList: { backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', lineHeight: 1.6 },
    badge: { backgroundColor: '#E5E7EB', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', marginRight: '6px' }
  };

  if (!farmer) {
    return (
      <div style={styles.pageWrapper}>
        <Navbar />
        <div style={styles.container}>
          <h2>Loading Farmer Details...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <main>
        <div style={styles.container}>
          <div style={styles.maxWidthWrapper}>
            <header style={styles.header}>
              <p style={styles.greeting}>Welcome Back,</p>
              <h1 style={styles.userName}>{farmer.fullName}</h1>
              <p style={styles.subheading}>Aadhar: {farmer.aadharNumber}</p>
              <p style={styles.subheading}>Phone: {farmer.phoneNumber}</p>
            </header>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Quick Actions</h2>
              <div style={styles.grid}>
                <div
                  style={{ ...styles.card, ...(uploadCardHover && styles.cardHover) }}
                  onMouseEnter={() => setUploadCardHover(true)}
                  onMouseLeave={() => setUploadCardHover(false)}
                >
                  <FiCamera size={32} color="#22C55E" />
                  <h3 style={styles.cardTitle}>Upload Photo (Only available in mobile)</h3>
                  <p style={styles.cardSubtitle}>Get instant crop analysis</p>
                </div>
                
                {/* ✅ Wrapped View Insights in Link */}
                <Link
                  to="/farmer-insights"
                  style={{ ...styles.card, ...(insightsCardHover && styles.cardHover) }}
                  onMouseEnter={() => setInsightsCardHover(true)}
                  onMouseLeave={() => setInsightsCardHover(false)}
                >
                  <FiMessageSquare size={32} color="#22C55E" />
                  <h3 style={styles.cardTitle}>View Insights</h3>
                  <p style={styles.cardSubtitle}>Expert recommendations</p>
                </Link>
              </div>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Land & Practices</h2>
              <div style={styles.infoList}>
                <p><strong>Land Area:</strong> {farmer.landArea} {farmer.landUnit}</p>
                <p><strong>Cultivation Practices:</strong> {farmer.cultivationPractices || 'Not Provided'}</p>
              </div>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Crops Being Sown</h2>
              <div style={styles.infoList}>
                {farmer.cropsSowing?.length > 0 ? (
                  farmer.cropsSowing.map((crop, index) => (
                    <p key={index}>
                      <strong>{crop.name}</strong> — {crop.quantity} {crop.unit}
                    </p>
                  ))
                ) : (
                  <p>No crop data available</p>
                )}
              </div>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Livestock</h2>
              <div style={styles.infoList}>
                {farmer.livestock?.length > 0 ? (
                  farmer.livestock.map((item, index) => (
                    <div key={index}>
                      <p><strong>{item.type}</strong> — {item.count} animals</p>
                      <p><strong>Practices:</strong> {item.rearingPractices}</p>
                      <hr />
                    </div>
                  ))
                ) : (
                  <p>No livestock data</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerHome;
