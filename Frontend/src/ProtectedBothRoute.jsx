import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedBothRoute = ({ children }) => {
  const managerToken = localStorage.getItem('managerToken');
  const farmerToken = localStorage.getItem('farmerToken');

  if (!managerToken && !farmerToken) {
    alert('You must be logged in to access this page.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedBothRoute;
