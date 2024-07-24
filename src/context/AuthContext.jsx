import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create Context
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user data from local storage on initial load
    const savedUser = localStorage.getItem('royal-staff-login');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  // Access environment variable
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  // Login function
  const login = async (formData) => {
    console.log('Sending login request with:', formData);
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Login response:', response.data);
      setUser(response.data.user);

      // Save user data in local storage
      localStorage.setItem('royal-staff-login', JSON.stringify(response.data.user));

      navigate('/dashboard'); // Redirect on successful login
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
    }
  };

  // Logout function
  const logout = () => {
    // Clear user data from local storage
    localStorage.removeItem('royal-staff-login');

    // Clear user state
    setUser(null);

    // Redirect to login page or home page
    navigate('/');
  };

  // Change Password function
  const changePassword = async (username, currentPassword, newPassword) => {
    try {
      await axios.post(`${apiUrl}/auth/change-password`, {
        username,
        currentPassword,
        newPassword,
      });
      // Optionally handle successful password change
    } catch (error) {
      console.error('Password change failed:', error.response?.data?.message || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
