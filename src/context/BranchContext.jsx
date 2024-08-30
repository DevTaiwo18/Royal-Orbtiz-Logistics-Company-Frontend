import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const BranchContext = createContext();

export const useBranch = () => useContext(BranchContext);

export const BranchProvider = ({ children }) => {
  const [branch, setBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_APP_API_URL;

  // Login Branch
  const loginBranch = async (name, password) => {
    try {
      const response = await axios.post(`${apiUrl}/branch/login`, { name, password });
      setBranch(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  // Change Password
  const changePassword = async (name, oldPassword, newPassword) => {
    try {
      const response = await axios.put(`${apiUrl}/branch/change-password`, { name, oldPassword, newPassword });
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    }
  };

  // Create Branch
  const createBranch = async (name, password) => {
    try {
      const response = await axios.post(`${apiUrl}/branch/create`, { name, password });
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Branch creation failed');
    }
  };

  // Get Branch
  const getBranch = async (name) => {
    try {
      const response = await axios.get(`${apiUrl}/branch/${name}`);
      setBranch(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch branch');
    }
  };

  // Get All Branches
  const fetchAllBranches = async () => {
    try {
      const response = await axios.get(`${apiUrl}/branch`);
      setBranches(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch branches');
    }
  };

  return (
    <BranchContext.Provider value={{ branch, branches, loginBranch, changePassword, createBranch, getBranch, fetchAllBranches, error }}>
      {children}
    </BranchContext.Provider>
  );
};
