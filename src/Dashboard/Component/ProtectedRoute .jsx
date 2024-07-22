import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check for 'royal-staff-login' in localStorage
  const isAuthenticated = !!localStorage.getItem('royal-staff-login');

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
