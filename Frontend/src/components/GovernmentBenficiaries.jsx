import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Assuming Navbar is in the same folder

// Helper hook to get window dimensions for responsiveness
const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth });
  useEffect(() => {
    function handleResize() { setWindowDimensions({ width: window.innerWidth }); }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimensions;
};

// --- Placeholder: Simulate fetching schemes from an API ---
function fetchSchemes({ state, category }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allSchemes = [
        { name: "PM-Kisan Samman Nidhi", desc: "Direct income support for small and marginal farmers.", benefits: ["₹6,000/year in 3 installments", "Direct bank transfer"], criteria: "Small/marginal farmers with up to 2 hectares.", deadline: "31 Dec 2025", link: "https://pmkisan.gov.in/", states: ["All"], categories: ["small", "marginal"] },
        { name: "Pradhan Mantri Fasal Bima Yojana", desc: "Crop insurance scheme for protection against crop loss.", benefits: ["Low premium insurance", "Coverage for natural calamities"], criteria: "All farmers growing notified crops.", deadline: "15 July 2025", link: "https://pmfby.gov.in/", states: ["All"], categories: ["small", "marginal", "organic", "tenant"] },
        { name: "Organic Farming Promotion Scheme", desc: "Support for organic farmers with training and subsidies.", benefits: ["Subsidy on organic inputs", "Training programs"], criteria: "Certified organic farmers.", deadline: "30 Sep 2025", link: "#", states: ["Assam", "Punjab"], categories: ["organic"] },
        { name: "Tenant Farmer Credit Scheme", desc: "Credit access for tenant farmers.", benefits: ["Easy loan access", "Lower interest rates"], criteria: "Registered tenant farmers.", deadline: "31 Mar 2026", link: "#", states: ["Karnataka", "Maharashtra"], categories: ["tenant"] },
        { name: "National Micro-Irrigation Fund", desc: "Financial assistance for adopting water-saving micro-irrigation systems.", benefits: ["Subsidy on drip/sprinkler systems", "Technical guidance on installation"], criteria: "All farmers, with priority for water-stressed regions.", deadline: "30 Nov 2025", link: "https://nabard.org/", states: ["Telangana", "Rajasthan"], categories: ["small", "marginal", "organic"] }
      ];

      const filtered = allSchemes.filter(s =>
        (s.states.includes("All") || s.states.includes(state)) &&
        s.categories.includes(category)
      );
      resolve(filtered);
    }, 1200);
  });
}

export default function GovernmentBeneficiaries() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ state: '', land: '', crops: [], category: '' });
  const [error, setError] = useState('');
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setFormValues({ state: '', land: '', crops: [], category: '' });
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name === 'crops') {
      const selected = Array.from(options).filter(opt => opt.selected).map(opt => opt.value);
      setFormValues(v => ({ ...v, [name]: selected }));
    } else {
      setFormValues(v => ({ ...v, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { state, land, crops, category } = formValues;
    setError('');
    setSchemes([]);
    if (!state || !land || Number(land) <= 0 || crops.length === 0 || !category) {
      setError('Please fill in all fields correctly.');
      return;
    }
    setLoading(true);
    try {
      const results = await fetchSchemes({ state, land: Number(land), category });
      setSchemes(results);
    } catch {
      setError('Failed to fetch schemes. Please try again.');
    } finally {
      setLoading(false);
      closeModal();
    }
  };
  
  // All styles are now included here as a JavaScript object
  const styles = {
    container: { fontFamily: 'sans-serif', color: '#1F2937' },
    hero: { textAlign: 'center', padding: isSmallScreen ? '48px 24px' : '80px 24px', backgroundColor: '#F9FAFB' },
    heroTitle: { fontSize: isSmallScreen ? '2.25rem' : '3rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' },
    heroDesc: { fontSize: '1.125rem', color: '#4B5563', maxWidth: '600px', margin: '0 auto 24px' },
    btnPrimary: { backgroundColor: '#16A34A', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
    modalBg: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
    modal: { position: 'relative', backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '500px' },
    modalClose: { position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9CA3AF' },
    modalTitle: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' },
    errorMsg: { backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
    formGroup: { marginBottom: '16px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '500' },
    input: { width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '1rem' },
    multiSelect: { height: '120px' },
    formActions: { marginTop: '24px' },
    schemesSection: { padding: isSmallScreen ? '32px 24px' : '48px 24px', maxWidth: '1200px', margin: '0 auto' },
    sectionTitle: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' },
    spinner: { margin: '48px auto', width: '50px', height: '50px', border: '5px solid #E5E7EB', borderTop: '5px solid #16A34A', borderRadius: '50%', animation: 'spin 1s linear infinite' },
    schemesEmpty: { textAlign: 'center', padding: '48px', backgroundColor: '#F9FAFB', borderRadius: '12px' },
    schemesGrid: { display: 'grid', gridTemplateColumns: isSmallScreen ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' },
    schemeCard: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    schemeTitle: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' },
    schemeDesc: { color: '#6B7280', marginBottom: '16px' },
    schemeBenefits: { listStyle: 'disc', paddingLeft: '20px', marginBottom: '16px' },
    schemeInfo: { fontSize: '0.875rem', color: '#4B5563', marginBottom: '4px' },
    applyBtn: { marginTop: '24px', backgroundColor: '#E5E7EB', color: '#1F2937', textAlign: 'center', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }
  };

  return (
    <div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <Navbar />
      <div style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>Find Your Government Benefits</h1>
          <p style={styles.heroDesc}>
            Discover which government schemes you’re eligible for as a farmer. Get personalized results in seconds.
          </p>
          <button style={styles.btnPrimary} onClick={openModal} aria-haspopup="dialog">
            Check Your Eligibility
          </button>
        </section>

        {modalOpen && (
          <div style={styles.modalBg} role="dialog" aria-modal="true">
            <form style={styles.modal} onSubmit={handleSubmit} autoComplete="off">
              <button type="button" style={styles.modalClose} onClick={closeModal} aria-label="Close">&times;</button>
              <h2 style={styles.modalTitle}>Eligibility Check</h2>
              {error && <div style={styles.errorMsg}>{error}</div>}

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="state">State/District</label>
                <select id="state" name="state" value={formValues.state} onChange={handleChange} required style={styles.input}>
                  <option value="">Select State/District</option>
                  <option value="Assam">Assam</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Telangana">Telangana</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="land">Landholding Size (in acres)</label>
                <input type="number" id="land" name="land" min="0" step="0.01" placeholder="e.g. 2.5" value={formValues.land} onChange={handleChange} required style={styles.input}/>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="crops">Crop Type(s)</label>
                <select id="crops" name="crops" multiple className="multi-select" value={formValues.crops} onChange={handleChange} required style={{...styles.input, ...styles.multiSelect}}>
                  <option value="Rice">Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Pulses">Pulses</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="category">Farmer Category</label>
                <select id="category" name="category" value={formValues.category} onChange={handleChange} required style={styles.input}>
                  <option value="">Select Category</option>
                  <option value="small">Small Farmer</option>
                  <option value="marginal">Marginal Farmer</option>
                  <option value="organic">Organic Farmer</option>
                  <option value="tenant">Tenant Farmer</option>
                </select>
              </div>

              <div style={styles.formActions}>
                <button type="submit" style={styles.btnPrimary}>Show Schemes</button>
              </div>
            </form>
          </div>
        )}

        <section style={styles.schemesSection}>
          <h2 style={styles.sectionTitle}>Eligible Schemes</h2>
          {loading && <div style={styles.spinner} aria-label="Loading"></div>}
          {!loading && schemes.length === 0 && (
            <div style={styles.schemesEmpty}>Fill out the form to see your eligible schemes.</div>
          )}
          <div style={styles.schemesGrid}>
            {schemes.map((scheme, idx) => (
              <div key={idx} style={styles.schemeCard}>
                <div>
                  <div style={styles.schemeTitle}>{scheme.name}</div>
                  <div style={styles.schemeDesc}>{scheme.desc}</div>
                  <ul style={styles.schemeBenefits}>
                    {scheme.benefits.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  <div style={styles.schemeInfo}><strong>Eligibility:</strong> {scheme.criteria}</div>
                  <div style={styles.schemeInfo}><strong>Deadline:</strong> {scheme.deadline}</div>
                </div>
                <a href={scheme.link} target="_blank" rel="noopener noreferrer" style={styles.applyBtn}>
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}