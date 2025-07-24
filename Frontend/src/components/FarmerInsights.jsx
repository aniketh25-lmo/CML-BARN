import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Import Navbar
import { FiCheckCircle, FiClock, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth });
  useEffect(() => {
    function handleResize() { setWindowDimensions({ width: window.innerWidth }); }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimensions;
};

export default function FarmerInsights() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const insights = [
    { id: 1, image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg', title: 'Corn Crop Health Analysis', expert: 'Dr. Sarah Johnson', expertImage: 'https://images.pexels.com/photos/5876695/pexels-photo-5876695.jpeg', status: 'completed', timestamp: '2 hours ago', diagnosis: 'Nitrogen Deficiency', severity: 'moderate', recommendation: 'Apply nitrogen-rich fertilizer immediately. The yellowing in the lower leaves indicates nitrogen deficiency. Recommended dosage: 50kg/acre of urea fertilizer.', tips: ['Monitor soil moisture levels', 'Apply fertilizer during cool morning hours', 'Water thoroughly after application'], },
    { id: 2, image: 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg', title: 'Wheat Field Disease Detection', expert: 'Dr. Michael Chen', expertImage: 'https://images.pexels.com/photos/6652956/pexels-photo-6652956.jpeg', status: 'pending', timestamp: '6 hours ago', diagnosis: null, severity: null, recommendation: null, tips: [], },
    { id: 3, image: 'https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg', title: 'Tomato Plant Health Check', expert: 'Dr. Emily Rodriguez', expertImage: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg', status: 'completed', timestamp: '1 day ago', diagnosis: 'Healthy Growth', severity: 'none', recommendation: 'Your tomato plants are showing excellent health! Continue with current care routine. Consider adding organic compost for enhanced growth.', tips: ['Maintain regular watering schedule', 'Prune lower branches for better air circulation', 'Add mulch around base to retain moisture'], },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FiCheckCircle size={20} color="#22C55E" />;
      case 'pending': return <FiClock size={20} color="#F59E0B" />;
      default: return <FiAlertTriangle size={20} color="#EF4444" />;
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Analysis Complete';
      case 'pending': return 'Under Review';
      default: return 'Needs Attention';
    }
  };
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#EF4444';
      case 'moderate': return '#F59E0B';
      default: return '#22C55E';
    }
  };
  
  const styles = {
    pageWrapper: { minHeight: '100vh', backgroundColor: '#F9FAFB' },
    header: { padding: '24px', backgroundColor: '#FFFFFF', marginBottom: '24px', borderBottom: '1px solid #E5E7EB', },
    title: { fontSize: isSmallScreen ? '1.75rem' : '2.25rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px', },
    subtitle: { fontSize: '1.125rem', color: '#6B7280', },
    contentWrapper: { maxWidth: '900px', margin: '0 auto', padding: isSmallScreen ? '0 16px 32px' : '0 24px 32px', },
    insightCard: { backgroundColor: '#FFFFFF', marginBottom: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden', },
    cropImage: { width: '100%', height: '250px', objectFit: 'cover', backgroundColor: '#E5E7EB', },
    insightContent: { padding: '24px', },
    insightHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px', },
    insightTitle: { fontSize: isSmallScreen ? '1.125rem' : '1.25rem', fontWeight: '600', color: '#1F2937', flex: 1, },
    statusContainer: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, },
    statusText: { fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', },
    expertInfo: { display: 'flex', alignItems: 'center', marginBottom: '24px', },
    expertAvatar: { width: '40px', height: '40px', borderRadius: '50%', marginRight: '12px', },
    expertName: { fontSize: '1rem', fontWeight: '500', color: '#1F2937', },
    timestamp: { fontSize: '0.875rem', color: '#6B7280', },
    analysisContainer: { borderTop: '1px solid #E5E7EB', paddingTop: '24px', },
    diagnosisContainer: { display: 'flex', alignItems: 'center', marginBottom: '16px', },
    diagnosisLabel: { fontSize: '1rem', fontWeight: '600', color: '#374151', marginRight: '8px', },
    diagnosisText: { fontSize: '1rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', color: '#FFFFFF' },
    recommendationTitle: { fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '8px', },
    recommendationText: { fontSize: '1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '24px', },
    tipsContainer: { backgroundColor: '#F0FDF4', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #22C55E', },
    tipsTitle: { fontSize: '1rem', fontWeight: '600', color: '#16A34A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    tipText: { fontSize: '1rem', color: '#15803D', marginBottom: '4px', lineHeight: 1.6, paddingLeft: '8px' },
    pendingContainer: { backgroundColor: '#FFFBEB', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #F59E0B', },
    pendingText: { fontSize: '1rem', color: '#92400E', lineHeight: 1.6, },
    ctaButton: { width: '100%', backgroundColor: '#22C55E', borderRadius: '12px', padding: '16px', textAlign: 'center', fontSize: '1.125rem', fontWeight: '600', color: '#FFFFFF', border: 'none', cursor: 'pointer', marginTop: '16px', },
  };

  return (
    <div style={styles.pageWrapper}>
      <Navbar />
      <main>
        <header style={styles.header}>
            <div style={{maxWidth: '900px', margin: '0 auto'}}>
              <h1 style={styles.title}>Expert Insights</h1>
              <p style={styles.subtitle}>Professional analysis and recommendations for your crops</p>
            </div>
        </header>
        <div style={styles.contentWrapper}>
          {insights.map((insight) => (
            <article key={insight.id} style={styles.insightCard}>
              <img src={insight.image} alt={insight.title} style={styles.cropImage} />
              <div style={styles.insightContent}>
                <div style={styles.insightHeader}>
                  <h2 style={styles.insightTitle}>{insight.title}</h2>
                  <div style={styles.statusContainer}>
                    {getStatusIcon(insight.status)}
                    <span style={styles.statusText}>{getStatusText(insight.status)}</span>
                  </div>
                </div>
                <div style={styles.expertInfo}>
                  <img src={insight.expertImage} alt={insight.expert} style={styles.expertAvatar} />
                  <div>
                    <p style={styles.expertName}>{insight.expert}</p>
                    <p style={styles.timestamp}>{insight.timestamp}</p>
                  </div>
                </div>
                {insight.status === 'completed' && (
                  <section style={styles.analysisContainer}>
                    <div style={styles.diagnosisContainer}>
                      <p style={styles.diagnosisLabel}>Diagnosis:</p>
                      <span style={{...styles.diagnosisText, backgroundColor: getSeverityColor(insight.severity)}}>{insight.diagnosis}</span>
                    </div>
                    <h3 style={styles.recommendationTitle}>Recommendation:</h3>
                    <p style={styles.recommendationText}>{insight.recommendation}</p>
                    {insight.tips.length > 0 && (
                      <div style={styles.tipsContainer}>
                        <h4 style={styles.tipsTitle}><FiInfo /> Additional Tips:</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {insight.tips.map((tip, index) => (
                            <li key={index} style={styles.tipText}>- {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>
                )}
                {insight.status === 'pending' && (
                  <div style={styles.pendingContainer}>
                    <p style={styles.pendingText}>Your image is being analyzed by our expert team. You will receive detailed insights soon.</p>
                  </div>
                )}
              </div>
            </article>
          ))}
          <button style={styles.ctaButton}>
            Upload New Photo for Analysis (Demo button not functional currently)
          </button>
        </div>
      </main>
    </div>
  );
}