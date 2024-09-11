import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create Context
const PayrollContext = createContext();

// PayrollProvider Component
export const PayrollProvider = ({ children }) => {
  const [payrolls, setPayrolls] = useState([]);
  const navigate = useNavigate();

  // Access environment variable for API URL
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  // Fetch all payrolls
  const fetchPayrolls = async () => {
    try {
      const response = await axios.get(`${apiUrl}/payroll/`);
      setPayrolls(response.data);
    } catch (error) {
      console.error('Error fetching payrolls:', error.response?.data?.message || error.message);
    }
  };

  // Create a new payroll entry
  const createPayroll = async (payrollData) => {
    try {
      const response = await axios.post(`${apiUrl}/payroll/`, payrollData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Add new payroll to state
      setPayrolls([...payrolls, response.data.payroll]);
      return response.data.payroll; // Return the created payroll for further use
    } catch (error) {
      console.error('Error creating payroll:', error.response?.data?.message || error.message);
      throw error; // Rethrow error for handling in component
    }
  };

  // Delete a payroll entry by ID
  const deletePayroll = async (payrollId) => {
    try {
      await axios.delete(`${apiUrl}/payroll/${payrollId}`);
      // Remove payroll from state
      setPayrolls(payrolls.filter((payroll) => payroll._id !== payrollId));
    } catch (error) {
      console.error('Error deleting payroll:', error.response?.data?.message || error.message);
    }
  };

  // Update a payroll entry by ID
  const updatePayroll = async (payrollId, updatedData) => {
    console.log(payrollId, updatedData)
    try {
      const response = await axios.put(`${apiUrl}/payroll/${payrollId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Update payroll in state
      setPayrolls(payrolls.map((payroll) => (payroll._id === payrollId ? response.data : payroll)));
      return response.data; // Return updated payroll for further use
    } catch (error) {
      console.error('Error updating payroll:', error.response?.data?.message || error.message);
      throw error; // Rethrow error for handling in component
    }
  };

  // Load payrolls when the component mounts
  useEffect(() => {
    fetchPayrolls();
  }, []);

  return (
    <PayrollContext.Provider value={{ payrolls, fetchPayrolls, createPayroll, deletePayroll, updatePayroll }}>
      {children}
    </PayrollContext.Provider>
  );
};

// Custom hook to use the PayrollContext
export const usePayrolls = () => {
  return useContext(PayrollContext);
};
