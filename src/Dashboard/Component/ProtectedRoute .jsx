import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('royal-staff-login');

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
