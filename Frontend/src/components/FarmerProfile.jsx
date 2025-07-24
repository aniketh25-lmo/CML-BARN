import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { FiEdit3 } from 'react-icons/fi';
import { jwtDecode } from 'jwt-decode';

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth });
  useEffect(() => {
    const handleResize = () => setWindowDimensions({ width: window.innerWidth });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimensions;
};

const LogoutModal = ({ onConfirm, onCancel }) => {
  const styles = {
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
    modalContent: { backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' },
    modalTitle: { fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' },
    modalText: { fontSize: '1rem', color: '#6B7280', marginBottom: '24px' },
    modalActions: { display: 'flex', gap: '12px' },
    button: { flex: 1, padding: '12px', fontSize: '1rem', fontWeight: '500', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' },
    cancelButton: { backgroundColor: '#E5E7EB', color: '#1F2937' },
    confirmButton: { backgroundColor: '#EF4444', color: '#FFFFFF' },
  };
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h3 style={styles.modalTitle}>Sign Out</h3>
        <p style={styles.modalText}>Are you sure you want to sign out?</p>
        <div style={styles.modalActions}>
          <button style={{ ...styles.button, ...styles.cancelButton }} onClick={onCancel}>Cancel</button>
          <button style={{ ...styles.button, ...styles.confirmButton }} onClick={onConfirm}>Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default function FarmerProfile() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [farmer, setFarmer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const logout = () => {
    localStorage.removeItem('farmerToken');
    setShowLogoutModal(false);
    window.location.href = '/';
  };

  useEffect(() => {
    const token = localStorage.getItem('farmerToken');
    if (!token) return;

    const { aadharNumber } = jwtDecode(token);
    fetch(`http://localhost:5000/api/farmers/get/${aadharNumber}`)
      .then(res => res.json())
      .then(data => {
        setFarmer(data);
        setFormData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch profile.');
        setLoading(false);
      });
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveChanges = () => {
    const token = localStorage.getItem('farmerToken');
    const { aadharNumber } = jwtDecode(token);

    fetch(`http://localhost:5000/api/farmers/update/${aadharNumber}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        setFarmer(data);
        setEditing(false);
        alert('Profile updated successfully!');
      })
      .catch(err => {
        alert('Update failed.');
      });
  };

  const styles = {
    wrapper: { padding: '20px', backgroundColor: '#F9FAFB', minHeight: '100vh' },
    section: { background: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    field: { marginBottom: '12px' },
    label: { fontWeight: '500', display: 'block', marginBottom: '4px', color: '#374151' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' },
    button: { padding: '10px 16px', marginRight: '8px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    save: { backgroundColor: '#22C55E', color: '#fff' },
    cancel: { backgroundColor: '#E5E7EB', color: '#111827' },
    editBtn: { backgroundColor: '#3B82F6', color: '#fff', marginLeft: 'auto' },
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '24px', color: 'red' }}>{error}</div>;

  return (
    <div style={styles.wrapper}>
      <Navbar />
      {showLogoutModal && <LogoutModal onConfirm={logout} onCancel={() => setShowLogoutModal(false)} />}
      
      <div style={styles.section}>
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Farmer Profile
          {!editing && <button style={{ ...styles.button, ...styles.editBtn }} onClick={() => setEditing(true)}><FiEdit3 /> Edit</button>}
        </h2>

        {/* Editable Basic Info */}
        {[
          { label: 'Full Name', field: 'fullName' },
          { label: 'Phone Number', field: 'phoneNumber' },
          { label: 'Aadhar Number', field: 'aadharNumber' },
          { label: 'Cultivation Practices', field: 'cultivationPractices' },
          { label: 'Land Area', field: 'landArea' },
          { label: 'Land Unit', field: 'landUnit' },
        ].map(({ label, field }) => (
          <div key={field} style={styles.field}>
            <label style={styles.label}>{label}</label>
            {editing ? (
              <input
                style={styles.input}
                value={formData[field] || ''}
                onChange={e => handleInputChange(field, e.target.value)}
              />
            ) : (
              <div>{farmer[field] || 'Not provided'}</div>
            )}
          </div>
        ))}

        {/* Crops Sowing Array */}
        <div style={styles.field}>
          <label style={styles.label}>Crops Sowing</label>
          {Array.isArray(farmer.cropsSowing) && farmer.cropsSowing.length > 0 ? (
            farmer.cropsSowing.map((crop, idx) => (
              <div key={idx} style={{ paddingLeft: '1rem', marginBottom: '8px' }}>
                <strong>{crop.name}</strong> - {crop.quantity} {crop.unit}
              </div>
            ))
          ) : (
            <div>Not provided</div>
          )}
        </div>

        {/* Livestock Array */}
        <div style={styles.field}>
          <label style={styles.label}>Livestock</label>
          {Array.isArray(farmer.livestock) && farmer.livestock.length > 0 ? (
            farmer.livestock.map((item, idx) => (
              <div key={idx} style={{ paddingLeft: '1rem', marginBottom: '8px' }}>
                <strong>{item.type}</strong> - {item.count} animals ({item.rearingPractices})
              </div>
            ))
          ) : (
            <div>Not provided</div>
          )}
        </div>

        {editing && (
          <div style={{ marginTop: '16px' }}>
            <button style={{ ...styles.button, ...styles.save }} onClick={saveChanges}>Save</button>
            <button style={{ ...styles.button, ...styles.cancel }} onClick={() => setEditing(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
