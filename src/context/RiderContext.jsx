import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create Context
const RiderContext = createContext();

// RiderProvider Component
export const RiderProvider = ({ children }) => {
  const [riders, setRiders] = useState([]);
  
  // Access environment variable
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  // Fetch all riders
  const fetchRiders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/riders/`);
      setRiders(response.data);
    } catch (error) {
      console.error('Error fetching riders:', error.response?.data?.message || error.message);
    }
  };

  // Create a new rider
  const createRider = async (riderData) => {
    try {
      const response = await axios.post(`${apiUrl}/riders/`, riderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setRiders([...riders, response.data]);
    } catch (error) {
      console.error('Error creating rider:', error.response?.data?.message || error.message);
      throw error; // Rethrow error for handling in component
    }
  };

  // Update a rider by ID
  const updateRider = async (riderId, updatedData) => {
    try {
      const response = await axios.put(`${apiUrl}/riders/${riderId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setRiders(riders.map((rider) => (rider._id === riderId ? response.data : rider)));
    } catch (error) {
      console.error('Error updating rider:', error.response?.data?.message || error.message);
      throw error; // Rethrow error for handling in component
    }
  };

  // Delete a rider by ID
  const deleteRider = async (riderId) => {
    try {
      await axios.delete(`${apiUrl}/riders/${riderId}`);
      setRiders(riders.filter((rider) => rider._id !== riderId));
    } catch (error) {
      console.error('Error deleting rider:', error.response?.data?.message || error.message);
    }
  };

  // Load riders when the component mounts
  useEffect(() => {
    fetchRiders();
  }, []);

  return (
    <RiderContext.Provider value={{ riders, fetchRiders, createRider, updateRider, deleteRider }}>
      {children}
    </RiderContext.Provider>
  );
};

// Custom hook to use the RiderContext
export const useRiders = () => {
  return useContext(RiderContext);
};
