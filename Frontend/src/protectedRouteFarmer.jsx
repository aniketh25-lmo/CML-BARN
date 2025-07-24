import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('farmerToken');

  if (!token) {
    alert('You must be logged in to access the dashboard.');
    return <Navigate to="/farmers-login" />;
  }

  return children;
};

export default ProtectedRoute;
