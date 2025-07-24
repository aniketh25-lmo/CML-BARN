import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const ManagerPrivateRoute = ({ children }) => {
  const token = localStorage.getItem('managerToken');

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);

    // Check if the manager is authorized
    if (decoded?.role === 'manager' && decoded?.isAuthorized === true) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/" />;
  }
};

export default ManagerPrivateRoute;
